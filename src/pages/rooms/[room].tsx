import { gql, useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRoomAndMessages } from "@/lib/hooks";
import { MessageList } from "@/components/message-list";
import { NewMessageForm } from "@/components/new-message-form";
import { SignIn } from "@/components/signin";

export default function Room() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const roomSlug = router.query.room as string;

  const { loading, error, data } = useRoomAndMessages({
    roomSlug: roomSlug,
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">
          Something went wrong. Refresh to try again.
        </p>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">{"Don't think this room exists..."}</p>
      </div>
    );

  const room = data!;

  return (
    <div className="flex flex-col bg-cover h-full">
      {session ? (
        <>
          <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <MessageList roomSlug={roomSlug} />
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/5 border-t border-[#363739]">
            <div className="max-w-4xl mx-auto">
              <NewMessageForm roomSlug={roomSlug} />
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center flex-col space-y-2.5">
          {status === "loading" ? null : <SignIn />}
        </div>
      )}
    </div>
  );
}
