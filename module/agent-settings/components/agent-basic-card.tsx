"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgentBasicCard() {
  const [newName, setNewName] = useState("");

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
            <h2 className="text-xl font-semibold tracking-tight">Agent Overview</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Manage your agent details
            </p>
          </div>

          {/* Agent Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
                Agent Name
              </p>
              <p className="text-base font-medium">Alpha-01</p>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
                Agent Size
              </p>
              <p className="text-base font-medium">Large</p>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Agent Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="rounded-xl bg-transparent border-black/20 dark:border-white/20 focus-visible:ring-black dark:focus-visible:ring-white"
            />
          </div>

          {/* Save Button */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button className="w-full rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
              Save Changes
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
