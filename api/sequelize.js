// sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Disable all query logging from Sequelize
  }
);

// Test the connection and sync models
(async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log("Connected to the MySQL database!");

    // Sync all models (e.g., creating tables if not already created)
    await sequelize.sync();
    console.log("User model synced with the database!");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

export default sequelize;
