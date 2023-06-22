import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Room() {
  const { data: session, status } = useSession();
  const router = useRouter();
}
