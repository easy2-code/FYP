import express from "express";
import db from "./db.js";
import User from "./models/user.model.js";
import userRouter from "./routes/user.route.js";


const app = express();
app.use(express.json());

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

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});


app.use("/api/user", userRouter);

