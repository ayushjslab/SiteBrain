import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ["PRO","FREE"],
    default: "FREE"
  },
  workspaceLimit: {
    type: Number,
    default: 1
  },
  workspace: [{ type: mongoose.Types.ObjectId, ref: "Workspace" }],
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
