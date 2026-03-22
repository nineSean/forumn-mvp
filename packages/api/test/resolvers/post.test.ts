import { describe, it, expect, vi } from "vitest";
import { createTestYoga, executeQuery, createMockContext } from "../helpers";

describe("Post resolvers", () => {
  const mockAuthor = { id: "u1", email: "a@b.com", name: "Alice", avatarUrl: null, role: "member", createdAt: new Date() };
  const mockBoard = { id: "b1", name: "General", description: "", sortOrder: 0, createdAt: new Date() };

  it("createPost requires authentication", async () => {
    const ctx = createMockContext();
    const yoga = createTestYoga(ctx);

    const result = await executeQuery(
      yoga,
      `mutation { createPost(input: { boardId: "b1", title: "Hello", content: "World" }) { id } }`
    );

    expect(result.errors[0].extensions.code).toBe("UNAUTHORIZED");
  });

  it("createPost succeeds for authenticated user", async () => {
    const mockPost = {
      id: "p1", title: "Hello", content: "World", replyCount: 0,
      createdAt: new Date(), updatedAt: new Date(),
      author: mockAuthor, board: mockBoard,
    };
    const ctx = createMockContext({ userId: "u1", userRole: "member" });
    ctx.prisma.post = { create: vi.fn().mockResolvedValue(mockPost) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `mutation { createPost(input: { boardId: "b1", title: "Hello", content: "World" }) { id title } }`
    );

    expect(result.data.createPost.title).toBe("Hello");
  });

  it("deletePost only allowed by author or admin", async () => {
    const mockPost = { id: "p1", authorId: "u2" };
    const ctx = createMockContext({ userId: "u1", userRole: "member" });
    ctx.prisma.post = { findUnique: vi.fn().mockResolvedValue(mockPost) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(yoga, `mutation { deletePost(id: "p1") }`);

    expect(result.errors[0].extensions.code).toBe("FORBIDDEN");
  });

  it("posts returns cursor-based paginated results", async () => {
    const mockPosts = [
      { id: "p1", title: "Post 1", content: "c", replyCount: 0, createdAt: new Date("2026-01-02"), updatedAt: new Date(), author: mockAuthor, board: mockBoard },
      { id: "p2", title: "Post 2", content: "c", replyCount: 0, createdAt: new Date("2026-01-01"), updatedAt: new Date(), author: mockAuthor, board: mockBoard },
    ];
    const ctx = createMockContext();
    ctx.prisma.post = { findMany: vi.fn().mockResolvedValue(mockPosts) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `query { posts(boardId: "b1", limit: 10) { edges { node { id title } cursor } pageInfo { hasNextPage } } }`
    );

    expect(result.data.posts.edges).toHaveLength(2);
    expect(result.data.posts.pageInfo.hasNextPage).toBe(false);
  });
});
