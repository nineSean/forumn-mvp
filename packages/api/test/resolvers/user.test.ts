import { describe, it, expect, vi } from "vitest";
import { createTestYoga, executeQuery, createMockContext } from "../helpers";
import bcrypt from "bcryptjs";

describe("User resolvers", () => {
  it("login returns user for valid credentials", async () => {
    const hash = await bcrypt.hash("password123", 10);
    const mockUser = { id: "u1", email: "a@b.com", name: "Alice", avatarUrl: null, passwordHash: hash, role: "member", createdAt: new Date() };
    const ctx = createMockContext();
    ctx.prisma.user = { findUnique: vi.fn().mockResolvedValue(mockUser) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `query { login(email: "a@b.com", password: "password123") { id name } }`
    );

    expect(result.data.login.name).toBe("Alice");
  });

  it("login returns null for wrong password", async () => {
    const hash = await bcrypt.hash("password123", 10);
    const mockUser = { id: "u1", email: "a@b.com", name: "Alice", passwordHash: hash, role: "member", createdAt: new Date() };
    const ctx = createMockContext();
    ctx.prisma.user = { findUnique: vi.fn().mockResolvedValue(mockUser) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `query { login(email: "a@b.com", password: "wrong") { id } }`
    );

    expect(result.data.login).toBeNull();
  });

  it("me requires authentication", async () => {
    const ctx = createMockContext();
    const yoga = createTestYoga(ctx);
    const result = await executeQuery(yoga, `query { me { id } }`);
    expect(result.errors[0].extensions.code).toBe("UNAUTHORIZED");
  });
});
