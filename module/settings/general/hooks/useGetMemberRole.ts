import { useMutation } from "@tanstack/react-query";
import { getMemberRole } from "../actions";

type GetMemberRoleParams = {
  workspaceId: string;
  userId: string;
};

export function useGetMemberRole() {

  return useMutation({
    mutationFn: async (data: GetMemberRoleParams) => {
      const res = await getMemberRole(data);

      if (!res.ok) {
        throw new Error(res.message);
      }

      return res;
    },
  });
}
