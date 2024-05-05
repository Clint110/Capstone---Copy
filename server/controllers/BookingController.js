const Booking = require("../models/BookingModel");
const CompletedBooking = require("../models/CompletedBooking");

// exports.getAllBookings = async (req, res) => {
//   try {
//     const allBookings = await Booking.find();
//     res.json(allBookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.getAllBookings = async (req, res) => {
  try {
    let allBookings;
    if (req.query.showArchived && req.query.showArchived === "true") {
      // If showArchived is true, fetch all bookings
      allBookings = await Booking.find();
    } else {
      // If showArchived is false or not provided, fetch only active bookings
      allBookings = await Booking.find({ status: "active" });
    }
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

// exports.addBooking = async (req, res) => {
//   try {
//     const newBooking = new Booking(req.body);
//     const savedBooking = await newBooking.save();

//     res.status(200).json({
//       success: true,
//       message: "Booking added successfully",
//       booking: savedBooking,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

exports.addBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(200).json({
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
    const bookingDetails = await CompletedBooking.findOne({ plateNumber });

    if (!bookingDetails) {
      return res.status(404).json({
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


// exports.archiveBooking = async (req, res) => {
//   try {
//     const plateNumber = req.params.plateNumber;

//     // Find the booking by plate number and update its status to "archived"
//     const archivedBooking = await Booking.findOneAndUpdate(
//       { plateNumber, status: "active" }, // Find active booking with plate number
//       { $set: { status: "archived" } }, // Set status to "archived"
//       { new: true } // Return the updated document
//     );

//     if (!archivedBooking) {
//       return res.status(404).json({ error: "Active booking not found" });
//     }

//     res.json({
//       success: true,
//       message: "Booking archived successfully",
//       booking: archivedBooking,
//     });
//   } catch (error) {
//     console.error("Error archiving booking:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


exports.archiveBooking = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;

    // Find the booking by plate number and update its status to "archived"
    const archivedBooking = await Booking.findOneAndUpdate(
      { plateNumber, status: "active" }, // Find active booking with plate number
      { $set: { status: "archived" } }, // Set status to "archived"
      { new: true } // Return the updated document
    );

    if (!archivedBooking) {
      return res.status(404).json({ error: "Active booking not found" });
    }

    res.json({
      success: true,
      message: "Booking archived successfully",
      booking: archivedBooking,
    });
  } catch (error) {
    console.error("Error archiving booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.activateBooking = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;

    // Find the booking by plate number and update its status to "active"
    const activatedBooking = await Booking.findOneAndUpdate(
      { plateNumber, status: "archived" }, // Find archived booking with plate number
      { $set: { status: "active" } }, // Set status to "active"
      { new: true } // Return the updated document
    );

    if (!activatedBooking) {
      return res.status(404).json({ error: "Archived booking not found" });
    }

    res.json({
      success: true,
      message: "Booking activated successfully",
      booking: activatedBooking,
    });
  } catch (error) {
    console.error("Error activating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getArchivedBookings = async (req, res) => {
  try {
    // Find all archived bookings
    const archivedBookings = await Booking.find({ status: "archived" });

    res.json(archivedBookings);
  } catch (error) {
    console.error("Error fetching archived bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//BRENDYL ANI
// New function to get the count of bookings for a specific car
exports.getBookingCountByPlateNumber = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;
    const bookingCount = await Booking.countDocuments({ plateNumber });

    res.json({ plateNumber, bookingCount });
  } catch (error) {
    console.error("Error counting bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
