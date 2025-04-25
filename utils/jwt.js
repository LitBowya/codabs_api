import jwt from "jsonwebtoken";

// Create a token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // adjust based on your needs
  });
};

// Send token via HTTP-only cookie
const sendToken = (res, user, message = "Success", statusCode = 200) => {
  const token = generateToken(user._id);

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Don't send password to client
  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token,
  });
};

// Clear cookie on logout
const clearToken = (res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

export { generateToken, sendToken, clearToken };
