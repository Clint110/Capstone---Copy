const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');

router.post('/store-data', DataController.storeData);
router.get('/get-data', DataController.getData);

module.exports = router;