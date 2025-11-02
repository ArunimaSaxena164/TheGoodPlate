const mongoose=require("mongoose");

// Subschema for each food item
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  shelfLife: { type: String, required: true }, // e.g., "2 days", "6 hours"
  description: { type: String },
  expiresAt: { type: Date }, // will be computed automatically
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

// Automatically calculate expiresAt for each food item and overallExpiresAt
listingSchema.pre("save", function (next) {
  const now = new Date();
  let latestExpiry = now;

  this.foodDetails.forEach((item) => {
    // Convert shelfLife string like "2 days" or "6 hours" to milliseconds
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

// TTL index for auto deletion
listingSchema.index({ overallExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports=mongoose.model("Listing", listingSchema);
