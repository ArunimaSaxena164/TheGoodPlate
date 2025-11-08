const Listing = require("../models/Listing.js");
const listingValidationSchema = require("../utils/listingValidators.js");
const mongoose = require("mongoose");

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
const getListingById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const now = new Date();

    // Find listing and populate donor info (name, email, phone)
    const listing = await Listing.findOne({
      _id: id,
      isActive: true,
      overallExpiresAt: { $gt: now },
    })
      .populate("donor", "name email phone") 
      .lean()
      .exec();

    if (!listing)
      return res
        .status(404)
        .json({ message: "Listing not found or expired" });

    // Compute active items
    const activeItems = (listing.foodDetails || []).filter(
      (it) => it.remainingQuantity > 0 && new Date(it.expiresAt) > now
    );

    // Build payload with donor info included
    const payload = {
      _id: listing._id,
      address: listing.address,
      coordinates: listing.coordinates,
      location: listing.location,
      donor: listing.donor, // this now includes name, email, phone
      createdAt: listing.createdAt,
      overallExpiresAt: listing.overallExpiresAt,
      isActive: listing.isActive,
      foodDetails: listing.foodDetails.map((it) => ({
        _id: it._id,
        name: it.name,
        quantity: it.quantity,
        remainingQuantity: it.remainingQuantity,
        unit: it.unit,
        shelfLife: it.shelfLife,
        description: it.description,
        expiresAt: it.expiresAt,
      })),
      activeItems,
      itemsCount: activeItems.length,
      soonestExpiry: activeItems.length
        ? new Date(
            Math.min(...activeItems.map((a) => new Date(a.expiresAt)))
          )
        : null,
    };

    return res.json(payload);
  } catch (err) {
    console.error("getListingById:", err);
    return res.status(500).json({ message: err.message });
  }
};
const getMyListings = async (req, res) => {
  try {
    const donorId = req.user.id;

    const listings = await Listing.find({ donor: donorId })
      .select("address overallExpiresAt isActive createdAt foodDetails")
      .sort({ createdAt: -1 })
      .lean();

    // compute remaining items count & soonest expiry
    const now = new Date();
    const formatted = listings.map((l) => {
      const activeItems = (l.foodDetails || []).filter(
        (it) => it.remainingQuantity > 0 && new Date(it.expiresAt) > now
      );
      return {
        _id: l._id,
        address: l.address,
        createdAt: l.createdAt,
        overallExpiresAt: l.overallExpiresAt,
        isActive: l.isActive,
        totalItems: l.foodDetails.length,
        remainingItems: activeItems.length,
        soonestExpiry: activeItems.length
          ? new Date(Math.min(...activeItems.map((i) => new Date(i.expiresAt))))
          : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("getMyListings:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createListing, getNearbyListings, getAllListings, getListingById ,getMyListings};
