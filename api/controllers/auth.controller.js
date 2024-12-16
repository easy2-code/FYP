import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if any field is missing
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Respond with success and include user ID, username, email
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id, // Include the user's ID (assuming you're using an auto-increment primary key)
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Catch any unexpected errors and send a generic error response
    next(error);
  }
};
