import { getApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";

const secret = process.env.NEXTAUTH_SECRET;

const AddNewRoom = gql`
  mutation AddNewRoom($slug: String!, $name: String!) {
    roomCreate(input: { slug: $slug, name: $name }) {
      room {
        id
      }
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apolloClient = getApolloClient(req);

  async function addNewRoom(variables: any) {
    const results = await apolloClient.mutate({
      mutation: AddNewRoom,
      variables: variables,
    });

    return results;
  }

  async function createRooms() {
    const results = await Promise.allSettled([
      addNewRoom({ slug: "test1", name: "Test 1" }),
      addNewRoom({ slug: "test2", name: "Test 2" }),
      addNewRoom({ slug: "blue", name: "Blue" }),
      addNewRoom({ slug: "red", name: "Red" }),
    ]);
    return results;
  }

  try {
    const results = await createRooms();
    res.json({ results });
  } catch (e) {
    console.log(e);
    res.json({ e });
  }
}
