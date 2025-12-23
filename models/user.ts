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
  workspace: [{ type: mongoose.Types.ObjectId, ref: "Workspace" }],
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
