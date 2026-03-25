import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_ROUTES,
  buildRouteUrl,
  detectRouteFailure,
} from "./route-regression.mjs";

test("DEFAULT_ROUTES covers the shell regression smoke routes", () => {
  assert.deepEqual(DEFAULT_ROUTES, [
    "/",
    "/forum",
    "/user",
    "/search?q=test",
    "/admin",
  ]);
});

test("buildRouteUrl joins the base URL and route", () => {
  assert.equal(buildRouteUrl("http://127.0.0.1:3000", "/forum"), "http://127.0.0.1:3000/forum");
  assert.equal(
    buildRouteUrl("http://127.0.0.1:3000/", "/search?q=test"),
    "http://127.0.0.1:3000/search?q=test"
  );
});

test("detectRouteFailure returns null for healthy snapshots", () => {
  assert.equal(detectRouteFailure("Select a board from the sidebar."), null);
});

test("detectRouteFailure flags known runtime errors", () => {
  assert.equal(
    detectRouteFailure("Application error: a client-side exception has occurred while loading 127.0.0.1"),
    "Application error"
  );
  assert.equal(detectRouteFailure("Internal Server Error"), "Internal Server Error");
  assert.equal(
    detectRouteFailure("NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted"),
    "NextRouter was not mounted"
  );
});
