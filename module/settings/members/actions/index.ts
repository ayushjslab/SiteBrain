"use server";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/user";
import Workspace from "@/models/workspace";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
type Role = "Admin" | "Member";

export async function generateInviteToken({
  workspaceId,
  role,
  userId,
}: {
  workspaceId: string;
  role: Role;
  userId: string | undefined;
}) {
  if (!workspaceId || !role || !userId) {
    throw new Error("Invalid invite data");
  }

  const payload = {
    workspaceId,
    role,
    userId,
  };

  const token = jwt.sign(payload, process.env.INVITE_JWT_SECRET!, {
    expiresIn: "7d",
  });

  return token;
}
export async function setJoinerCode({
  workspaceId,
  userId,
  code,
}: {
  workspaceId: string;
  userId: string | undefined;
  code: string;
}) {
  try {
    if (!workspaceId || !userId || !code) {
      return {
        ok: false,
        message: "Please provide required field",
      };
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId);

    if (
      workspace.createdBy.toString() !== new Types.ObjectId(userId).toString()
    ) {
      return {
        ok: false,
        message: "Only owner can generate invite code",
      };
    }
    workspace.joinCode = code;
    await workspace.save();

    return {
      ok: true,
      message: "Invite code generated successfully",
      joinerCode: code,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Internal server error",
    };
  }
}

type JoinWorkspaceProps = {
  inviteToken: string;
  joinerCode: string;
  userId: string;
};

export async function joinWorkspace({
  inviteToken,
  joinerCode,
  userId,
}: JoinWorkspaceProps) {
  try {
    if (!inviteToken || !joinerCode || !userId) {
      return { ok: false, message: "Missing required fields" };
    }

    await connectDB();

    const payload = jwt.verify(inviteToken, process.env.INVITE_JWT_SECRET!) as {
      workspaceId: string;
      role: "Admin" | "Member";
      userId: string;
    };

    const workspace = await Workspace.findById(payload.workspaceId);

    if (!workspace) {
      return { ok: false, message: "Workspace not found" };
    }

    if (workspace?.membersLimit === 0) {
      return { ok: false, message: "You doesn't have enough credit" };
    }

    if (workspace.joinCode !== joinerCode) {
      return { ok: false, message: "Invalid joiner code" };
    }

    const alreadyMember = workspace.members.some(
      (m: any) => m.member.toString() === userId
    );
    if (alreadyMember) {
      return {
        ok: true,
        message: "Already joined",
        role: workspace.members.find((m: any) => m.member.toString() === userId)
          ?.role,
      };
    }

    workspace.members.push({
      member: userId,
      role: payload.role,
    });

    workspace.membersLimit -= 1;

    await User.findByIdAndUpdate(
      userId,
      { workspace: new Types.ObjectId(payload.workspaceId) },
      { new: true }
    );

    await workspace.save();

    return {
      ok: true,
      message: "Joined workspace successfully",
      role: payload.role,
    };
  } catch (error: any) {
    console.error("JOIN_WORKSPACE_ERROR:", error);
    if (error.name === "JsonWebTokenError") {
      return { ok: false, message: "Invalid or expired token" };
    }
    return { ok: false, message: "Internal server error" };
  }
}

export async function fetchMembers({ workspaceId }: { workspaceId: string }) {
  try {
    if (!workspaceId) {
      return {
        ok: false,
        message: "Workspace ID is required",
        members: [],
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
        members: [],
      };
    }

    const memberIds = workspace.members.map((m: any) => m.member);

    const users = await User.find({ _id: { $in: memberIds } })
      .select("name email")
      .lean();

    const members = users.map((user) => {
      const memberInfo = workspace.members.find(
        (m: any) => m.member.toString() === user._id.toString()
      );

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: memberInfo?.role ?? "Member",
      };
    });

    return {
      ok: true,
      members,
    };
  } catch (error) {
    console.error("Fetch members error:", error);
    return {
      ok: false,
      message: "Something went wrong",
      members: [],
    };
  }
}

