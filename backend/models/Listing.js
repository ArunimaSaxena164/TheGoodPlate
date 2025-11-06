const mongoose = require("mongoose");

// Subschema for each food item
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }, // numeric
  unit: { type: String, required: true }, // e.g. kg, plates, packets
  remainingQuantity: { type: Number, default:0 }, // auto same as quantity
  shelfLife: { type: String, required: true }, // "2 days", "6 hours"
  description: { type: String },
  expiresAt: { type: Date }, // auto calculated
});

// Main schema for the food listing
const listingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    foodDetails: {
      type: [foodItemSchema],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    overallExpiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Automatically calculate expiresAt and set remainingQuantity
listingSchema.pre("save", function (next) {
  const now = new Date();
  let latestExpiry = now;

  this.foodDetails.forEach((item) => {
    // If remainingQuantity not set, initialize it
    if (item.remainingQuantity === undefined)
      item.remainingQuantity = item.quantity;

    // Parse shelf life
    const match = item.shelfLife.match(/(\d+)\s*(day|hour|minute|days|hours|minutes)/i);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      let expiry = new Date(now);
      if (unit.startsWith("day")) expiry.setHours(now.getHours() + amount * 24);
      else if (unit.startsWith("hour")) expiry.setHours(now.getHours() + amount);
      else if (unit.startsWith("minute")) expiry.setMinutes(now.getMinutes() + amount);

      item.expiresAt = expiry;
      if (expiry > latestExpiry) latestExpiry = expiry;
    }
  });

  this.overallExpiresAt = latestExpiry;
  next();
});

// TTL index for auto deletion after expiry
listingSchema.index({ overallExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Listing", listingSchema);
