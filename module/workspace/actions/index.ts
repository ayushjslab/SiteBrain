"use server";

import { connectDB } from "@/lib/connectDB";
import Workspace from "@/models/workspace";
import User from "@/models/user";

export async function createWorkspace(createdBy: string, name: string) {
  try {
    if (!createdBy || !name) {
      return { ok: false, message: "createdBy and name are required" };
    }

    await connectDB();

    const user = await User.findById(createdBy).select("workspaceLimit").lean();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.workspaceLimit <= 0) {
      return {
        ok: false,
        message: "You don't have credit to create a workspace",
      };
    }

    const newWorkspace = await Workspace.create({
      name,
      createdBy,
      members: [
        {
          member: createdBy,
          role: "Owner",
        },
      ],
    });

    await User.findByIdAndUpdate(createdBy, {
      $push: { workspace: newWorkspace._id },
    });

    return {
      ok: true,
      workspace: {
        id: newWorkspace._id.toString(),
        name: newWorkspace.name,
        createdAt: newWorkspace.createdAt.toISOString(),
        role: "Owner",
      },
    };
  } catch (error) {
    console.error("Workspace creation error:", error);

    return {
      ok: false,
      message: "Failed to create workspace",
    };
  }
}

export async function getUserWorkspaces(userId: string) {
  try {
    if (!userId) {
      return { ok: false, message: "User ID is required" };
    }

    await connectDB();

    const user = await User.findById(userId).select("workspace").lean();

    if (!user || user.workspace.length === 0) {
      return { ok: true, workspaces: [] };
    }

    const workspaces = await Workspace.find({
      _id: { $in: user.workspace },
    })
      .select("_id name updatedAt members")
      .sort({ updatedAt: -1 })
      .lean();

    const result = workspaces.map((ws) => {
      const member = ws.members.find(
        (m: any) => m.member.toString() === userId
      );

      return {
        id: ws._id.toString(),
        name: ws.name,
        updatedAt: ws.updatedAt.toISOString(),
        role: member?.role ?? "Member",
      };
    });

    return {
      ok: true,
      workspaces: result,
    };
  } catch (error) {
    console.error("Optimized workspace fetch error:", error);
    return {
      ok: false,
      message: "Failed to fetch workspaces",
    };
  }
}
