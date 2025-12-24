"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InviteWorkspaceDialog from "./invite-member-dialog";
import { Edit, Trash2Icon } from "lucide-react";
import { useFetchMembers } from "../hooks/useFetchMembers";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetMemberRole } from "../../general/hooks/useGetMemberRole";
import { useEditMemberRole } from "../hooks/useEditMemberRole";
import { useDeleteMember } from "../hooks/useDeleteMember";
import { useLeaveWorkspace } from "../hooks/useLeaveWorkspace";
import { EditMemberRoleDialog } from "./edit-member-dialog";
import { DeleteMemberDialog } from "./delete-member-dialog";
import { LeaveWorkspaceDialog } from "./leave-workspace-dialog";

export default function WorkspaceMembersPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data, isLoading } = useFetchMembers(workspaceId);
   const members = data?.members ?? [];
  const { mutateAsync: roleMutate, isPending: roleLoading } =
    useGetMemberRole();

  const { data: session, status } = useSession();

  const { mutateAsync: editRole } = useEditMemberRole();
  const { mutateAsync: deleteMember } = useDeleteMember();
  const { mutateAsync: leaveWorkspace } = useLeaveWorkspace();

  useEffect(() => {
    if (!workspaceId || !session?.user?.id) return;

    roleMutate({
      workspaceId,
      userId: session.user.id,
    }).then((res) => {
      if (res.ok) {
        setRole(res.role);
      }
    });
  }, [workspaceId, session?.user?.id]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Workspace Members
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage who has access to your workspace
          </p>
        </div>

        {role !== "Member" && (
          <Button onClick={() => setOpen(true)}>Invite member</Button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border bg-background"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/0">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member) => {
              const canEditDelete =
                (role === "Admin" || role === "Owner") &&
                member.id !== session?.user?.id;

              return (
                <TableRow
                  key={member.id}
                  className="transition-all hover:bg-white/0 hover:shadow-sm"
                >
                  <TableCell className="font-medium">{member.name}</TableCell>

                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm
                  ${
                    member.role === "Admin"
                      ? "bg-emerald-500/90 text-white"
                      : member.role === "Owner"
                      ? "bg-yellow-400/90 text-black"
                      : "bg-blue-500/90 text-white"
                  }`}
                    >
                      {member.role}
                    </span>
                  </TableCell>

                  {canEditDelete && member.role !== "Owner" ? (
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setSelectedMember(member);
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                        onClick={() => {
                          setSelectedMember(member);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : (
                    member.role !== "Owner" &&
                    member.id === session?.user.id && (
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-muted border cursor-pointer"
                          onClick={() => setLeaveOpen(true)}
                        >
                          Leave
                        </Button>
                      </TableCell>
                    )
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>

      {role !== "Member" && (
        <InviteWorkspaceDialog open={open} onOpenChange={setOpen} />
      )}

      {selectedMember && (
        <>
          <EditMemberRoleDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            role={selectedMember.role}
            onSave={(newRole) =>
              editRole({
                workspaceId,
                userId: selectedMember.id,
                newRole,
              })
            }
          />

          <DeleteMemberDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={() =>
              deleteMember({
                workspaceId,
                memberId: selectedMember.id,
                requesterId: session!.user!.id,
              })
            }
          />
        </>
      )}

      <LeaveWorkspaceDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        onLeave={() =>
          leaveWorkspace({
            workspaceId,
            userId: session!.user!.id,
          })
        }
      />
    </div>
  );
}
