import express from "express";
import "./db.js"; // Database connection
import syncModels from "./syncModels.js"; // Import syncModels
import userRouter from "./routes/user.route.js"; // User route
import authRouter from "./routes/auth.route.js"; // Import the auth routes

const app = express();
app.use(express.json());

// Sync the models before starting the server
(async () => {
  try {
    await syncModels(); // Sync all models
    console.log("All models synced successfully!");
  } catch (error) {
    console.error(
      "Model synchronization failed. Server not started.",
      error.message
    );
    process.exit(1); // Exit the process on sync failure
  }
})();

// Test Route
app.get("/api/db-test", (req, res) => {
  res.send("Connected to the database!");
});

// Use User routes
app.use("/api/user", userRouter);

// Use Auth routes for signup
app.use("/api/auth", authRouter); // Register auth routes for signup

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

//Creating middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
