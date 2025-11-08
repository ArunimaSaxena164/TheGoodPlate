const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { listingId, items } = req.body;
    const volunteerId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive)
      return res.status(404).json({ message: "Listing not found or inactive" });

    // Update remaining quantities for selected items
    items.forEach((itemReq) => {
      const foodItem = listing.foodDetails.id(itemReq.itemId);
      if (foodItem && foodItem.remainingQuantity >= itemReq.quantity) {
        foodItem.remainingQuantity -= itemReq.quantity;
      } else {
        throw new Error(`Invalid quantity for ${foodItem?.name}`);
      }
    });

    // Deactivate listing if all items are fully booked
    const totalRemaining = listing.foodDetails.reduce(
      (acc, i) => acc + i.remainingQuantity,
      0
    );
    if (totalRemaining === 0) listing.isActive = false;

    await listing.save();

    // Save booking
    const booking = new Booking({
      listing: listingId,
      volunteer: volunteerId,
      items,
      status: "reserved",
    });
    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status (cancelled / delivered)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    // Restore quantities if cancelled
    if (status === "cancelled" && booking.listing) {
      const listing = booking.listing;
      booking.items.forEach((it) => {
        const item = listing.foodDetails.id(it.itemId);
        if (item) item.remainingQuantity += it.quantity;
      });
      listing.isActive = true;
      await listing.save();
    }

    // Delete listing if delivered and all gone
    if (status === "delivered" && booking.listing) {
      const listing = booking.listing;
      const totalRemaining = listing.foodDetails.reduce(
        (acc, i) => acc + i.remainingQuantity,
        0
      );
      if (totalRemaining === 0) await listing.deleteOne();
    }

    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings for the current volunteer
const getVolunteerBookings = async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const bookings = await Booking.find({ volunteer: volunteerId })
      .populate({
        path: "listing",
        populate: { path: "donor", select: "name phone email" }, // include donor info
        select: "address foodDetails overallExpiresAt isActive donor",
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getVolunteerBookings,
};
