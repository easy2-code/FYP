import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host (e.g., localhost)
    dialect: "mysql", // Specify the database dialect
    logging: false, // Disable query logging
  }
);

// Function to test connection and sync models
const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Connected to the MySQL database!");

    // Sync models
    await sequelize.sync({ alter: true }); // Use alter: true for safe schema updates
    console.log("✅ All models synced successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1); // Exit process if the database connection fails
  }
};

// Call the initialization function
initializeDatabase();

export default sequelize;
