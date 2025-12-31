import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChunksWithEmbedding } from "../actions";

type CreateChunksInput = {
  text: string;
  type: "qa" | "text";
  workspaceId: string;
  agentId: string;
  title?: string;
  words?: number;
};

export function useCreateChunks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      type,
      workspaceId,
      agentId,
      title,
      words,
    }: CreateChunksInput) => {
      if (!text) return [];
      return await createChunksWithEmbedding({
        rawText: text,
        agentId,
        workspaceId,
        type,
        title,
        words,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}
