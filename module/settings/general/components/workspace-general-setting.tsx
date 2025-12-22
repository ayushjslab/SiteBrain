"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EditWorkspaceDialog } from "./edit-workspace-dialog"
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog"

export default function WorkspaceGeneralSettingsPage() {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          General Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your workspace configuration and safety settings
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 rounded-xl border bg-background p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Workspace details
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your workspace name and description
            </p>
          </div>

          <Button variant="outline" onClick={() => setEditOpen(true)}>
            Edit workspace
          </Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-destructive">
              Danger zone
            </h2>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is permanent and cannot be undone
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete workspace
          </Button>
        </div>
      </motion.section>

      <EditWorkspaceDialog open={editOpen} onOpenChange={setEditOpen} />
      <DeleteWorkspaceDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}
