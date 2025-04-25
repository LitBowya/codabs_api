import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures that no duplicate categories are created
    },
    description: {
      type: String,
      required: false, // Optional, you can describe the category here
    },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
