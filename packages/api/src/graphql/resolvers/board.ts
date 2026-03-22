import { notFound, forbidden } from "../../lib/errors";

export const boardResolvers = {
  Query: {
    boards: async (_: unknown, __: unknown, ctx: any) => {
      return ctx.prisma.board.findMany({
        orderBy: { sortOrder: "asc" },
      });
    },
    board: async (_: unknown, { id }: { id: string }, ctx: any) => {
      const board = await ctx.prisma.board.findUnique({ where: { id } });
      if (!board) notFound("Board not found");
      return board;
    },
  },
  Mutation: {
    createBoard: async (
      _: unknown,
      { input }: { input: { name: string; description?: string } },
      ctx: any
    ) => {
      if (ctx.userRole !== "admin") forbidden();
      return ctx.prisma.board.create({
        data: {
          name: input.name,
          description: input.description ?? "",
        },
      });
    },
    updateBoard: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: { name?: string; description?: string; sortOrder?: number };
      },
      ctx: any
    ) => {
      if (ctx.userRole !== "admin") forbidden();
      const board = await ctx.prisma.board.findUnique({ where: { id } });
      if (!board) notFound("Board not found");
      return ctx.prisma.board.update({ where: { id }, data: input });
    },
  },
};
