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
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the MySQL database!");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

export default sequelize;
