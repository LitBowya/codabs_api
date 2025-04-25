// middleware/roleMiddleware.js
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have the required role.",
      });
    }

    next();
  };
};
