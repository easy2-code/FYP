import User from "../models/user.model.js"; // Import the User model
import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Validate the input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "An error occurred during sign-up" });
  }
};
