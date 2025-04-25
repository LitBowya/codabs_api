// middleware/trackVisit.js
import Analytics from "../models/Analytics.js";

export const trackVisit = (type) => async (req, res, next) => {
  try {
    const referenceId = req.params.id || null;
    await Analytics.create({
      type,
      referenceId,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("Analytics tracking error:", error.message);
  }
  next();
};
