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
