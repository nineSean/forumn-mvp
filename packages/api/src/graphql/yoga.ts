import { createYoga } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { prisma } from "../lib/prisma";

export function createGraphQLYoga() {
  return createYoga({
    schema: {
      typeDefs,
      resolvers,
    },
    context: ({ request }) => {
      // userId and userRole are set by auth middleware on the request
      const userId = (request as any).userId;
      const userRole = (request as any).userRole;
      return { prisma, userId, userRole };
    },
    graphqlEndpoint: "/graphql",
  });
}
