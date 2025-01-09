import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const validUser = await User.findOne({ where: { email } });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Verify password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    // Send token and user details
    const { password: pass, ...rest } = validUser.toJSON(); // Exclude password
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const username = `${name.split(" ").join("").toLowerCase()}${Math.random()
        .toString(36)
        .slice(-4)}`;
      const hashedPassword = bcryptjs.hashSync(
        Math.random().toString(36).slice(-16),
        10
      );

      user = await User.create({
        username,
        email,
        password: hashedPassword,
        avatar: photo,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, ...rest } = user.toJSON();

    res
      .cookie("access_token", token, { httpOnly: true, secure: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Function for signOut
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
