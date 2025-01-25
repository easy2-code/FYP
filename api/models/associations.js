import User from "./user.model.js";
import Listing from "./listing.model.js";

// Define the associations here
User.hasMany(Listing, { foreignKey: "userId" });
Listing.belongsTo(User, { foreignKey: "userId" });
