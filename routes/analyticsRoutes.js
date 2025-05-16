// routes/analyticsRoutes.js
import express from "express";
import { getAnalyticsSummary, getCountsSummary } from "../controllers/analyticsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getAnalyticsSummary
);
router.get(
  "/count",
  protect,
  getCountsSummary
);

export default router;
