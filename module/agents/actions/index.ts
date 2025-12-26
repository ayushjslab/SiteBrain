"use server";

import { connectDB } from "@/lib/connectDB";
import Agent from "@/models/agent";
import Workspace from "@/models/workspace";
import mongoose from "mongoose"
;
export async function CreateNewAgent({
  workspaceId,
  name,
  image,
  persona,
}: {
  workspaceId: string;
  name: string;
  image: string;
  persona: string;
}) {
  try {
    if (!workspaceId || !name || !image || !persona) {
      return {
        ok: false,
        message: "Missing required fields",
      };
    }

    await connectDB();
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }
    if (workspace.agentsLimit <= 0) {
      return {
        ok: false,
        message: "You don't have enough credit",
      };
    }
    const newAgent = await Agent.create({
      workspace: new mongoose.Types.ObjectId(workspaceId),
      name,
      image,
      persona,
    });
    workspace.agents.push(newAgent._id);
    workspace.agentsLimit -= 1;
    await workspace.save();
    return {
      ok: true,
      message: "Agent created successfully",
      agent: {
        id: newAgent._id.toString(),
        name: newAgent.name,
        image: newAgent.image,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Something went wrong",
    };
  }
}

export async function FetchAllAgents(workspaceId: string) {
  try {
    if (!workspaceId) {
      return {
        ok: false,
        message: "Workspace ID is required",
      };
    }

    const workspace = await Workspace.findById(workspaceId)
      .select("agents")
      .populate({
        path: "agents",
        select: "name image updatedAt",
      })
      .lean();

    if (!workspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }

    const agents = (workspace.agents || []).map((agent: any) => ({
      id: agent._id.toString(),
      name: agent.name,
      image: agent.image,
      updatedAt: agent.updatedAt,
    }));

    return {
      ok: true,
      message: "Fetched successfully",
      agents,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Internal server error",
    };
  }
}

export async function fetchCurrentAgent(agentId: string) {
  try {
    if (!agentId) {
      return {
        ok: false,
        message: "Agent ID is required",
        data: null,
      };
    }

    await connectDB();

    const agent = await Agent.findById(agentId)
      .select("_id name")
      .lean();

    if (!agent) {
      return {
        ok: true,
        message: "Agent not found",
        data: null,
      };
    }

    return {
      ok: true,
      message: "Fetched successfully",
      data: {
        id: agent._id.toString(), 
        name: agent.name,
        image: agent.image,
        updatedAt: agent.updatedAt,
        
      },
    };
  } catch (error) {
    console.error("fetchCurrentAgent error:", error);
    return {
      ok: false,
      message: "Failed to fetch agent",
      data: null,
    };
  }
}