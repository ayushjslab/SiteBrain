import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const agentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    secretKey: {
      type: String,
      select: false,
    },
    image: {
      type: String,
      default: "/icon",
    },
    initialMessage: {
      type: String,
      default: "Hi! How can I help you ?",
    },
    persona: {
      type: String,
      enum: ["support", "sales", "assistant"],
      default: "support",
    },
    modelConfig: {
      model: {
        type: String,
        default: "Gemini 2.5 Flash‑Lite",
      },
      temperature: {
        type: Number,
        default: 0.3,
      },
      maxTokens: {
        type: Number,
        default: 512,
      },
    },
    actions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

agentSchema.pre("save", async function () {
  if (!this.secretKey) {
    this.secretKey = crypto.randomBytes(32).toString("hex");
  }
});

const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);

export default Agent;
