import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Test route
router.get("/test", test);

// Update user profile route
router.put("/update/:id", verifyToken, updateUser);

export default router;
