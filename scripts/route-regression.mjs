import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
export const DEFAULT_ROUTES = ["/", "/forum", "/user", "/search?q=test", "/admin"];
export const FAILURE_PATTERNS = [
  "Application error",
  "Internal Server Error",
  "NextRouter was not mounted",
  "No client has been specified using urql's Provider",
];

export function buildRouteUrl(baseUrl, route) {
  return new URL(route, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
}

export function detectRouteFailure(snapshotText) {
  return FAILURE_PATTERNS.find((pattern) => snapshotText.includes(pattern)) ?? null;
}

function runAgentBrowser(args, options = {}) {
  const output = execFileSync("agent-browser", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

  return typeof output === "string" ? output.trim() : "";
}

function timestamp() {
  return new Date().toISOString().replaceAll(":", "").replaceAll(".", "").replace("T", "-").slice(0, 15);
}

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.ROUTE_REGRESSION_BASE_URL || DEFAULT_BASE_URL,
    routes: [...DEFAULT_ROUTES],
    screenshotDir:
      process.env.ROUTE_REGRESSION_SCREENSHOT_DIR ||
      path.join(process.cwd(), "dogfood-output", "route-regression", timestamp()),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base-url") {
      args.baseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--routes") {
      args.routes = argv[index + 1]
        .split(",")
        .map((route) => route.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }

    if (arg === "--screenshot-dir") {
      args.screenshotDir = path.resolve(argv[index + 1]);
      index += 1;
    }
  }

  return args;
}

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function runRouteCheck({ baseUrl, route, screenshotDir }) {
  const url = buildRouteUrl(baseUrl, route);
  runAgentBrowser(["open", url]);
  runAgentBrowser(["wait", "--load", "networkidle"]);
  const snapshot = runAgentBrowser(["snapshot"]);
  const currentUrl = runAgentBrowser(["get", "url"]);
  const failure = detectRouteFailure(snapshot);
  const screenshotOutput = runAgentBrowser(["screenshot", "--screenshot-dir", screenshotDir]);
  const screenshotPath = screenshotOutput.match(/Screenshot saved to (.+)$/m)?.[1] ?? null;

  return {
    route,
    requestedUrl: url,
    currentUrl,
    snapshot,
    screenshotPath,
    failure,
  };
}

function formatSummary(results) {
  return results
    .map((result) => {
      const status = result.failure ? "FAIL" : "PASS";
      const reason = result.failure ? ` (${result.failure})` : "";
      return `${status} ${result.route} -> ${result.currentUrl}${reason}`;
    })
    .join("\n");
}

export function runRouteRegression(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  ensureDir(args.screenshotDir);
  runAgentBrowser(["close"], { stdio: "ignore" });

  const results = args.routes.map((route) =>
    runRouteCheck({ baseUrl: args.baseUrl, route, screenshotDir: args.screenshotDir })
  );
  const failures = results.filter((result) => result.failure);
  const summary = formatSummary(results);

  console.log(summary);
  console.log(`Screenshots: ${args.screenshotDir}`);

  if (failures.length > 0) {
    const error = new Error(`Route regression failed for ${failures.length} route(s).`);
    error.results = results;
    throw error;
  }

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    runRouteRegression();
  } catch (error) {
    if (error.results) {
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
