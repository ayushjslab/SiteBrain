"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EditWorkspaceDialog } from "./edit-workspace-dialog";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import { useGetMemberRole } from "../hooks/useGetMemberRole";
import Loading from "@/components/shared/loading";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WorkspaceGeneralSettingsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const { mutateAsync, isPending } = useGetMemberRole();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!workspaceId || !session?.user?.id) return;

    mutateAsync({
      workspaceId,
      userId: session.user.id,
    }).then((res) => {
      if (res.ok) {
        setRole(res.role);
      }
    });
  }, [workspaceId, session?.user?.id]);

  if (isPending || status === "loading" || !role) {
    return <Loading />;
  }

  // 🚫 Access denied UI
  if (role !== "Owner") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md rounded-xl border bg-background p-6 text-center"
        >
          <h2 className="text-xl font-semibold text-foreground">
            Access denied
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You don’t have permission to access these settings.
          </p>

          <Alert className="mt-4" variant="destructive">
            <AlertDescription>
              Your role in this workspace is <b>{role}</b>.  
              Only workspace <b>Owners</b> can manage general settings.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  // ✅ Owner UI
  return (
    <div className="px-6 py-8">
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

          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete workspace
          </Button>
        </div>
      </motion.section>

      <EditWorkspaceDialog open={editOpen} onOpenChange={setEditOpen} />
      <DeleteWorkspaceDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
}
