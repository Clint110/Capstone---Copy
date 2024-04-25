const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../imagesforupload')); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });


router.post('/addvehicle', upload.single('carImage'), vehicleController.addvehicle);
router.get('/vehiclestatus', vehicleController.vecstatus);
router.get('/vehicle/details/:plateNumber', vehicleController.getVehicleDetails);
router.post('/mark-available/:plateNumber', vehicleController.markAvailable);
router.put('/vehicle/edit/:plateNumber2', vehicleController.editVehicle);
router.delete('/vehicle/delete/:plateNumber', vehicleController.deleteVehicle);
router.get('/vehicle-details/:plateNumber',vehicleController.vehicdetails );
router.get('/vehicle-details-monit/:plateNumber',vehicleController.vehicdetails2 );


module.exports = router;