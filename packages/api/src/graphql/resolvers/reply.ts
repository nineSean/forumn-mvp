import { unauthorized, forbidden, notFound } from "../../lib/errors";

export const replyResolvers = {
  Mutation: {
    createReply: async (
      _: unknown,
      { input }: { input: { postId: string; content: string } },
      ctx: any
    ) => {
      if (!ctx.userId) unauthorized();

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) notFound("Post not found");

      const [reply] = await ctx.prisma.$transaction([
        ctx.prisma.reply.create({
          data: {
            content: input.content,
            postId: input.postId,
            authorId: ctx.userId,
          },
          include: { author: true },
        }),
        ctx.prisma.post.update({
          where: { id: input.postId },
          data: { replyCount: { increment: 1 } },
        }),
      ]);

      return reply;
    },

    deleteReply: async (_: unknown, { id }: { id: string }, ctx: any) => {
      if (!ctx.userId) unauthorized();
      const reply = await ctx.prisma.reply.findUnique({ where: { id } });
      if (!reply) notFound("Reply not found");
      if (reply.authorId !== ctx.userId && ctx.userRole !== "admin") forbidden();

      await ctx.prisma.$transaction([
        ctx.prisma.reply.delete({ where: { id } }),
        ctx.prisma.post.update({
          where: { id: reply.postId },
          data: { replyCount: { decrement: 1 } },
        }),
      ]);

      return true;
    },
  },
};
