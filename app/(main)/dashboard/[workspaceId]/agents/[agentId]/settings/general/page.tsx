import AgentBasicCard from "@/module/agent-settings/components/agent-basic-card";
import { DeleteAgentCard } from "@/module/agent-settings/components/delete-agent-card";
import { DeleteAllChatsCard } from "@/module/agent-settings/components/delete-all-cats-card";
import { MessageLimitCard } from "@/module/agent-settings/components/message-limit-card";

const GeneralSettingsPage = () => {
  return (
    <div className="space-y-4">
      <div className="px-10 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Agent Settings</h1>
      <p className="text-black/60 dark:text-white/60">
        Manage behavior, limits, and dangerous actions
      </p>
      </div>
      <AgentBasicCard />
      <MessageLimitCard />
      <DeleteAllChatsCard />
      <DeleteAgentCard />
    </div>
  );
};

export default GeneralSettingsPage;
