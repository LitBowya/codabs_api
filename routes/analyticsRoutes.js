// routes/analyticsRoutes.js
import express from "express";
import { getAnalyticsSummary } from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("superadmin", "admin"),
  getAnalyticsSummary,
);

export default router;
