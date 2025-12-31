import { useQuery } from "@tanstack/react-query";
import { sourceFetching } from "../actions";

export function useFetchSource({
  workspaceId,
  agentId,
  type,
}: {
  workspaceId: string;
  agentId: string;
  type: string;
}) {
  if (!workspaceId || !agentId || !type) {
    throw new Error("Missing required fields");
  }

  return useQuery({
    queryKey: ["sources", workspaceId, agentId, type],
    queryFn: async () => {
      return sourceFetching({ workspaceId, agentId, type });
    },
    enabled: !!workspaceId && !!agentId && !!type,
  });
}
