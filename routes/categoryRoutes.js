import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create a new category
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin"),
  createCategory,
);

// Get all categories
router.get("/", getAllCategories);

// Get category by ID
router.get("/:id", getCategoryById);

// Update category by ID
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateCategory,
);

// Delete category by ID
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteCategory);

export default router;
