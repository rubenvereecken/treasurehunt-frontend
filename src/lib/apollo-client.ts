import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
  from,
} from "@apollo/client";

import { SSELink, isLiveQuery } from "@grafbase/apollo-link";
import { getOperationAST } from "graphql";

import { setContext } from "@apollo/client/link/context";
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAFBASE_API_URL,
  credentials: "same-origin",
});

const secret = process.env.NEXTAUTH_SECRET;

export function getApolloClient(req: NextApiRequest) {
  const authMiddleware = setContext(async (_, { headers }) => {
    const token = await getToken({ req, secret, raw: true });

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  return new ApolloClient({
    link: from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
    ssrMode: typeof window === "undefined",
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}
