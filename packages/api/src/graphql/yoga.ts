import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { prisma } from "../lib/prisma";

export function createGraphQLYoga() {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return createYoga({
    schema,
    context: ({ request }) => {
      const userId = (request as any).userId;
      const userRole = (request as any).userRole;
      return { prisma, userId, userRole };
    },
    graphqlEndpoint: "/graphql",
  });
}
