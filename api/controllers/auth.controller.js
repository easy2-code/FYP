import User from "../models/user.model.js"; // Import the User model
import bcryptjs from "bcryptjs"; // Use bcryptjs instead of bcrypt

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // 1. Validate the input
    if (!username || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400; // Bad Request
      throw error; // Pass error to middleware
    }

    // 2. Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email is already in use");
      error.statusCode = 400; // Bad Request
      throw error; // Pass error to middleware
    }

    // 3. Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 4. Create the user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Respond with the newly created user (excluding the password)
    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Pass error to middleware
    next(error);
  }
};
