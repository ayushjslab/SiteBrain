"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteAgent } from "../hooks/useDeleteAgent";
import { toast } from "sonner";

export function DeleteAgentCard() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { agentId } = useParams<{ agentId: string }>();
  const { mutateAsync, isPending } = useDeleteAgent();
  const router = useRouter();
  async function handleDelete() {
    try {
      await mutateAsync({
        agentId,
        workspaceId,
      });
      toast.success("Successfully delete agent");
      router.replace(`/dashboard/${workspaceId}/agents`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit name");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-10"
    >
      <Card className="rounded-2xl shadow-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Agent Control
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Permanently remove this agent
            </p>
          </div>

          {/* Warning Box */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <UserX className="w-6 h-6 text-black dark:text-white" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete agent</p>
              <p className="text-xs text-black/60 dark:text-white/60">
                This will delete the agent, its settings, and all associated
                data.
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full rounded-xl flex items-center gap-2"
            >
              {isPending ? (
                "Deleting..."
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  Delete Agent
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
