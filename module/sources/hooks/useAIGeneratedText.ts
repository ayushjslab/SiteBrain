import { useQuery } from "@tanstack/react-query";
import { aiGeneratedText } from "../actions";

export function useAIGeneratedText({
  workspaceId, agentId, query
}: {
  workspaceId: string;
  agentId: string;
  query: string;
}, p0: { enabled: boolean; }) {
  if (!workspaceId || !agentId ) {
    throw new Error("Missing required fields");
  }

  return useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      return aiGeneratedText({
        workspaceId,
        agentId,
        query,
      });
    },
    enabled: !!workspaceId && !!agentId
  });
}
