import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER, // Explicit primary key
      autoIncrement: true, // Auto-incrementing
      primaryKey: true, // Primary key
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  {
    timestamps: true,
  }
);

export default User;
