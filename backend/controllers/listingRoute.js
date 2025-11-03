import { listingValidationSchema } from "../utils/listingValidators.js";

export const createListing = async (req, res) => {
  try {
    const { error } = listingValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const listing = new Listing({
      donor: req.user.id, // assuming JWT middleware sets req.user
      ...req.body,
    });

    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
