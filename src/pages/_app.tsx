import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { ApolloProviderWrapper } from "../components/apollo-provider-wrapper";
import { Header } from "@/components/header";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProviderWrapper>
        <Header />
        <Component {...pageProps} />
      </ApolloProviderWrapper>
    </SessionProvider>
  );
}
