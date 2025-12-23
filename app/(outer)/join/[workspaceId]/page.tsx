"use client";
import Loading from "@/components/shared/loading";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { redirect, useParams, useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useJoinWorkspace } from "@/module/settings/members/hooks/useJoinWorkspace";
import { toast } from "sonner";

const JoinPage = () => {
  const { status, data: session } = useSession();
  const [joinerCode, setJoinerCode] = useState<string>("");
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";
  const router = useRouter();
  const {workspaceId} = useParams<{workspaceId: string}>();

  const { mutateAsync, isPending } = useJoinWorkspace();

  const handleJoin = async () => {
    if (!session?.user?.id || joinerCode.length !== 6 || !inviteToken) return;

    try {
      const res = await mutateAsync({
        inviteToken,
        joinerCode,
        userId: session.user.id,
      });

      if (res.ok) {
        toast.success(res.message);
        router.push(`/dashboard/${workspaceId}/agents`)
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to join workspace");
      console.error(err);
    }
  };

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-8 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-black dark:text-white text-center">
            Join a Workspace
          </h1>
          <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">
            Sign in to continue
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: window.location.href })}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-black/20 dark:border-white/20 px-5 py-3 text-sm font-medium text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-black dark:text-white">
          Enter Joiner Code
        </h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Enter the 6-digit code you received from the workspace owner
        </p>

        <div className="mt-8 flex justify-center">
          <InputOTP
            maxLength={6}
            value={joinerCode}
            onChange={(value) => setJoinerCode(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={joinerCode.length !== 6 || isPending}
          onClick={handleJoin}
          className="mt-6 w-full rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white dark:bg-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {isPending ? "Joining…" : "Continue"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default JoinPage;
