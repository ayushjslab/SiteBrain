// hooks/useGenerateInvite.ts
"use client"

import { useMutation } from "@tanstack/react-query"
import { generateInviteToken } from "../actions"

export function useGenerateInvite() {
  return useMutation({
    mutationFn: generateInviteToken,
  })
}
