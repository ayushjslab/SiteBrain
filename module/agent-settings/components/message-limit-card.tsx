"use client";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditAgent } from "../hooks/useEditAgent";
import { useParams } from "next/navigation";
import { toast } from "sonner";
export function MessageLimitCard() {
  const [enabled, setEnabled] = useState(true);
  const [limit, setLimit] = useState(100);
  const { mutateAsync, isPending } = useEditAgent();
  const { agentId } = useParams<{ agentId: string }>();

  async function handleSave() {
    try {
      await mutateAsync({
        agentId,
        enabledLimit: enabled,
        messageLimit: limit
      });
      toast.success("Successfully edit name");
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Message Limits
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60">
                Control usage per agent
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {/* Limit Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Messages</label>
            <Input
              type="number"
              disabled={!enabled}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-xl bg-transparent border-black/20 dark:border-white/20 focus-visible:ring-black dark:focus-visible:ring-white disabled:opacity-50"
            />
          </div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleSave}
              className="w-full rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 disabled:opacity-50"
            >
              {isPending ? "Saving...": "Save limits"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
