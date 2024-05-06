const express = require('express');
const router = express.Router();
const completedBookingController = require('../controllers/completedBookingController');

// POST request to create a completed booking
router.post('/completed-bookings', completedBookingController.createCompletedBooking);
router.get('/check-completed-bookings', completedBookingController.checkCompletedBookings);
router.get('/check-completed-bookings2', completedBookingController.checkCompletedBookings2);
router.get('/get-all-completedbookings', completedBookingController.getAllCompletedBookings);
router.get('/get-latest-completed-booking', completedBookingController.getLatestCompletedBooking);
router.get('/get-all-completedbookings2', completedBookingController.getAllCompletedBookings2);

module.exports = router;