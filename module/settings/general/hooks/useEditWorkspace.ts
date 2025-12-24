import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditWorkspace } from "../actions";

type EditWorkspaceInput = {
  newName: string;
  workspaceId: string;
  userId: string;
};

export function useEditWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EditWorkspaceInput) => {
      const res = await EditWorkspace(data);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
        refetchType: 'none',
      });
    },
  });
}
