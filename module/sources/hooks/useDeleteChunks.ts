import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChunksBySourceId } from "../actions";

export function useDeleteChunks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceId }: { sourceId: string }) => {
      await deleteChunksBySourceId(sourceId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}
