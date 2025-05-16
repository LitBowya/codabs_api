// routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  getAllAppointments,
  toggleAvailability,
  getAvailability
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", protect, getAllAppointments);
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("superadmin", "admin"),
  acceptAppointment
);
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("superadmin", "admin"),
  rejectAppointment
);
router.get("/availability", getAvailability);
router.put(
  "/availability/toggle",
  protect,
  authorizeRoles("superadmin", "admin"),
  toggleAvailability
);

export default router;
