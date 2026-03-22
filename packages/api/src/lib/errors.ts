import { GraphQLError } from "graphql";

export function unauthorized(message = "Not authenticated"): never {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}

export function forbidden(message = "Not authorized"): never {
  throw new GraphQLError(message, {
    extensions: { code: "FORBIDDEN" },
  });
}

export function notFound(message = "Not found"): never {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
