import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteWorkspace } from "../actions";

type DeleteWorkspaceInput = {
  workspaceId: string;
  userId: string;
};

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteWorkspaceInput) => {
      const res = await DeleteWorkspace(data);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });

      queryClient.removeQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
    },
  });
}
