"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "../actions";

export function useFetchMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => fetchMembers({ workspaceId }),
    enabled: !!workspaceId,
  });
}
