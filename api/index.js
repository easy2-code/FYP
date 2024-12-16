// index.js
import express from "express";
import "./sequelize.js"; // This will handle the database connection and sync
import User from "./models/user.model.js"; // User model (already synced in sequelize.js)
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

const app = express(); // Initialize app
app.use(express.json()); // Middleware to parse JSON

// Test Route (Must come AFTER app initialization)
app.get("/api/db-test", (req, res) => {
  res.send("Connected to the database!");
});

// Test API route
app.use("/api/user", userRouter);
// Auth route
app.use("/api/auth", authRouter);

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
