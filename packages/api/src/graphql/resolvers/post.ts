import { unauthorized, forbidden, notFound } from "../../lib/errors";

const DEFAULT_LIMIT = 20;

function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString("base64");
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  const decoded = Buffer.from(cursor, "base64").toString("utf-8");
  const [iso, id] = decoded.split("|");
  return { createdAt: new Date(iso), id };
}

export const postResolvers = {
  Query: {
    posts: async (
      _: unknown,
      {
        boardId,
        cursor,
        limit,
      }: { boardId: string; cursor?: string; limit?: number },
      ctx: any
    ) => {
      const take = Math.min(limit ?? DEFAULT_LIMIT, 50);

      const where: any = { boardId };
      if (cursor) {
        const { createdAt, id } = decodeCursor(cursor);
        where.OR = [
          { createdAt: { lt: createdAt } },
          { createdAt: createdAt, id: { lt: id } },
        ];
      }

      const posts = await ctx.prisma.post.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: take + 1,
        include: { author: true, board: true },
      });

      const hasNextPage = posts.length > take;
      const edges = posts.slice(0, take).map((post: any) => ({
        node: post,
        cursor: encodeCursor(post.createdAt, post.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },

    post: async (_: unknown, { id }: { id: string }, ctx: any) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          board: true,
          replies: {
            include: { author: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (!post) notFound("Post not found");
      return post;
    },

    searchPosts: async (
      _: unknown,
      {
        query,
        cursor,
        limit,
      }: { query: string; cursor?: string; limit?: number },
      ctx: any
    ) => {
      const take = Math.min(limit ?? DEFAULT_LIMIT, 50);
      const sanitized = query.replace(/[^\w\s]/g, " ").trim();
      if (!sanitized) {
        return { edges: [], pageInfo: { hasNextPage: false, endCursor: null } };
      }

      const tsquery = sanitized.split(/\s+/).join(" & ");

      // Use raw query for full-text search
      const cursorClause = cursor
        ? (() => {
            const { createdAt, id } = decodeCursor(cursor);
            return `AND (p.created_at < '${createdAt.toISOString()}' OR (p.created_at = '${createdAt.toISOString()}' AND p.id < '${id}'))`;
          })()
        : "";

      const posts = await ctx.prisma.$queryRawUnsafe(`
        SELECT p.*,
               row_to_json(u.*) as author,
               row_to_json(b.*) as board
        FROM posts p
        JOIN users u ON p.author_id = u.id
        JOIN boards b ON p.board_id = b.id
        WHERE p.search_vector @@ to_tsquery('english', $1)
        ${cursorClause}
        ORDER BY p.created_at DESC, p.id DESC
        LIMIT $2
      `, tsquery, take + 1);

      const hasNextPage = (posts as any[]).length > take;
      const edges = (posts as any[]).slice(0, take).map((post: any) => ({
        node: {
          ...post,
          replyCount: post.reply_count,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          author: {
            ...post.author,
            avatarUrl: post.author.avatar_url,
            createdAt: post.author.created_at,
          },
          board: {
            ...post.board,
            sortOrder: post.board.sort_order,
            createdAt: post.board.created_at,
          },
        },
        cursor: encodeCursor(new Date(post.created_at), post.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    },
  },

  Mutation: {
    createPost: async (
      _: unknown,
      {
        input,
      }: { input: { boardId: string; title: string; content: string } },
      ctx: any
    ) => {
      if (!ctx.userId) unauthorized();
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          boardId: input.boardId,
          authorId: ctx.userId,
        },
        include: { author: true, board: true },
      });
    },

    updatePost: async (
      _: unknown,
      {
        id,
        input,
      }: { id: string; input: { title?: string; content?: string } },
      ctx: any
    ) => {
      if (!ctx.userId) unauthorized();
      const post = await ctx.prisma.post.findUnique({ where: { id } });
      if (!post) notFound("Post not found");
      if (post.authorId !== ctx.userId && ctx.userRole !== "admin") forbidden();
      return ctx.prisma.post.update({
        where: { id },
        data: input,
        include: { author: true, board: true },
      });
    },

    deletePost: async (_: unknown, { id }: { id: string }, ctx: any) => {
      if (!ctx.userId) unauthorized();
      const post = await ctx.prisma.post.findUnique({ where: { id } });
      if (!post) notFound("Post not found");
      if (post.authorId !== ctx.userId && ctx.userRole !== "admin") forbidden();
      await ctx.prisma.post.delete({ where: { id } });
      return true;
    },
  },
};
