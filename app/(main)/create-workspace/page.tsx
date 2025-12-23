"use client";

import { motion } from "framer-motion";
import { HiPlus, HiOutlineFolder } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, getUserWorkspaces } from "@/module/workspace/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, FolderX } from "lucide-react";


const roleStyles: Record<string, string> = {
  Owner: "bg-black text-white dark:bg-white dark:text-black",
  Admin:
    "border border-black/30 text-black dark:border-white/30 dark:text-white",
  Member: "bg-black/5 text-black dark:bg-white/10 dark:text-white",
};

export default function CreateWorkspacePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchWorkspaces = async (userId: string) => {
    const res = await getUserWorkspaces(userId);

    if (!res.ok) {
      throw new Error(res.message);
    }

    return res.workspaces;
  };

  // Memoize user authentication state
  const isAuthenticated = useMemo(
    () => status === "authenticated" && !!session?.user?.id,
    [status, session?.user?.id]
  );

  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => fetchWorkspaces(session!.user.id),
    enabled: isAuthenticated,

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (workspaceName: string) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      return await createWorkspace(session.user.id, workspaceName);
    },
    onSuccess: (data) => {
      const workspaceId = data.workspace?.id;
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      if (data.ok) {
        toast.success(data.message);
        router.push(`/dashboard/${workspaceId}/agents`);
        return;
      } else {
        data.message === "Fail"
          ? router.push("/plans")
          : toast.error(data.message);
      }
      setName("");
    },
    onError: (error: Error) => {
      console.error("Failed to create workspace:", error);
      toast.error(error.message || "Failed to create workspace");
    },
  });

  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && isAuthenticated && !mutation.isPending;
  }, [name, isAuthenticated, mutation.isPending]);

  const handleCreate = useCallback(() => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter a workspace name");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in to create a workspace");
      return;
    }

    if (mutation.isPending) {
      return;
    }

    mutation.mutate(trimmedName);
  }, [name, isAuthenticated, mutation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && isFormValid) {
        handleCreate();
      }
    },
    [handleCreate, isFormValid]
  );

  if (status === "loading") {
    return (
      <div className="bg-white dark:bg-black transition-colors duration-500 flex items-center justify-center">
        <div className="text-black/60 dark:text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Create Workspace Section */}
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
              <label
                htmlFor="workspace-name"
                className="block text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-2"
              >
                Workspace name
              </label>

              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Product Team"
                disabled={mutation.isPending || !isAuthenticated}
                maxLength={100}
                autoComplete="off"
                className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Workspace name"
                aria-invalid={!isFormValid && name.length > 0}
              />

              <motion.button
                whileHover={{ scale: isFormValid ? 1.04 : 1 }}
                whileTap={{ scale: isFormValid ? 0.96 : 1 }}
                onClick={handleCreate}
                disabled={!isFormValid}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:shadow-none"
                aria-busy={mutation.isPending}
              >
                <HiPlus size={18} aria-hidden="true" />
                {mutation.isPending ? "Creating..." : "Create Workspace"}
              </motion.button>

              {!isAuthenticated && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Please sign in to create a workspace
                </p>
              )}
            </motion.div>
          </div>

          {/* Workspaces List Section */}
          <div className="w-full">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Your Workspaces
            </h2>

             {workspacesLoading && (
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
                <span>Loading workspaces…</span>
              </div>
            )}

            {!workspacesLoading && workspaces.length === 0 && (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-400 px-6 py-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/10">
                <FolderX className="h-5 w-5" />
                <span>No workspaces found</span>
              </div>
            )}

            <div className="mt-6 p-4 space-y-4 overflow-y-auto overflow-hidden h-72">
              {workspaces.map((ws, index) => (
                <motion.div
                  key={`${ws.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/dashboard/${ws.id}/agents`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      // Handle workspace selection
                    }
                  }}
                  aria-label={`${ws.name} workspace, ${ws.role} role`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                      <HiOutlineFolder
                        className="text-black dark:text-white"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {ws.name}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/50">
                        Created {ws.updatedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        roleStyles[ws.role]
                      }`}
                      aria-label={`Role: ${ws.role}`}
                    >
                      {ws.role}
                    </span>
                    <FiUsers
                      className="text-black/40 dark:text-white/40"
                      aria-hidden="true"
                    />
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
