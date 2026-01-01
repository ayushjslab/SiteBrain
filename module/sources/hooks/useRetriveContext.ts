import { useQuery } from "@tanstack/react-query";
import { aiGeneratedText } from "../actions";

export function useAIGeneratedText({
  workspaceId, agentId,
}: {
  workspaceId: string;
  agentId: string;
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
        query: "When and where was Mahatma Gandhi Died",
      });
    },
    enabled: !!workspaceId && !!agentId
  });
}
