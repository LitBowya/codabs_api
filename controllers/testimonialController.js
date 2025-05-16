import Testimonial from "../models/Testimonial.js";
import { uploadTestimonialImage } from "../utils/cloudinary.js";

// CREATE
export const createTestimonial = async (req, res) => {
  try {
    const { name, company, position, message, rating, image } =
      req.body;

    const imageUrl = await uploadTestimonialImage(image);

    const testimonial = new Testimonial({
      name,
      company,
      position,
      message,
      rating,
      image: imageUrl
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
      error: error.message
    });
  }
};

// GET ALL (optionally filtered by approval or project)
export const getAllTestimonials = async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const testimonials = await Testimonial.aggregate([{ $sample: { size: total } }]);

    res.status(200).json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error("Get Random Testimonials Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve testimonials",
      error: error.message
    });
  }
};

// GET SINGLE
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

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
      error: error.message
    });
  }
};

// UPDATE
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.image) {
      updates.image = await uploadTestimonialImage(updates.image);
    }

    const updated = await Testimonial.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial: updated
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message
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
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message
    });
  }
};
