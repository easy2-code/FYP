import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Test route
router.get("/test", test);

// Update user profile route
router.put("/update/:id", verifyToken, updateUser);

// Delete user profile route
router.delete("/delete/:id", verifyToken, deleteUser);

// Get user listings route
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
