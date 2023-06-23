import { gql, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSound from "use-sound";

import { getGravatarUrl, GravatarOptions } from "react-awesome-gravatar";
import { useRoomAndMessages } from "@/lib/hooks";
import botClient from "@/lib/bot-client";
const gravatarOptions: GravatarOptions = {
  size: 50,
  default: "retro",
}; // check below for all available options

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

export const NewMessageForm = ({ roomId }: { roomId: string }) => {
  const { data: session } = useSession();
  const [play] = useSound("sent.wav");
  const [body, setBody] = useState("");
  const [addNewMessage] = useMutation(AddNewMessageMutation, {
    onCompleted: () => play(),
  });

  // This is client-sided. Probably not great to expose my GPT endpoint like this
  // TODO once Grafbase refresh works, put this on an endpoint?
  async function sendMessage({
    roomId,
    username,
    avatar,
    body,
  }: {
    roomId: string;
    username: string;
    avatar: string;
    body: string;
  }) {
    addNewMessage({
      variables: {
        roomId,
        username,
        avatar,
        body,
      },
    });

    const res = await botClient.sendMessage({
      message: body,
      username,
      roomId,
      // TODO change
      ismod: false,
    });

    addNewMessage({
      variables: {
        body: res.reply,
        username: "Admin Bot",
        roomId,
        avatar: "https://robohash.org/blacklady",
      },
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (body) {
          sendMessage({
            roomId: roomId,
            username: session?.username ?? session?.user.name ?? "unknown",
            avatar:
              session?.user?.image ??
              getGravatarUrl(session?.user.email!, gravatarOptions),
            body,
          });
          setBody("");
        }
      }}
      className="flex items-center space-x-3"
    >
      <input
        autoFocus
        id="message"
        name="message"
        placeholder="Write a message..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="flex-1 h-12 px-3 rounded bg-[#222226] border border-[#222226] focus:border-[#222226] focus:outline-none text-white placeholder-white"
      />
      <button
        type="submit"
        className="bg-[#222226] rounded h-12 font-medium text-white w-24 text-lg border border-transparent hover:bg-[#363739] transition"
        disabled={!body || !session}
      >
        Send
      </button>
    </form>
  );
};
