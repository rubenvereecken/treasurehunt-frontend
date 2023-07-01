import { useSession } from "next-auth/react";

import { Header } from "@/components/header";
import { MessageList } from "@/components/message-list";
import { NewMessageForm } from "@/components/new-message-form";
import { SignIn } from "@/components/signin";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="h-full flex flex-col bg-cover">
      <div className="h-full flex items-center justify-center flex-col space-y-2.5">
        {session ? (
          <div className="flex items-center space-x-5">
            <Link href="/rooms/test1">
              <button className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center">
                Hooks
              </button>
            </Link>
            <Link href="/rooms/test2">
              <button className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center">
                Sparrows
              </button>
            </Link>
          </div>
        ) : status === "loading" ? null : (
          <SignIn />
        )}
      </div>
    </div>
  );
}
