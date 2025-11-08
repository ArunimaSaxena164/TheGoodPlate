const express = require("express");
const router = express.Router();
const { createBooking, updateBookingStatus,getVolunteerBookings } = require("../controllers/bookingController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/", verifyToken, createBooking);
router.put("/status", verifyToken, updateBookingStatus);
router.get("/my-bookings",verifyToken,getVolunteerBookings);

module.exports = router;
