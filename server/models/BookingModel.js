const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // plateNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  // passengerQuantity: { type: Number, required: true },
  passengerNames: [{ type: String }],
  destination: { type: String, enum: ["WOS", "BOS"], required: true },
  boundFor: { type: String, required: true },
  timeAndDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  purpose: { type: String, required: true },
  timeForBound: { type: String, required: true },
  status: { type: String, enum: ["active", "archived"], default: "active" } // New field for status
});

//Brendyl Ani
bookingSchema.virtual("totalTrips").get(function () {
  // Calculate total trips based on some logic
  return 10; // For example, return a fixed value for demonstration
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
