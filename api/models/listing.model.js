import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Listing = sequelize.define(
  "Listing",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Reference the Users table name directly
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regularPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    furnished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    parking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    imageUrls: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default Listing;
