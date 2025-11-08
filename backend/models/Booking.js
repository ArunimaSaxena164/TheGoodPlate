const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["reserved", "cancelled", "delivered"],
    default: "reserved",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
