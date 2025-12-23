import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    members: [
      {
        member: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Admin", "Member", "Owner"],
          default: "Member",
        },
      },
    ],

    agents: [{ type: mongoose.Types.ObjectId, ref: "Agent" }],
  },
  { timestamps: true }
);

const Workspace =
  mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

export default Workspace;
