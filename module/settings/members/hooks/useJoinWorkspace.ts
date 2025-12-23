"use client";

import { useMutation } from "@tanstack/react-query";
import { joinWorkspace } from "../actions";

type JoinWorkspaceProps = {
  inviteToken: string;
  joinerCode: string;
  userId: string;
};

type JoinWorkspaceResponse = {
  ok: boolean;
  message: string;
  role?: string;
};

export function useJoinWorkspace() {
  return useMutation<JoinWorkspaceResponse, Error, JoinWorkspaceProps>({
    mutationFn: async ({ inviteToken, joinerCode, userId }) => {
      return await joinWorkspace({ inviteToken, joinerCode, userId });
    },
  });
}
