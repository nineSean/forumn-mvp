import { boardResolvers } from "./board";
import { postResolvers } from "./post";
import { replyResolvers } from "./reply";
import { userResolvers } from "./user";

export const resolvers = {
  Query: {
    ...boardResolvers.Query,
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...boardResolvers.Mutation,
    ...postResolvers.Mutation,
    ...replyResolvers.Mutation,
  },
};
