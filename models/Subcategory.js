import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures uniqueness of subcategories
    },
    description: {
      type: String,
      required: false, // Optional, provides description for subcategory
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Links each subcategory to a category
      required: true, // Ensure each subcategory is assigned to a category
    },
  },
  { timestamps: true },
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
