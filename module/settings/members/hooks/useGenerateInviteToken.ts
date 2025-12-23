"use client"

import { useMutation } from "@tanstack/react-query"
import { setJoinerCode } from "../actions"

export function useSetJoinerCode() {
  return useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
      code,
    }: {
      workspaceId: string
      userId: string  | undefined
      code: string
    }) => {
      return await setJoinerCode({
        workspaceId,
        userId,
        code,
      })
    },
  })
}
