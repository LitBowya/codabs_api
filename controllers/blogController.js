// controllers/blogController.js
import Blog from "../models/Blog.js";
import {uploadBlogCoverImage, uploadBlogImages} from "../utils/cloudinary.js";

// Helper to extract base64 images from HTML content
const extractBase64Images = (html) => {
    const regex = /<img[^>]+src=\"(data:image\/[^"]+)\"[^>]*>/g;
    let match;
    const base64List = [];
    while ((match = regex.exec(html))) {
        base64List.push(match[1]);
    }
    return base64List;
};

// Helper to replace base64 with uploaded URLs
const replaceBase64WithUrls = (html, urlMap) => {
    Object.entries(urlMap).forEach(([base64, url]) => {
        html = html.replace(new RegExp(base64.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), 'g'), url);
    });
    return html;
};


// CREATE
export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content: rawContent,
            excerpt,
            tags,
            category,
            subcategory,
            isPublished
        } = req.body;
        const author = req.user._id;

        if (!title || !rawContent || !excerpt || !category) {
            return res.status(400).json({success: false, message: "Required fields missing"});
        }

        // Handle cover image
        const coverImageFile = req.body.coverImage;
        const coverImage = await uploadBlogCoverImage(coverImageFile);

        // Extract and upload images embedded in content
        const base64Images = extractBase64Images(rawContent);
        const imagesUrls = base64Images.length > 0 ? await uploadBlogImages(base64Images) : [];

        // Build map base64->url
        const urlMap = {};
        base64Images.forEach((b, i) => {
            urlMap[b] = imagesUrls[i];
        });

        // Replace base64 in content with uploaded URLs
        const content = replaceBase64WithUrls(rawContent, urlMap);

        // Create blog
        const blog = new Blog({
            title,
            content,
            excerpt,
            tags,
            coverImage,
            images: imagesUrls,
            category,
            subcategory,
            author,
            isPublished
        });

        await blog.save();
        res.status(201).json({success: true, message: "Blogs created successfully", blog});
    } catch (error) {
        console.error("Create Blogs Error:", error);
        res.status(500).json({success: false, message: "Error creating blog", error: error.message});
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
                {title: {$regex: search, $options: "i"}},
                {content: {$regex: search, $options: "i"}},
                {excerpt: {$regex: search, $options: "i"}},
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
            query.tags = {$in: tagsArray};
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
            .sort({[sortBy]: order === "asc" ? 1 : -1})
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
        const {id} = req.params;
        const blog = await Blog.findById(id).populate(
            "author category subcategory",
        );

        if (!blog)
            return res
                .status(404)
                .json({success: false, message: "Blogs not found"});

        res.status(200).json({success: true, blog});
    } catch (error) {
        console.error("Get Blogs Error:", error);
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
        const {id} = req.params;
        const updates = {...req.body};

        // Cover image update
        if (updates.coverImage) {
            updates.coverImage = await uploadBlogCoverImage(updates.coverImage);
        }

        // Handle embedded content images
        if (updates.content) {
            const rawContent = updates.content;
            const base64Images = extractBase64Images(rawContent);
            const uploaded = base64Images.length > 0 ? await uploadBlogImages(base64Images) : [];
            const urlMap = {};
            base64Images.forEach((b, i) => {
                urlMap[b] = uploaded[i];
            });
            updates.content = replaceBase64WithUrls(rawContent, urlMap);
            updates.images = [...(updates.images || []), ...uploaded];
        }

        const blog = await Blog.findByIdAndUpdate(id, updates, {new: true});
        if (!blog) return res.status(404).json({success: false, message: "Blogs not found"});
        res.status(200).json({success: true, message: "Blogs updated", blog});
    } catch (error) {
        console.error("Update Blogs Error:", error);
        res.status(500).json({success: false, message: "Error updating blog", error: error.message});
    }
};


// DELETE
export const deleteBlog = async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog)
            return res
                .status(404)
                .json({success: false, message: "Blogs not found"});

        res.status(200).json({success: true, message: "Blogs deleted"});
    } catch (error) {
        console.error("Delete Blogs Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting blog",
            error: error.message,
        });
    }
};
