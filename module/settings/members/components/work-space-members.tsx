"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import  InviteWorkspaceDialog from "./invite-member-dialog"
import { Edit, Trash2Icon } from "lucide-react"

const members = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@workspace.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@workspace.com",
    role: "Member",
  },
]

export default function WorkspaceMembersPage() {
  const [open, setOpen] = useState(false)

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

        <Button onClick={() => setOpen(true)}>
          Invite member
        </Button>
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

          <TableBody >
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-white/0">
                <TableCell className="font-medium">
                  {member.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.email}
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs ${member.role === "Admin"  ? "bg-emerald-500" : "bg-yellow-500"}`}>
                    {member.role}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button  size="sm" className=" cursor-pointer">
                    <Edit/>
                    
                  </Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 cursor-pointer">
                    <Trash2Icon/>
                    
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <InviteWorkspaceDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
