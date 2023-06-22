import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { Message } from "@/components/message";
import { useRoomAndMessages } from "@/lib/hooks";

export const MessageList = ({ roomSlug }: { roomSlug: string }) => {
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 1000,
  });

  const { loading, error, data } = useRoomAndMessages({
    roomSlug,
  });

  const room = data;
  const messages = room?.messages ?? [];

  useEffect(() => {
    if (entry?.target) {
      entry.target.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, entry?.target]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (error)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    );

  return (
    <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
      {!inView && messages.length && (
        <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
          <button
            className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
            onClick={() => {
              entry?.target.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }}
          >
            Scroll to see latest messages
          </button>
        </div>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};
