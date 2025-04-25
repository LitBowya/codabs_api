import express from "express";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
} from "../controllers/ourteamController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// CRUD Routes for Team Members
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin"),
  createTeamMember,
); // Create new team member
router.get("/", getAllTeamMembers); // Get all team members
router.get("/:id", getTeamMemberById); // Get single team member by ID
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateTeamMember,
); // Update team member
// by ID
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteTeamMember); // Delete team member by ID

export default router;
