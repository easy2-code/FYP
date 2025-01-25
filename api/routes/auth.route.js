import express from "express";
import {
  google,
  signin,
  signOut,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/signin
router.post("/signin", signin);

// POST /api/auth/google
router.post("/google", google);

// get /api/auth/signout
router.get("/signout", signOut);

export default router;
