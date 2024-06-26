const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController.js');


router.get("/allbook", BookingController.getAllBookings);


router.post("/addbook", BookingController.addBooking);
router.get("/booking-details/:plateNumber", BookingController.getBookingDetailsByPlateNumber);
router.put("/editbook/:id", BookingController.editBooking);
router.delete("/deletebook/:plateNumber", BookingController.deleteBooking);
router.post("/archive/:booking_id", BookingController.archiveBooking);
router.get("/archivedbook", BookingController.getArchivedBookings);
router.put("/activatebook/:booking_id", BookingController.activateBooking);

module.exports = router;