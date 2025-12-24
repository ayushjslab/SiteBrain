"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function LeaveWorkspaceDialog({
  open,
  onOpenChange,
  onLeave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onLeave: () => void
}) {
    const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>Leave workspace</DialogTitle>
          </DialogHeader>

          <p className="mt-4 text-sm text-muted-foreground">
            You will lose access to all workspace data and members.
          </p>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Stay
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onLeave()
                router.push("/create-workspace")
                onOpenChange(false)
              }}
            >
              Leave workspace
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
