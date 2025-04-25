import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    images: [{ type: String }],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // References the Category schema
        required: true,
      },
    ],
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory", // References the Subcategory schema
        required: false, // Optional, only if a subcategory is relevant
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Service", ServiceSchema);
