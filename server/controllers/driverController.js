const Driver = require("../models/Driver");
const CompletedBooking = require('../models/CompletedBooking');

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


// exports.driverStatus = async (req, res) => {
//   try {
//     console.log("Fetching driver status based on completed bookings...");
//     // Fetch all drivers from the Driver model
//     const drivers = await Driver.find();

//     // Fetch completed bookings from the CompletedBooking model
//     const completedBookings = await CompletedBooking.find({}, "name"); // Assuming clientName is used to match with driver name

//     const statusObject = {};

//     // Iterate over each driver
//     drivers.forEach((driver) => {
//       // Check if the driver's name is present in completed bookings
//       const isDriving = completedBookings.some(booking => booking.name === driver.name);
//       statusObject[driver._id] = {
//         name: driver.name,
//         status: isDriving ? "Currently Driving" : "Available"
//       };
//     });

//     console.log("Driver status object based on completed bookings:", statusObject);

//     // Send the driver status as JSON response
//     res.json(statusObject);
//   } catch (error) {
//     console.error("Error fetching driver status based on completed bookings:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// exports.driverStatus = async (req, res) => {
//   try {
//     console.log("Fetching driver status based on completed bookings...");
    
//     // Fetch all drivers from the Driver model
//     const drivers = await Driver.find();
    
//     // Fetch latest completed bookings for each driver
//     const latestCompletedBookings = await CompletedBooking.aggregate([
//       { $group: { _id: "$name", latestBooking: { $last: "$$ROOT" } } }
//     ]);
    
//     const statusObject = {};
    
//     // Iterate over each driver
//     drivers.forEach((driver) => {
//       // Find the latest completed booking for the driver
//       const latestBooking = latestCompletedBookings.find(booking => booking._id === driver.name)?.latestBooking;
      
//       // Check if the latest completed booking exists and if the return date has passed
//       const isAvailable = !latestBooking || new Date(latestBooking.returnDate) <= new Date();
      
//       statusObject[driver._id] = {
//         name: driver.name,
//         status: isAvailable ? "Available" : "Currently Driving"
//       };
//     });

//     console.log("Driver status object based on completed bookings:", statusObject);

//     // Send the driver status as JSON response
//     res.json(statusObject);
//   } catch (error) {
//     console.error("Error fetching driver status based on completed bookings:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.driverStatus = async (req, res) => {
  try {
    console.log("Fetching driver status based on completed bookings...");
    
    // Fetch all active drivers from the Driver model
    const activeDrivers = await Driver.find({ status: "active" });
    
    // Fetch latest completed bookings for each driver
    const latestCompletedBookings = await CompletedBooking.aggregate([
      { $group: { _id: "$name", latestBooking: { $last: "$$ROOT" } } }
    ]);
    
    const statusObject = {};
    
    // Iterate over each active driver
    activeDrivers.forEach((driver) => {
      // Find the latest completed booking for the driver
      const latestBooking = latestCompletedBookings.find(booking => booking._id === driver.name)?.latestBooking;
      
      // Check if the latest completed booking exists and if the return date has passed
      const isAvailable = !latestBooking || new Date(latestBooking.returnDate) <= new Date();
      
      statusObject[driver._id] = {
        name: driver.name,
        status: isAvailable ? "Available" : "Currently Driving"
      };
    });

    console.log("Driver status object based on completed bookings:", statusObject);

    // Send the driver status as JSON response
    res.json(statusObject);
  } catch (error) {
    console.error("Error fetching driver status based on completed bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAvailableDrivers = async (req, res) => {
  try {
    const activeDrivers = await Driver.find({ status: "active" });

    res.json(activeDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUsedDrivers = async (req, res) => {
  try {
    
    const activeDrivers = await Driver.find({ status: "active" });

   // Fetch latest completed bookings for each driver
   const latestCompletedBookings = await CompletedBooking.aggregate([
    { $group: { _id: "$name", latestBooking: { $last: "$$ROOT" } } }
  ]);
  
  const statusObject = {};
  
  // Iterate over each active driver
  activeDrivers.forEach((driver) => {
    // Find the latest completed booking for the driver
    const latestBooking = latestCompletedBookings.find(booking => booking._id === driver.name)?.latestBooking;
    
    // Check if the latest completed booking exists and if the return date has passed
    const isAvailable = !latestBooking || new Date(latestBooking.returnDate) <= new Date();
    
    statusObject[driver._id] = {
      name: driver.name,
      status: isAvailable ? "Available" : "Currently Driving"
    };
  });

  console.log("Driver status object based on completed bookings:", statusObject);

  // Send the driver status as JSON response
  res.json(statusObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};