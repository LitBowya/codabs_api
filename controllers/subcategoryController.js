import Subcategory from "../models/Subcategory.js";
import Category from "../models/Category.js";

// Create a new subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    if (!name || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and category are required",
      });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const subcategory = await Subcategory.create({
      name,
      description,
      category: categoryId,
    });

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the subcategory",
      error: error.message,
    });
  }
};

// Get all subcategories
export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("category");

    if (!subcategories.length) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found",
      });
    }

    res.status(200).json({
      success: true,
      subcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the subcategories",
      error: error.message,
    });
  }
};

// Get subcategory by ID
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const subcategory =
      await Subcategory.findById(subcategoryId).populate("category");

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      success: true,
      subcategory,
    });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the subcategory",
      error: error.message,
    });
  }
};

// Update subcategory by ID
export const updateSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const { name, description, categoryId } = req.body;

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;
    subcategory.category = categoryId || subcategory.categoryId;

    await subcategory.save();

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the subcategory",
      error: error.message,
    });
  }
};

// Delete subcategory by ID
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    await subcategory.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the subcategory",
      error: error.message,
    });
  }
};
