import express from "express";
import {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq
} from "../controllers/faqController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllFaqs); // Admin
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  createFaq
);
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateFaq
);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteFaq);

export default router;
