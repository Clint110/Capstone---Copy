const Booking = require('../models/BookingModel');

exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(200).json({ success: true, message: "Booking added successfully", booking: savedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};