// routes/contactRoutes.js
import express from "express";
import { sendContactMessage } from "../controllers/contactusController.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;
