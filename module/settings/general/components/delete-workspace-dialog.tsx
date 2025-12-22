"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DeleteWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete workspace
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This action is permanent. All data, members, and agents
                associated with this workspace will be deleted forever.
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground">
              Please be absolutely sure before proceeding.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive">
                Yes, delete workspace
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
