import Service from "../models/Service.js";
import Category from "../models/Category.js"; // Import Category model
import Subcategory from "../models/Subcategory.js"; // Import Subcategory model
import { uploadServiceImages } from "../utils/cloudinary.js";

// CREATE - Add a new service
export const createService = async (req, res) => {
  try {
    const { title, description, images, category, subcategory } = req.body;

    if (!title || !description || !images || !category) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (title, description, images, and category) must be provided."
      });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // Check if the subcategory exists (if provided)
    let subcategoryExists = null;
    if (subcategory) {
      subcategoryExists = await Subcategory.findById(subcategory);
      if (!subcategoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found." });
      }
    }

    const imageUrls = await uploadServiceImages(images);

    // Create a new service
    const service = new Service({
      title,
      description,
      images: imageUrls,
      category,
      subcategory
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the service.",
      error: error.message
    });
  }
};

// READ - Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("category subcategory").sort({ createdAt: -1 });
    ;
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Get All Services Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the services.",
      error: error.message
    });
  }
};

// READ - Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate("category subcategory");

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error("Get Service By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the service.",
      error: error.message
    });
  }
};

// UPDATE - Edit a service by ID
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, images, category, subcategory } = req.body;

    // Check if service exists
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    // Check if the category exists (only if category is provided)
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found." });
      }
      service.category = category;
    }

    // Check if the subcategory exists (only if subcategory is provided)
    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);
      if (!subcategoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found." });
      }
      service.subcategory = subcategory;
    }

    // Handle cloud upload for new images (if provided)
    let uploadedImages = service.images;
    if (images && images.length > 0) {
      uploadedImages = await uploadServiceImages(images);
    }

    // Update the service
    service.title = title || service.title;
    service.description = description || service.description;
    service.images = uploadedImages;
    service.category = category || service.category;
    service.subcategory = subcategory || service.subcategory;

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the service.",
      error: error.message
    });
  }
};

// DELETE - Remove a service by ID
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the service
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the service.",
      error: error.message
    });
  }
};
