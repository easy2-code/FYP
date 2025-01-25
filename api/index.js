import express from "express";
import "./sequelize.js"; // This handles the database connection and sync
import User from "./models/user.model.js"; // User model (already synced in sequelize.js)
import Listing from "./models/listing.model.js"; // Listing model
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
// cookieParser
import cookieParser from "cookie-parser";

// Import the associations after models are loaded
import "./models/associations.js"; // Import associations file

const app = express(); // Initialize app
app.use(express.json()); // Middleware to parse JSON

// cookieParser
app.use(cookieParser());

// Test Route (Must come AFTER app initialization)
app.get("/api/db-test", (req, res) => {
  res.send("Connected to the database!");
});

// Test API route
app.use("/api/user", userRouter);
// Auth route
app.use("/api/auth", authRouter);

// listing route
app.use("/api/listing", listingRouter);

// Middleware for error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server and only log once
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
