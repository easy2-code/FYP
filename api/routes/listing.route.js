import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create listing route, which verifies the token and attaches user info to the request
router.post("/create", verifyToken, createListing);

export default router;
