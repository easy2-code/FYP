import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js"; // Assuming User model exists

export const createListing = async (req, res, next) => {
  try {
    // Ensure that userRef is properly included in the request body and mapped to userId
    const { userRef, ...listingData } = req.body;

    // Make sure userRef is present
    if (!userRef) {
      return res.status(400).json({ message: "User ID is missing." });
    }

    // Create a new listing with the userRef mapped to userId
    const listing = await Listing.create({
      ...listingData,
      userId: userRef, // Set userId from userRef
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Create delete listing function
export const deleteListing = async (req, res, next) => {
  try {
    // Find the listing by primary key (ID)
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return next(errorHandler("Listing not found", 404)); // Listing not found
    }

    // Check if the user is the owner of the listing
    // Here, the `listing.userId` is the foreign key that links to the `user.id` in the User table
    if (req.user.id !== listing.userId) {
      return next(errorHandler("You can only delete your own listings", 403)); // Forbidden, user trying to delete someone else's listing
    }

    // Optionally, you can also verify that the `userId` exists in the User table
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(errorHandler("User not found", 404)); // User not found (this check may not be needed if `user` is verified through token)
    }

    // Delete the listing
    await listing.destroy(); // Deletes the listing from the database

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
};
