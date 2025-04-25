import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { trackVisit } from "../middlewares/trackVisitMiddleware.js";

const router = express.Router();

// Create a new project
router.post("/", protect, authorizeRoles("superadmin", "admin"), createProject);

// Get all projects with optional queries
router.get("/", getAllProjects);

// Get a specific project by ID
router.get("/:id", trackVisit("project"), getProjectById);

// Update a project
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateProject,
);

// Delete a project
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteProject);

export default router;
