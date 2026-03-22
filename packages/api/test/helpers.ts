import { PrismaClient } from "@prisma/client";
import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../src/graphql/schema";
import { resolvers } from "../src/graphql/resolvers";

export type TestContext = {
  prisma: PrismaClient;
  userId?: string;
  userRole?: string;
};

// For unit tests: mock prisma, pass context directly
export function createMockContext(overrides?: Partial<TestContext>): TestContext {
  return {
    prisma: {} as PrismaClient, // Will be mocked per test
    userId: undefined,
    userRole: undefined,
    ...overrides,
  };
}

export function createTestYoga(context: TestContext) {
  return createYoga({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    context: () => context,
    maskedErrors: false,
  });
}

export async function executeQuery(
  yoga: ReturnType<typeof createTestYoga>,
  query: string,
  variables?: Record<string, unknown>
) {
  const response = await yoga.fetch("http://localhost/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}
