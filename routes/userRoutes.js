import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, authorizeRoles("superadmin", "admin"), updateUser);
router.put(
  "/:id/role",
  protect,
  authorizeRoles("superadmin", "admin"),
  updateUserRole
);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteUser);

export default router;
