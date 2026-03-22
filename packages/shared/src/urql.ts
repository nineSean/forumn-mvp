// packages/shared/src/urql.ts
import { createClient, fetchExchange } from "urql";

export function createUrqlClient(url: string, getToken?: () => string | null) {
  return createClient({
    url,
    exchanges: [fetchExchange],
    fetchOptions: () => {
      const token = getToken?.();
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
  });
}
