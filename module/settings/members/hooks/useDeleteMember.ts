import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "../actions";

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      requesterId,
    }: {
      workspaceId: string;
      memberId: string;
      requesterId: string;
    }) =>
      deleteMember({
        workspaceId,
        memberId,
        requesterId,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}
