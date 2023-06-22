import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Gravatar, { GravatarOptions } from "react-awesome-gravatar";

const options: GravatarOptions = {
  size: 50,
  default: "robohash",
}; // check below for all available options

export function Header() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <header className="p-6 bg-white/5 border-b border-[#363739]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <p className="inline-flex items-center space-x-3">
            <span className="text-white font-bold text-xl">
              <Link href="/"> Treasure Hunt v1</Link>
            </span>
          </p>
          {session ? (
            <div className="flex space-x-1">
              {session?.user?.image ? (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <Image
                    width={50}
                    height={50}
                    src={session?.user?.image}
                    alt={session?.user?.name || "User profile picture"}
                  />
                </div>
              ) : (
                <Gravatar email={session.user.email} options={options}>
                  {(url: string) => (
                    <Image
                      src={url}
                      alt={session.user.name!}
                      width="50"
                      height="50"
                    />
                  )}
                </Gravatar>
              )}
              <button
                onClick={() => signOut()}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white border border-transparent"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center"></div>
          )}
        </div>
      </div>
    </header>
  );
}
