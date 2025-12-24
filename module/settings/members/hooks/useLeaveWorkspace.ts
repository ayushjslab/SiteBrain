import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveWorkspace } from "../actions";

export function useLeaveWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
    }: {
      workspaceId: string;
      userId: string;
    }) => leaveWorkspace({ workspaceId, userId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}
