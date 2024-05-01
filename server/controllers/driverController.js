const Driver = require("../models/Driver");

/// Create a new driver
// exports.createDriver = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const driver = new Driver({ name });
//     await driver.save();
//     res.status(201).json(driver);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.addDriver = async (req, res) => {
  try {
    const { name } = req.body;
    const newDriver = new Driver({ name });
    const savedDriver = await newDriver.save();
    res.status(200).json({ success: true, message: "Driver added successfully", driver: savedDriver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
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


exports.getArchivedDrivers = async (req, res) => {
  try {
    const archivedDrivers = await Driver.find({ status: "archived" });
    res.json(archivedDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getActiveDrivers = async (req, res) => {
  try {
    const activeDrivers = await Driver.find({ status: "active" });
    res.json(activeDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedDriver = await Driver.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updatedDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.archiveDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedDriver = await Driver.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    res.json(archivedDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.activateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const activateDriver = await Driver.findByIdAndUpdate(id, { status: "active" }, { new: true });
    res.json(activateDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};