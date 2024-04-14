const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController.js');


router.get("/allbook", BookingController.getAllBookings);


router.post("/addbook", BookingController.addBooking);
router.get("/booking-details/:plateNumber", BookingController.getBookingDetailsByPlateNumber);
router.put("/editbook/:id", BookingController.editBooking);


module.exports = router;