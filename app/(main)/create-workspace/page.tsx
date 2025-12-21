"use client"

import { motion } from "framer-motion";
import { HiPlus, HiOutlineFolder } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";

const workspaces = [
  {
    name: "Design System",
    role: "Owner",
    createdAt: "Aug 12, 2025",
  },
  {
    name: "Marketing Hub",
    role: "Admin",
    createdAt: "Sep 02, 2025",
  },
  {
    name: "Client Portal",
    role: "Member",
    createdAt: "Oct 18, 2025",
  },
];

const roleStyles: Record<string, string> = {
  Owner: "bg-black text-white dark:bg-white dark:text-black",
  Admin:
    "border border-black/30 text-black dark:border-white/30 dark:text-white",
  Member:
    "bg-black/5 text-black dark:bg-white/10 dark:text-white",
};

export default function CreateWorkspacePage() {
  return (
    <div className="bg-white dark:bg-black transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div>
            <h1 className="text-3xl font-semibold text-black dark:text-white">
              Create Workspace
            </h1>

            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              Give your workspace a name. You can change it later.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <label className="block text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-2">
                Workspace name
              </label>

              <input
                type="text"
                placeholder="e.g. Product Team"
                className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black transition-all"
              >
                <HiPlus size={18} />
                Create Workspace
              </motion.button>
            </motion.div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Your Workspaces
            </h2>

            <div className="mt-6 space-y-4">
              {workspaces.map((ws, index) => (
                <motion.div
                  key={ws.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-4 shadow-sm cursor-pointer"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                      <HiOutlineFolder className="text-black dark:text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {ws.name}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        Created {ws.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${roleStyles[ws.role]}`}
                    >
                      {ws.role}
                    </span>
                    <FiUsers className="text-black/40 dark:text-white/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
