const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

router.post("/add", driverController.addDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/archived", driverController.getArchivedDrivers); // Route for archived drivers
router.get("/drivers/active", driverController.getActiveDrivers);
router.put("/drivers/:id", driverController.updateDriver);
router.put("/drivers/:id/archive", driverController.archiveDriver);
router.put("/drivers/:id/activate", driverController.activateDriver);
router.get('/driverstatus', driverController.driverStatus);
router.get("/drivers/onTravel", driverController.getUsedDrivers);
router.get("/drivers/available", driverController.getAvailableDrivers);

module.exports = router;
