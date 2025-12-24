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

export default function WorkspaceMembersPage() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { mutateAsync, isPending } = useFetchMembers();
  const { mutateAsync: roleMutate, isPending: roleLoading } =
    useGetMemberRole();

  const { data: session, status } = useSession();
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
  useEffect(() => {
    async function loadMembers() {
      if (!workspaceId) return;
      const res = await mutateAsync({ workspaceId });
      if (res.ok) setMembers(res.members);
    }
    loadMembers();
  }, [workspaceId, mutateAsync]);

  if (isPending || status === "loading") {
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
                <TableRow key={member.id} className="hover:bg-white/0">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        member.role === "Admin"
                          ? "bg-emerald-500 text-white"
                          : member.role === "Owner"
                          ? "bg-yellow-500 text-black"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {member.role}
                    </span>
                  </TableCell>

                  {canEditDelete && member.role !== "Owner" ? (
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" className="cursor-pointer">
                        <Edit />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                      >
                        <Trash2Icon />
                      </Button>
                    </TableCell>
                  ) : (
                    member.role !== "Owner" && member.id === session?.user.id && (
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" className="cursor-pointer">
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
    </div>
  );
}
