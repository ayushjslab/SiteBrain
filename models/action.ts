import mongoose, { Schema } from "mongoose";

const actionSchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
      index: true,
    },

    key: {
      type: String,
      required: true,
      lowercase: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    type: {
      type: String,
      enum: [
        "reply",
        "open_link",
        "call_api",
        "search_kb",
        "handoff_human",
        "store_memory"
      ],
      required: true,
    },

    config: {
      type: Schema.Types.Mixed,
    },

    isEnabled: {
      type: Boolean,
      default: true,
    },

    requiresAuth: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Action = mongoose.models.Action || mongoose.model("Action", actionSchema);

export default Action;
