import { Types } from "mongoose";
import { model, models, Schema } from "mongoose";

const sourceSchema = new Schema(
  {
    workspace: {
      type: Types.ObjectId,
      ref: "Workspace",
      index: true,
    },

    agent: {
      type: Types.ObjectId,
      ref: "Agent",
      index: true,
    },
    type: {
      type: String,
      enum: ["qa", "text", "website", "docs"],
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },

    words: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Source = models.Source || model("Source", sourceSchema);

export default Source;
