// hooks/useAllWorkspaces.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { FetchAllAgents } from "../actions";

export function useFetchAgents(workspaceId?: string) {
  return useQuery({
    queryKey: ["agent", workspaceId],
    enabled: !!workspaceId,
    queryFn: async () => {
      const res = await FetchAllAgents(workspaceId!);

      if (!res.ok) {
        throw new Error(res.message || "Failed to fetch Agents");
      }
      return res.agents;
    },
  });
}
