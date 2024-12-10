import User from "./models/user.model.js";

const syncModels = async () => {
  try {
    await User.sync(); // Sync the 'User' table
    console.log("User model synced with the database!");
  } catch (error) {
    console.error("Failed to sync the User model:", error.message);
    throw error; // Throw error to prevent server start if sync fails
  }
};

export default syncModels;
