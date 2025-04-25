// routes/blogRoutes.js
import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { trackVisit } from "../middlewares/trackVisitMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  createBlog,
);
router.get("/", getAllBlogs);
router.get("/:id", trackVisit("blog"), getBlogById);
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateBlog,
);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteBlog);

export default router;
