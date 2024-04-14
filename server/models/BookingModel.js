const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  plateNumber: { type: Number, required: true },
  clientName: { type: String, required: true },
  passengerQuantity: { type: Number, required: true },
  destination: { type: String, enum: ['WOS', 'BOS'], required: true },
  boundFor: { type: String, required: true },
  timeAndDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  purpose: { type: String, required: true },
  timeForBound: { type: String, required: true },
  active: { type: Boolean, default: true }
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;