import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { getApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

import { authOptions } from "./auth/[...nextauth]";

const secret = process.env.NEXTAUTH_SECRET;

const AddNewMessageMutation = gql`
  mutation AddNewMessage(
    $roomId: ID!
    $username: String!
    $avatar: URL!
    $body: String!
  ) {
    messageCreate(
      input: {
        username: $username
        avatar: $avatar
        body: $body
        room: { link: $roomId }
      }
    ) {
      message {
        id
      }
    }
  }
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const apolloClient = getApolloClient(req);

  async function addNewMessage(variables: any) {
    const results = await apolloClient.mutate({
      mutation: AddNewMessageMutation,
      variables: variables,
    });

    return results;
  }

  const { roomId, username, avatar, body } = req.body;

  console.log(req.body);

  const result = await addNewMessage({
    roomId,
    username,
    avatar,
    body,
  });

  res.json({ result });
}
