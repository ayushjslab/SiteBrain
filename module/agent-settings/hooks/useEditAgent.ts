import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditAgent } from "../actions";

type EditAgentInput = {
  agentId: string;
  newName?: string;
  enabledLimit?: boolean;
  messageLimit?: number;
};

export function useEditAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditAgentInput) => {
      const res = await EditAgent(data);

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
        refetchType: "none",
      });
    },
  });
}
