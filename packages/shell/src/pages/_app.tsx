import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";
import { Layout } from "../components/Layout";
import "../styles/globals.css";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <UrqlProvider value={urqlClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UrqlProvider>
    </SessionProvider>
  );
}
