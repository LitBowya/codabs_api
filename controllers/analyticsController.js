// controllers/analyticsController.js
import Analytics from "../models/Analytics.js";
import Blog from "../models/Blog.js";
import Project from "../models/Project.js";

export const getAnalyticsSummary = async (req, res) => {
  try {
    const totalPageVisits = await Analytics.countDocuments({ type: "page" });
    const blogVisits = await Analytics.aggregate([
      { $match: { type: "blog" } },
      {
        $group: {
          _id: "$referenceId",
          views: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "_id",
          as: "blog",
        },
      },
      { $unwind: "$blog" },
    ]);

    const projectVisits = await Analytics.aggregate([
      { $match: { type: "project" } },
      {
        $group: {
          _id: "$referenceId",
          views: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPageVisits,
        blogVisits,
        projectVisits,
      },
    });
  } catch (error) {
    console.error("Analytics summary error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch analytics" });
  }
};
