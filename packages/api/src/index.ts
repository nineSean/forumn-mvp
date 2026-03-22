import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/aws-lambda";
import { authMiddleware } from "./middleware/auth";
import { createGraphQLYoga } from "./graphql/yoga";

const app = new Hono();

app.use("*", cors());
app.use("/graphql", authMiddleware);

const yoga = createGraphQLYoga();

app.on(["GET", "POST"], "/graphql", async (c) => {
  const response = await yoga.handle(c.req.raw);
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

app.get("/health", (c) => c.json({ status: "ok" }));

// Local dev server
if (process.env.NODE_ENV !== "production") {
  import("@hono/node-server").then(({ serve }) => {
    serve({ fetch: app.fetch, port: 4000 }, () => {
      console.log("API server running on http://localhost:4000");
    });
  });
}

// Lambda handler export
export const handler = handle(app);
