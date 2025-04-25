// controllers/blogController.js
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import { uploadBlogCoverImage, uploadBlogImages } from "../utils/cloudinary.js";

// CREATE
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      category,
      subcategory,
      isPublished,
    } = req.body;
    const author = req.user._id;

    if (!title || !content || !excerpt || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    const coverImageFile = req.body.coverImage;
    const imagesArray = req.body.images || [];

    const coverImage = await uploadBlogCoverImage(coverImageFile);
    const images =
      imagesArray.length > 0 ? await uploadBlogImages(imagesArray) : [];

    const blog = new Blog({
      title,
      content,
      excerpt,
      tags,
      coverImage: coverImage,
      images,
      category,
      subcategory,
      author,
      isPublished,
    });

    await blog.save();

    res
      .status(201)
      .json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

// GET ALL BLOGS WITH ADVANCED QUERIES
export const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      search = "",
      category,
      subcategory,
      author,
      isPublished,
      tags,
      createdBefore,
      createdAfter,
    } = req.query;

    const query = {};

    // Search across title, content, excerpt
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (author) query.author = author;
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    // Filter by tags (at least one matching)
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $in: tagsArray };
    }

    // Filter by creation dates
    if (createdBefore) {
      query.createdAt = {
        ...(query.createdAt || {}),
        $lte: new Date(createdBefore),
      };
    }
    if (createdAfter) {
      query.createdAt = {
        ...(query.createdAt || {}),
        $gte: new Date(createdAfter),
      };
    }

    const blogs = await Blog.find(query)
      .populate("author category subcategory")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// READ ONE
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate(
      "author category subcategory",
    );

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Get Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// UPDATE
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle image updates if new images are provided
    if (updates.coverImage) {
      const uploadedCover = await uploadBlogCoverImage(updates.coverImage);
      updates.coverImage = uploadedCover;
    }

    if (updates.images && updates.images.length > 0) {
      updates.images = await uploadBlogImages(updates.images);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, message: "Blog updated", blog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// DELETE
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
