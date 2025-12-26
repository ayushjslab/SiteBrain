import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAgent } from "../actions";

type DeleteAgentInput = {
  agentId: string;
  workspaceId: string;
};

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteAgentInput) => {
      const res = await DeleteAgent(data);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["agent", variables.agentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
    },
  });
}
