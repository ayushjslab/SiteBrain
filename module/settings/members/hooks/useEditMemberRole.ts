import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMemberRole } from "../actions";

export function useEditMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
      newRole,
    }: {
      workspaceId: string;
      userId: string;
      newRole: "Admin" | "Member";
    }) => editMemberRole({ workspaceId, userId, newRole }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}
