import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { getApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

import { authOptions } from "./auth/[...nextauth]";
import botClient from "@/lib/bot-client";

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

  const { roomId, roomSlug, username, avatar, body } = req.body;

  const userMessagePromise = addNewMessage({
    roomId,
    username,
    avatar,
    body,
  });

  let botReply = " ";

  const botMessagePromise = botClient
    .sendMessage({
      message: body,
      username,
      roomSlug,
      // TODO change
      ismod: false,
    })
    .then(async (res) => {
      botReply = res.reply ?? " ";
      // This sometimes takes over 10s on Vercel, at which point it gets cut off
      return addNewMessage({
        roomId,
        body: botReply,
        username: "Admin Bot",
        avatar: "https://robohash.org/blacklady",
      });
    });

  const results = await Promise.allSettled([
    userMessagePromise,
    botMessagePromise,
  ]);

  console.log(results);

  res.json(botReply);
}
