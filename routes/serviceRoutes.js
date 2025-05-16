import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/serviceController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { trackVisit } from "../middlewares/trackVisitMiddleware.js";

const router = express.Router();

// Create a new service
router.post("/", protect, authorizeRoles("superadmin", "admin"), createService);

// Get all services
router.get("/", getAllServices);

// Get a single service by ID
router.get("/:id", trackVisit("service"), getServiceById);

// Update a service by ID
router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "admin", "editor"),
  updateService
);

// Delete a service by ID
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteService);

export default router;
