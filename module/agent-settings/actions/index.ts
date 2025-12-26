import Agent from "@/models/agent";

export async function EditAgent({
  agentId,
  newName,
  enabledLimit,
  messageLimit,
}: {
  agentId: string;
  newName?: string;
  enabledLimit?: boolean;
  messageLimit?: number;
}) {
  try {
    if (!agentId) {
      return {
        ok: false,
        message: "Agent ID is required",
      };
    }

    const updateData: Record<string, any> = {};

    if (newName !== undefined) updateData.name = newName;
    if (enabledLimit !== undefined)
      updateData.messageLimitEnabled = enabledLimit;
    if (messageLimit !== undefined)
      updateData.messageLimit = messageLimit;

    const updatedAgent = await Agent.findByIdAndUpdate(
      agentId,
      updateData,
      { new: true }
    );

    if (!updatedAgent) {
      return {
        ok: false,
        message: "Agent not found",
      };
    }

    return {
      ok: true,
      agent: updatedAgent,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Internal server error",
    };
  }
}
