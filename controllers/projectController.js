import Project from "../models/Project.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import { uploadProjectImages } from "../utils/cloudinary.js";

// CREATE
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      location,
      startDate,
      endDate,
      startingImages,
      finishedImages,
      status,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !startDate ||
      !startingImages ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);
      if (!subcategoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found" });
      }
    }

    const startingImagesUrl = await uploadProjectImages(startingImages);

    const finishedImagesUrl = await uploadProjectImages(finishedImages);

    const newProject = await Project.create({
      title,
      description,
      category,
      subcategory,
      location,
      startDate,
      endDate,
      startingImages: startingImagesUrl,
      finishedImages: finishedImagesUrl,
      status,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the project.",
      error: error.message,
    });
  }
};

// GET ALL WITH ADVANCED QUERIES
export const getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      search = "",
      category,
      status,
      startDateBefore,
      startDateAfter,
      hasFinishedImages,
      location,
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: "i" };

    if (startDateBefore)
      query.startDate = {
        ...(query.startDate || {}),
        $lte: new Date(startDateBefore),
      };
    if (startDateAfter)
      query.startDate = {
        ...(query.startDate || {}),
        $gte: new Date(startDateAfter),
      };

    if (hasFinishedImages !== undefined) {
      if (hasFinishedImages === "true") {
        query.finishedImages = { $exists: true, $not: { $size: 0 } };
      } else if (hasFinishedImages === "false") {
        query.finishedImages = { $in: [[], null] };
      }
    }

    // Fetch and paginate
    const projects = await Project.find(query)
      .populate("category subcategory")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    console.error("Get All Projects Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects.",
      error: error.message,
    });
  }
};

// GET ONE
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate("category subcategory");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Get Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch the project",
      error: error.message,
    });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      subcategory,
      location,
      startDate,
      endDate,
      status,
      tags,
      startingImages,
      finishedImages,
    } = req.body;

    const updates = {};

    // Validate category
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      updates.category = category;
    }

    // Validate subcategory
    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);
      if (!subcategoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found" });
      }
      updates.subcategory = subcategory;
    }

    // Handle base64 image upload
    if (startingImages && Array.isArray(startingImages)) {
      const uploadedStarting = await uploadProjectImages(startingImages); // accepts base64
      updates.startingImages = uploadedStarting;
    }

    if (finishedImages && Array.isArray(finishedImages)) {
      const uploadedFinished = await uploadProjectImages(finishedImages); // accepts base64
      updates.finishedImages = uploadedFinished;
    }

    // Handle other fields
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (location) updates.location = location;
    if (startDate) updates.startDate = startDate;
    if (endDate) updates.endDate = endDate;
    if (status) updates.status = status;
    if (tags) updates.tags = tags;

    const updatedProject = await Project.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};
