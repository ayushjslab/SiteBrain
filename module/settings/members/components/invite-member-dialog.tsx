"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { HiOutlineClipboard, HiCheck } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import Loading from "@/components/shared/loading";
import { useParams } from "next/navigation";
import { useGenerateInvite } from "../hooks/useGenerateInvite";
import { useSetJoinerCode } from "../hooks/useGenerateInviteToken";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InviteWorkspaceDialog({ open, onOpenChange }: Props) {
  const [role, setRole] = useState<"Admin" | "Member">("Member");
  const [inviteLink, setInviteLink] = useState("");
  const [joinerCode, setJoinerCode] = useState("123456");
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const { data: session, status } = useSession();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const generateJoinerCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const { mutateAsync, isPending } = useGenerateInvite();
  const { mutateAsync: setCode, isPending: codePending } = useSetJoinerCode();

  const generateInvite = async () => {
    if (!workspaceId) return;

    const token = await mutateAsync({
      workspaceId,
      role,
      userId: session?.user?.id,
    });

    setInviteLink(
      `${process.env.NEXT_PUBLIC_APP_URL}/join/${workspaceId}?invite=${token}`
    );
  };

  const saveJoinerCode = async () => {
    try {
      if (!workspaceId || !session?.user?.id) return;

      let codeToSave = joinerCode;
      if (!/^\d{6}$/.test(joinerCode)) {
        codeToSave = Math.floor(100000 + Math.random() * 900000).toString();
        setJoinerCode(codeToSave);
      }

      await setCode({
        workspaceId,
        userId: session.user.id,
        code: codeToSave,
      });

      toast.success("Successfully set the code");
    } catch (error) {
      console.error(error);
      toast.error("Failed to set the code");
    }
  };

  const copyToClipboard = async (value: string, type: "link" | "code") => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            Invite to Workspace
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Role */}
          {status === "loading" ? (
            <Loading />
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-black/70 dark:text-white/70">
                Role
              </label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={generateInvite}
            disabled={isPending}
            className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black"
          >
            {isPending ? "Generating…" : "Generate Link"}
          </Button>

          {/* Result */}
          {inviteLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 rounded-2xl border border-black/10 dark:border-white/10 p-4"
            >
              {/* Invite link */}
              <div className="space-y-1">
                <p className="text-xs text-black/60 dark:text-white/60">
                  Invite Link
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="rounded-xl text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(inviteLink, "link")}
                    className="rounded-xl"
                  >
                    {copied === "link" ? (
                      <HiCheck className="h-4 w-4" />
                    ) : (
                      <HiOutlineClipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Joiner code */}

          <div className="space-y-1">
            <p className="text-xs text-black/60 dark:text-white/60">
              Joiner Code
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={joinerCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 6) setJoinerCode(val);
                }}
                className="rounded-xl text-xs font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(joinerCode, "code")}
              >
                {copied === "code" ? (
                  <HiCheck className="h-4 w-4" />
                ) : (
                  <HiOutlineClipboard className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => setJoinerCode(generateJoinerCode())}
              >
                Regenerate
              </Button>
            </div>
          </div>
          <Button
            onClick={saveJoinerCode}
            disabled={codePending}
            className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black"
          >
            {codePending ? "Saving..." : "Save code"}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
