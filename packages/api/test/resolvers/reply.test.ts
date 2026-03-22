import { describe, it, expect, vi } from "vitest";
import { createTestYoga, executeQuery, createMockContext } from "../helpers";

describe("Reply resolvers", () => {
  it("createReply requires authentication", async () => {
    const ctx = createMockContext();
    const yoga = createTestYoga(ctx);

    const result = await executeQuery(
      yoga,
      `mutation { createReply(input: { postId: "p1", content: "hi" }) { id } }`
    );

    expect(result.errors[0].extensions.code).toBe("UNAUTHORIZED");
  });

  it("createReply increments post reply count", async () => {
    const mockReply = { id: "r1", content: "hi", createdAt: new Date(), author: { id: "u1", name: "A", email: "a@b.com", avatarUrl: null, role: "member", createdAt: new Date() } };
    const ctx = createMockContext({ userId: "u1", userRole: "member" });
    ctx.prisma.post = { findUnique: vi.fn().mockResolvedValue({ id: "p1" }), update: vi.fn().mockResolvedValue({}) } as any;
    ctx.prisma.reply = { create: vi.fn().mockResolvedValue(mockReply) } as any;
    ctx.prisma.$transaction = vi.fn().mockResolvedValue([mockReply, {}]);

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `mutation { createReply(input: { postId: "p1", content: "hi" }) { id content } }`
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.createReply.content).toBe("hi");
    expect(ctx.prisma.$transaction).toHaveBeenCalled();
  });
});
