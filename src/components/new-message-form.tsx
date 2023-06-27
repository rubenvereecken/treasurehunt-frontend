import { gql, useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSound from "use-sound";

import { getGravatarUrl, GravatarOptions } from "react-awesome-gravatar";
import { useMessages } from "@/lib/hooks";
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

export const NewMessageForm = ({
  roomSlug,
  roomId,
}: {
  roomSlug: string;
  roomId: string;
}) => {
  const { data: session } = useSession();
  const [play] = useSound("sent.wav");
  const [body, setBody] = useState("");
  const [addNewMessage] = useMutation(AddNewMessageMutation, {
    onCompleted: () => play(),
  });
  const [isSending, setSending] = useState(false);

  // This is client-sided. Probably not great to expose my GPT endpoint like this
  // TODO once Grafbase refresh works, put this on an endpoint?
  async function sendMessage({
    username,
    avatar,
    body,
  }: {
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
      roomSlug,
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

        setSending(true);

        if (body) {
          sendMessage({
            username: session?.username ?? session?.user.name ?? "unknown",
            avatar:
              session?.user?.image ??
              getGravatarUrl(session?.user.email!, gravatarOptions),
            body,
          }).finally(() => setSending(false));
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
        disabled={!body || !session || isSending}
      >
        {isSending ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <span>Send</span>
        )}
      </button>
    </form>
  );
};
