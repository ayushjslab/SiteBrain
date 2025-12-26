"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNewAgent } from "../actions";

interface CreateAgentInput {
  workspaceId: string;
  name: string;
  image: string;
  persona: string;
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAgentInput) => {
      const res = await CreateNewAgent(data);
      return res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agents", variables.workspaceId],
      });
    },
  });
}
