// hooks/useAllWorkspaces.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { FetchAllAgents } from "../actions";

export function useFetchAgents(agentId?: string) {
  return useQuery({
    queryKey: ["agents", agentId],
    enabled: !!agentId,
    queryFn: async () => {
      const res = await FetchAllAgents(agentId!);

      if (!res.ok) {
        throw new Error(res.message || "Failed to fetch Agents");
      }
      return res.agents;
    },
  });
}
