import Faq from "../models/Faq.js";

// Create FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, isVisible } = req.body;
    const faq = await Faq.create({ question, answer, isVisible });
    res.status(201).json({ success: true, faq });
  } catch (error) {
    console.error("Create FAQ Error:", error);
    res.status(500).json({ success: false, message: "Failed to create FAQ" });
  }
};

// Get all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get FAQs" });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFaq = await Faq.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedFaq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    res.status(200).json({ success: true, faq: updatedFaq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update FAQ" });
  }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Faq.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete FAQ" });
  }
};
