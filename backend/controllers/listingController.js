const Listing = require("../models/Listing.js");
const listingValidationSchema = require("../utils/listingValidators.js");

const createListing = async (req, res) => {
  try {
    const { error } = listingValidationSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

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
const getNearbyListings = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radius || "10");

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res
        .status(400)
        .json({ message: "lat and lng are required numbers" });
    }
    const radiusMeters = radiusKm * 1000;

    const now = new Date();

    const results = await Listing.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          maxDistance: radiusMeters,
          spherical: true,
          key: "location",
        },
      },
      // hide fully expired listings
      { $match: { overallExpiresAt: { $gt: now }, isActive: true } },
      // keep only non-expired, non-empty items
      {
        $addFields: {
          activeItems: {
            $filter: {
              input: "$foodDetails",
              as: "fi",
              cond: {
                $and: [
                  { $gt: ["$$fi.remainingQuantity", 0] },
                  { $gt: ["$$fi.expiresAt", now] },
                ],
              },
            },
          },
        },
      },
      // drop those with zero active items
      { $match: { $expr: { $gt: [{ $size: "$activeItems" }, 0] } } },
      // compute handy fields for the card
      {
        $addFields: {
          distanceKm: { $divide: ["$distanceMeters", 1000] },
          soonestExpiry: { $min: "$activeItems.expiresAt" },
          itemsCount: { $size: "$activeItems" },
        },
      },
      // projection (trim payload)
      {
        $project: {
          address: 1,
          coordinates: 1,
          distanceKm: 1,
          soonestExpiry: 1,
          itemsCount: 1,
          activeItems: {
            name: 1,
            remainingQuantity: 1,
            unit: 1,
            expiresAt: 1,
            shelfLife: 1,
          },
        },
      },
      // sort by distance
      { $sort: { distanceKm: 1 } },
      // limit if you want top N (front-end can also paginate)
      // { $limit: 10 }
    ]);

    res.json(results);
  } catch (err) {
    // Common cause: location/index missing on old docs
    res.status(500).json({ message: err.message });
  }
};
// GET /api/listings/all
const getAllListings = async (req, res) => {
  try {
    const now = new Date();

    const listings = await Listing.find({
      isActive: true,
      overallExpiresAt: { $gt: now },
      foodDetails: {
        $elemMatch: {
          remainingQuantity: { $gt: 0 },
          expiresAt: { $gt: now },
        },
      },
    })
      .select("address coordinates foodDetails overallExpiresAt createdAt") // projection
      .lean();

    // reduce payload & compute counts
    const cleaned = listings.map((l) => {
      const activeItems = l.foodDetails.filter(
        (it) => it.remainingQuantity > 0 && it.expiresAt > now
      );

      return {
        _id: l._id,
        address: l.address,
        coordinates: l.coordinates,
        itemsCount: activeItems.length,
        activeItems: activeItems.slice(0, 3),
        soonestExpiry: Math.min(
          ...activeItems.map((it) => new Date(it.expiresAt))
        ),
        createdAt: l.createdAt,
      };
    });

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { createListing, getNearbyListings, getAllListings };
