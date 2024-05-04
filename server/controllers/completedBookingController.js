const CompletedBooking = require('../models/CompletedBooking');

exports.createCompletedBooking = async (req, res) => {
    try {
        const { bookingID, plateNumber, name, clientName, passengerNames, destination, timeAndDate, returnDate } = req.body;
        const completedBooking = new CompletedBooking({
            bookingID,
            plateNumber,
            name,
            clientName,
            passengerNames,
            destination,
            timeAndDate,
            returnDate
            // Add other fields as needed
        });
        await completedBooking.save();
        res.status(201).json({ message: 'Completed booking created successfully' });
    } catch (error) {
        console.error('Error creating completed booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkCompletedBookings = async (req, res) => {
    try {
      const completedBookings = await CompletedBooking.find({}, 'bookingID'); // Use '_id' instead of 'id'
      console.log(completedBookings);
      res.json({ completedBookings });
    } catch (error) {
      console.error("Error fetching completed bookings:", error);
      res.status(500).json({ error: "Error fetching completed bookings" });
    }
  };