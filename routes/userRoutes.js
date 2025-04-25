import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("superadmin", "admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("superadmin", "admin"), getUserById);
router.put("/:id", protect, updateUser);
router.put(
  "/:id/role",
  protect,
  authorizeRoles("superadmin", "admin"),
  updateUserRole,
);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteUser);

export default router;
