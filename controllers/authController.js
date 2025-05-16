import User from "../models/User.js";
import { sendToken, clearToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";
import { uploadProfileImage } from "../utils/cloudinary.js";

// Helper: Generate a 6-digit userId
const generateUserId = () => Math.floor(100000 + Math.random() * 900000);

// Helper: Validate password strength
const validatePassword = (password) => {
  return {
    lengthValid: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const phone = req.body.phone?.trim();
    const profilePicture = req.body.profilePicture;
    const roles = Array.isArray(req.body.roles) ? req.body.roles : [];

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Ensure unique userId
    let userId;
    let exists = true;
    while (exists) {
      userId = generateUserId();
      exists = await User.findOne({ userId });
    }

    const tempPassword = "123456789";

    const profilePictureUrl = await uploadProfileImage(profilePicture);

    const user = await User.create({
      name,
      email,
      phone,
      profilePicture: profilePictureUrl,
      userId,
      password: tempPassword,
      roles: roles.length > 0 ? roles : ["viewer"] // fallback to 'viewer' role
    });

    await sendEmail({
      to: email,
      subject: `Welcome Aboard, ${name}! Your CODABS Journey Begins 🚀`,
      text: `
🌟 Welcome to CODABS, ${name}!

Here are your secure login credentials:
🔑 User ID: ${userId}
🔒 Temporary Password: ${tempPassword}

🚨 First-Time Login REQUIRED:
1. Visit: ${process.env.FRONTEND_URL}/login
2. Enter your credentials above
3. IMMEDIATELY change your password on the "Login Page" using "Forgot Password" option

💡 Pro Tip: Create a strong password combination we've never seen you use elsewhere!

Build with confidence,
The CODABS Team 🏗️
  `.trim()
    });

    res
      .status(200)
      .json({
        success: true,
        message: `User registered with ID: ${userId}`,
        user
      });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message
    });
  }
};

// Login user with userId
export const loginUser = async (req, res) => {
  const { userId, password } = req.body;

  try {
    if (!userId || !password) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and password are required" });
    }

    const user = await User.findOne({ userId });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user ID or password" });
    }

    sendToken(res, user, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message
    });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    clearToken(res);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "User ID and new password are required"
    });
  }

  const errors = validatePassword(newPassword);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "New password is not strong enough",
      errors
    });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during password reset",
      error: error.message
    });
  }
};
