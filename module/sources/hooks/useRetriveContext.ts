import { useQuery } from "@tanstack/react-query";
import { retriveContextForQuery, sourceFetching } from "../actions";

export function useRetriveContext({
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
      return retriveContextForQuery({
        workspaceId,
        agentId,
        query: "When and where was Mahatma Gandhi born",
      });
    },
    enabled: !!workspaceId && !!agentId
  });
}
