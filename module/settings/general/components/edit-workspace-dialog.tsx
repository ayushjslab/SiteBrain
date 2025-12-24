"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditWorkspace } from "../hooks/useEditWorkspace";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function EditWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useEditWorkspace();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: session } = useSession();

  async function handleEdit() {
    if (!name.trim() || !workspaceId || !session?.user?.id) return;

    try {
      await mutateAsync({
        workspaceId,
        newName: name.trim(),
        userId: session.user.id,
      });
      toast.success("Successfully edit workspace")
      onOpenChange(false);
      setName("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit workspace")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>Edit workspace</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Input
              placeholder="Workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isPending || !name.trim()}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
