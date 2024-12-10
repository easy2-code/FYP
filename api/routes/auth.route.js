import express from "express";
import { signup } from "../controllers/auth.controller.js"; // Import signup controller

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

export default router;
