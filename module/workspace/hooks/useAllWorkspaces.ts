// hooks/useAllWorkspaces.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAllWorkspaces } from "../actions";

export function useAllWorkspaces(userId?: string) {
  return useQuery({
    queryKey: ["workspaces", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetchAllWorkspaces(userId!);

      if (!res.ok) {
        throw new Error(res.message || "Failed to fetch workspaces");
      }

      return res.data;
    },
  });
}
