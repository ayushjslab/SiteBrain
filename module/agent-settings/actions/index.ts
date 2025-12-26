"use server";
import { connectDB } from "@/lib/connectDB";
import Agent from "@/models/agent";
import Workspace from "@/models/workspace";

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
    if (messageLimit !== undefined) updateData.messageLimit = messageLimit;

    await connectDB();

    const updatedAgent = await Agent.findByIdAndUpdate(agentId, updateData, {
      new: true,
    });

    if (!updatedAgent) {
      return {
        ok: false,
        message: "Agent not found",
      };
    }

    return {
      ok: true,
      agent: {
        id: updatedAgent._id.toString(),
        name: updatedAgent.name,
        messageLimit: updatedAgent.messageLimit,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Internal server error",
    };
  }
}

export async function DeleteAgent({
  workspaceId,
  agentId,
}: {
  workspaceId: string;
  agentId: string;
}) {
  try {
    if (!workspaceId || !agentId) {
      return {
        ok: false,
        message: "Missing required IDs",
      };
    }

    const workspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      { $pull: { agents: agentId }, $inc: { agentsLimit: 1 } },

      { new: true }
    );

    if (!workspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }

    await Agent.findByIdAndDelete(agentId);

    return {
      ok: true,
      message: "Agent deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Internal server error",
    };
  }
}
