import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login existing user
router.post("/login", loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user
router.post("/logout", logoutUser);

// @route   POST /api/auth/reset-password
// @desc    Reset User Password
router.post("/reset-password", resetPassword);

export default router;
