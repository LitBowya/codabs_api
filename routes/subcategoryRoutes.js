import express from "express";
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create a new subcategory
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin"),
  createSubcategory,
);

// Get all subcategories
router.get("/", getAllSubcategories);

// Get subcategory by ID
router.get("/:id", getSubcategoryById);

// Update subcategory by ID
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateSubcategory,
);

// Delete subcategory by ID
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteSubcategory);

export default router;
