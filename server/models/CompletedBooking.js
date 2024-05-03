const mongoose = require('mongoose');

const completedBookingSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true },
    name: {type: String, required: true},
    clientName: { type: String, required: true },
    passengerNames: { type: String, required: true },
    destination: { type: String, required: true },
    timeAndDate: { type: Date, required: true },
    // Add other fields as needed
});

const CompletedBooking = mongoose.model('CompletedBooking', completedBookingSchema);

module.exports = CompletedBooking;