const mongoose = require("mongoose");
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  remainingQuantity: { type: Number }, 
  shelfLife: { type: String, required: true }, 
  description: { type: String },
  expiresAt: { type: Date },
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
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
    createdAt: { type: Date, default: Date.now },
    overallExpiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },

  { timestamps: true }
);
listingSchema.pre("save", function (next) {
  const now = new Date();
  let latestExpiry = now;

  this.foodDetails.forEach((item) => {
    if (item.remainingQuantity === undefined) {
      item.remainingQuantity = item.quantity;
    }

    const match = item.shelfLife.match(
      /(\d+)\s*(day|hour|minute|days|hours|minutes)/i
    );

    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      let expiry = new Date(now);
      if (unit.startsWith("day"))
        expiry.setHours(now.getHours() + amount * 24);
      else if (unit.startsWith("hour"))
        expiry.setHours(now.getHours() + amount);
      else if (unit.startsWith("minute"))
        expiry.setMinutes(now.getMinutes() + amount);

      item.expiresAt = expiry;

      if (expiry > latestExpiry) latestExpiry = expiry;
    }
  });

  this.overallExpiresAt = latestExpiry;

  this.location = {
    type: "Point",
    coordinates: [this.coordinates.lng, this.coordinates.lat],
  };

  next();
});

// TTL index for auto deletion after expiry
listingSchema.index({ overallExpiresAt: 1 }, { expireAfterSeconds: 0 });
listingSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Listing", listingSchema);
