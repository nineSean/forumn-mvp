import type { AppProps } from "next/app";
import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UrqlProvider value={urqlClient}>
      <Component {...pageProps} />
    </UrqlProvider>
  );
}
