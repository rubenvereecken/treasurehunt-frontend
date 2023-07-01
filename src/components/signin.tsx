import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function SignIn() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center flex-col space-y-5">
      <p className="text-white">
        Commence the Treasure Hunt! Please tell us who you are.
      </p>
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => signIn("google")}
          className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
        >
          Google
        </button>
      </div>
    </div>
  );
}
