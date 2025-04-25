import Testimonial from "../models/Testimonial.js";
import Project from "../models/Project.js";
import { uploadTestimonialImage } from "../utils/cloudinary.js";

// CREATE
export const createTestimonial = async (req, res) => {
  try {
    const { name, company, position, message, rating, image, project } =
      req.body;

    // Validate if project exists (if provided)
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
    }

    const imageUrl = await uploadTestimonialImage(image);

    const testimonial = new Testimonial({
      name,
      company,
      position,
      message,
      rating,
      image: imageUrl,
      project,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

// GET ALL (optionally filtered by approval or project)
export const getAllTestimonials = async (req, res) => {
  try {
    const { approved, project } = req.query;

    const query = {};
    if (approved !== undefined) query.isApproved = approved === "true";
    if (project) query.project = project;

    const testimonials = await Testimonial.find(query).populate("project");

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error("Get All Testimonials Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve testimonials",
      error: error.message,
    });
  }
};

// GET SINGLE
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id).populate("project");

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({ success: true, testimonial });
  } catch (error) {
    console.error("Get Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve testimonial",
      error: error.message,
    });
  }
};

// UPDATE
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.project) {
      const projectExists = await Project.findById(updates.project);
      if (!projectExists) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
    }

    if (updates.image) {
      const uploadedImageUrl = await uploadTestimonialImage(updates.image);
      updates.image = uploadedImageUrl;
    }

    const updated = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial: updated,
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};
