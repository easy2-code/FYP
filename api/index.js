import express from "express";
import db from "./db.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test Route
app.get("/api/test", (req, res) => {
  res.send("Connected to the database!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
