"use server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import Workspace from "@/models/workspace";

export async function getMemberRole({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) {
  try {
    if (!workspaceId || !userId) {
      return {
        ok: false,
        message: "Missing required parameters",
      };
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId)
      .select("members")
      .lean();

    if (!workspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }

    const memberEntry = workspace.members.find(
      (m: any) => m.member.toString() === userId
    );

    if (!memberEntry) {
      return {
        ok: false,
        message: "User is not a member of this workspace",
      };
    }

    return {
      ok: true,
      role: memberEntry.role,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong",
    };
  }
}

export async function EditWorkspace({
  newName,
  workspaceId,
  userId,
}: {
  newName: string;
  workspaceId: string;
  userId: string;
}) {
  try {
    if (!workspaceId || !userId || !newName) {
      return {
        ok: false,
        message: "Missing required parameters",
      };
    }

    await connectDB();

    const roleResponse = await getMemberRole({ workspaceId, userId });

    if (!roleResponse?.ok) {
      return roleResponse;
    }

    if (roleResponse.role !== "Owner") {
      return {
        ok: false,
        message: "You don't have permission to edit this workspace",
      };
    }

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      { name: newName },
      { new: true }
    );

    if (!updatedWorkspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }

    return {
      ok: true,
      message: "Workspace updated successfully",
      workspace: updatedWorkspace,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong",
    };
  }
}

export async function DeleteWorkspace({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) {
  try {
    if (!workspaceId || !userId) {
      return {
        ok: false,
        message: "Missing required parameters",
      };
    }

    await connectDB();

    const roleResponse = await getMemberRole({ workspaceId, userId });

    if (!roleResponse?.ok) {
      return roleResponse;
    }

    if (roleResponse.role !== "Owner") {
      return {
        ok: false,
        message: "You don't have permission to delete this workspace",
      };
    }

    const workspace = await Workspace.findById(workspaceId)
      .select("members")
      .lean();

    if (!workspace) {
      return {
        ok: false,
        message: "Workspace not found",
      };
    }

    const memberIds = workspace.members.map((m: any) => m.member);

    await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { workspace: workspaceId } }
    );

    await User.findByIdAndUpdate(userId, { $inc: { workspaceLimit: 1 } });

    await Workspace.findByIdAndDelete(workspaceId);

    return {
      ok: true,
      message: "Workspace deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong",
    };
  }
}
