// controllers/userController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { uploadProfileImage } from "../utils/cloudinary.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
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
        .status(404)
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
      new: true,
    }).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE user role
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user)
      return res
        .status(404)
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
