// controllers/userController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { uploadProfileImage } from "../utils/cloudinary.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, sort, page: pageParam, limit: limitParam } = req.query;

    // Pagination
    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page - 1) * limit;

    // Base filter
    const filter = {};

    // Search (name or email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by role
    if (role) {
      filter.roles = role;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(":");
      sortOption = { [field]: order === "asc" ? 1 : -1 };
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Get paginated results
    const users = await User.find(filter)
      .select("-password")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalPages,
        totalUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE user info
export const updateUser = async (req, res) => {
  const { name, phone, profilePicture } = req.body;

  try {
    let updatedFields = { name, phone };

    if (profilePicture) {
      updatedFields.profilePicture = await uploadProfileImage(profilePicture);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true
    }).select("-password");

    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE user role
export const updateUserRole = async (req, res) => {
  const { role: roles } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select("-password");

    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
