const express = require("express");
const router = express.Router();
const DataController = require("../controllers/DataController");

router.post("/store-data", DataController.storeData);
router.get("/get-data", DataController.getData);
// router.get("/get-data-plate", DataController.getData2);
router.get("/get-data-plate", DataController.getDataPlate);
router.get("/get-latest-data", DataController.getLatestData);
router.get("/check-plate/:plateNumber", DataController.checkPlate);
router.put("/update-data/:plateNumber", DataController.updateData);
// router.delete('/delete-data/:plateNumber', DataController.deleteVehicle);
router.get("/get-data-plate/:plateNumber", DataController.getDataByPlateNumber);

module.exports = router;
