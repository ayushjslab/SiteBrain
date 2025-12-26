"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentAgent } from "../actions";

export function useCurrentAgent(agentId?: string) {
  return useQuery({
    queryKey: ["agent", agentId],
    enabled: !!agentId,
    retry: false,
    queryFn: async () => {
      const res = await fetchCurrentAgent(agentId!);

      if (!res.ok) {
        throw new Error(res.message || "Failed to fetch agent");
      }
      return res.data;
    },
  });
}
