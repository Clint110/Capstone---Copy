const Booking = require("../models/BookingModel");

exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.json(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.addBooking = async (req, res) => {
//   try {
//     const newBooking = new Booking(req.body);
//     const savedBooking = await newBooking.save();

//     res.status(200).json({ success: true, message: "Booking added successfully", booking: savedBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

exports.addBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Booking added successfully",
        booking: savedBooking,
      });
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
      return res
        .status(404)
        .json({
          error: "Booking details not found for the provided plate number",
        });
    }

    res.json(bookingDetails);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedData = req.body;

    // Find the booking by id and update it with the new data
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;

    // Find the booking by plate number and delete it
    const deletedBooking = await Booking.findOneAndDelete({ plateNumber });

    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
