// hooks/useAllWorkspaces.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentWorkspace } from "../actions";

export function useCurrentWorkspace(workspaceId?: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const res = await fetchCurrentWorkspace(workspaceId!);

      if (!res.ok) {
        throw new Error(res.message || "Failed to fetch workspaces");
      }

      return res.data;
    },
  });
}
