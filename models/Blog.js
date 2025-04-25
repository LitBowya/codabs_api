import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }], // Optional additional images
    tags: [{ type: String }],
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your admin user model is named User
      required: true,
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", BlogSchema);
