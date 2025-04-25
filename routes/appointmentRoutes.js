// routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", protect, authorizeRoles("superadmin"), getAllAppointments);
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("superadmin"),
  acceptAppointment,
);
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("superadmin"),
  rejectAppointment,
);

export default router;
