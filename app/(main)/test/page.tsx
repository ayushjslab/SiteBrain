"use client"
import { fetchMembers } from "@/module/settings/members/actions";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session} = useSession();

  useEffect(() => {
    async function z(){
      const res = await fetchMembers({workspaceId:"694ba19bcce61dac356ce608"});

      console.log(res)
    }
    z()
  })

  if (session) {
    return (
      <div>
        <p>Signed in as {session?.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
