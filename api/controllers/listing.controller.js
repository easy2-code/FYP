import Listing from "../models/listing.model.js";

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
