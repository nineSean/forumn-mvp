import { unauthorized } from "../../lib/errors";
import bcrypt from "bcryptjs";

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: any) => {
      if (!ctx.userId) unauthorized();
      return ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string },
      ctx: any
    ) => {
      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) return null;
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;
      return user;
    },
  },
};
