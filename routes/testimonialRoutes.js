import express from "express";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  createTestimonial,
);

// READ ALL
router.get("/", getAllTestimonials);

// READ ONE
router.get("/:id", getTestimonialById);

// UPDATE
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateTestimonial,
);

// DELETE
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteTestimonial);

export default router;
