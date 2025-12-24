"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchMembers } from "../actions";

export function useFetchMembers() {
  return useMutation({
    mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
      return await fetchMembers({
        workspaceId,
      });
    },
  });
}
