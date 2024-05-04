const express = require('express');
const router = express.Router();
const completedBookingController = require('../controllers/completedBookingController');

// POST request to create a completed booking
router.post('/completed-bookings', completedBookingController.createCompletedBooking);
router.get('/check-completed-bookings', completedBookingController.checkCompletedBookings);
router.get('/get-all-completedbookings', completedBookingController.getAllCompletedBookings);

module.exports = router;