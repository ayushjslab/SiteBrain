"use client"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function DeleteAllChatsCard() {
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
              Danger Zone
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              This action cannot be undone
            </p>
          </div>

          {/* Warning Box */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5">
            <Trash2 className="w-6 h-6 text-black dark:text-white" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete all chats</p>
              <p className="text-xs text-black/60 dark:text-white/60">
                Permanently removes all conversation history for this agent.
              </p>
            </div>
          </div>

          {/* Delete Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              className="w-full rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Chats
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
