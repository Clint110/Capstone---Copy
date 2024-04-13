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

exports.getBookingDetailsByPlateNumber = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;
    // Find booking details based on the provided plate number
    const bookingDetails = await Booking.findOne({ plateNumber });

    if (!bookingDetails) {
      return res.status(404).json({ error: 'Booking details not found for the provided plate number' });
    }

    res.json(bookingDetails);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};