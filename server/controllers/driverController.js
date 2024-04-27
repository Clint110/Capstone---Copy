const Driver = require("../models/Driver");

/// Create a new driver
exports.createDriver = async (req, res) => {
  try {
    const { name } = req.body;
    const driver = new Driver({ name });
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
