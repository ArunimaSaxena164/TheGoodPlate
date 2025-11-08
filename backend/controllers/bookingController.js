const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const createBooking = async (req, res) => {
  try {
    const { listingId, items } = req.body;
    const volunteerId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive)
      return res.status(404).json({ message: "Listing not found or inactive" });

    // update remainingQuantity
    items.forEach((itemReq) => {
      const foodItem = listing.foodDetails.id(itemReq.itemId);
      if (foodItem && foodItem.remainingQuantity >= itemReq.quantity) {
        foodItem.remainingQuantity -= itemReq.quantity;
      } else {
        throw new Error(`Invalid quantity for ${foodItem?.name}`);
      }
    });

    // check if listing should be deactivated
    const totalRemaining = listing.foodDetails.reduce(
      (acc, i) => acc + i.remainingQuantity,
      0
    );
    if (totalRemaining === 0) listing.isActive = false;

    await listing.save();

    // save booking
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
const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  const booking = await Booking.findById(bookingId).populate("listing");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = status;
  await booking.save();

  // restore quantities if cancelled
  if (status === "cancelled") {
    const listing = booking.listing;
    booking.items.forEach((it) => {
      const item = listing.foodDetails.id(it.itemId);
      if (item) item.remainingQuantity += it.quantity;
    });
    listing.isActive = true;
    await listing.save();
  }

  // delete listing if delivered and all gone
  if (status === "delivered") {
    const listing = booking.listing;
    const totalRemaining = listing.foodDetails.reduce(
      (acc, i) => acc + i.remainingQuantity,
      0
    );
    if (totalRemaining === 0) await listing.deleteOne();
  }

  res.json({ message: "Status updated", booking });
};
module.exports={createBooking,updateBookingStatus};
