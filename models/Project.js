import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    startingImages: {
      type: [String],
      required: true,
    },
    finishedImages: {
      type: [String],
      required: false,
    },
    status: {
      type: String,
      enum: ["starting", "ongoing", "completed"],
      default: "starting",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
