import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "dev-secret";

export async function authMiddleware(c: Context, next: Next) {
  const authorization = c.req.header("Authorization");

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        sub: string;
        role: string;
      };
      (c.req.raw as any).userId = payload.sub;
      (c.req.raw as any).userRole = payload.role;
    } catch {
      // Invalid token — proceed as unauthenticated
    }
  }

  await next();
}
