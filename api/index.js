import express from "express";
import "./db.js"; // Database connection
import User from "./models/user.model.js"; // User model
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

// Sync the database
(async () => {
  try {
    await User.sync(); // This creates the 'User' table if it doesn't exist
    console.log("User model synced with the database!");
  } catch (error) {
    console.error("Failed to sync the User model:", error.message);
  }
})();

// Test Route
app.get("/api/db-test", (req, res) => {
  res.send("Connected to the database!");
});

const app = express();
app.use(express.json());

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

//Test api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
