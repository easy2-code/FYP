import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working...",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id, 10)) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    // Hash password if provided
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Find and update the user in MySQL using Sequelize
    const [updatedRowsCount] = await User.update(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar, // For profile pictures (if applicable)
      },
      { where: { id: req.params.id } }
    );

    if (updatedRowsCount === 0) {
      return next(errorHandler(404, "User not found or no changes made!"));
    }

    // Fetch the updated user
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] }, // Exclude the password from response
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Function for deleting user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id, 10)) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }
  try {
    const deletedUser = await User.destroy({ where: { id: req.params.id } }); // Sequelize ORM
    if (!deletedUser) {
      return next(errorHandler(404, "User not found!"));
    }
    // Clear the access token cookie
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User has been deleted!" });
  } catch (error) {
    next(error);
  }
};
