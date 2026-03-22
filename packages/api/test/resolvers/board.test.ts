import { describe, it, expect, vi } from "vitest";
import { createTestYoga, executeQuery, createMockContext } from "../helpers";

describe("Board resolvers", () => {
  it("boards returns all boards sorted by sortOrder", async () => {
    const mockBoards = [
      { id: "1", name: "General", description: "", sortOrder: 0, createdAt: new Date() },
      { id: "2", name: "Engineering", description: "Tech", sortOrder: 1, createdAt: new Date() },
    ];

    const ctx = createMockContext({ userRole: "member" });
    ctx.prisma.board = { findMany: vi.fn().mockResolvedValue(mockBoards) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(yoga, `{ boards { id name } }`);

    expect(result.data.boards).toHaveLength(2);
    expect(result.data.boards[0].name).toBe("General");
  });

  it("createBoard requires admin role", async () => {
    const ctx = createMockContext({ userId: "u1", userRole: "member" });
    const yoga = createTestYoga(ctx);

    const result = await executeQuery(
      yoga,
      `mutation { createBoard(input: { name: "Test" }) { id } }`
    );

    expect(result.errors[0].extensions.code).toBe("FORBIDDEN");
  });

  it("createBoard succeeds for admin", async () => {
    const mockBoard = { id: "1", name: "New Board", description: "", sortOrder: 0, createdAt: new Date() };
    const ctx = createMockContext({ userId: "u1", userRole: "admin" });
    ctx.prisma.board = { create: vi.fn().mockResolvedValue(mockBoard) } as any;

    const yoga = createTestYoga(ctx);
    const result = await executeQuery(
      yoga,
      `mutation { createBoard(input: { name: "New Board" }) { id name } }`
    );

    expect(result.data.createBoard.name).toBe("New Board");
  });
});
