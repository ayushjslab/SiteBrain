"use server";

import { connectDB } from "@/lib/connectDB";
import Agent from "@/models/agent";
import Workspace from "@/models/workspace";
import mongoose from "mongoose";

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
