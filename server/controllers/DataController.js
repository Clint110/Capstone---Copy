// const Data = require('../models/DataModel');

// exports.storeData = async (req, res) => {
//   try {
//     const newData = new Data(req.body);
//     const savedData = await newData.save();
//     res.status(200).json({ success: true, message: "Data stored successfully", data: savedData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

const Data = require("../models/DataModel");

exports.storeData = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Add this line to print the received data

    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(200).json({
      success: true,
      message: "Data stored successfully",
      data: savedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getData = async (req, res) => {
  try {
    // Fetch longitude and latitude data from the database
    const data = await Data.find({}, "longitude latitude");
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


exports.getLatestData = async (req, res) => {
  try {
    // Fetch latest data from the database, sorted by time in descending order
    const latestData = await Data.findOne({}, {}, { sort: { _id: -1 } });
    console.log("Latest data fetched for map:", latestData);
    res.json({success: true, data: latestData });
  } catch (error) {
    console.error("Error fetching latest data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// exports.getDataPlate = async (req, res) => {
//   // Changed function name
//   try {
//     // Fetch all data from the database
//     const data = await Data.find({}, "plateNumber latitude longitude time"); // Modified query to include all required fields
//     res.json({ success: true, data });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

exports.getDataPlate = async (req, res) => {
  try {
    const { plateNumber } = req.params; // Get plate number from request parameters

    // Fetch the latest data for the specified plate number
    const latestData = await Data.findOne({ plateNumber })
      .sort({ _id: -1 }) // Sort by _id in descending order to get the latest entry
      .select("plateNumber latitude longitude time"); // Select the required fields

    if (!latestData) {
      return res.status(404).json({ success: false, error: "Data not found" });
    }

    res.json({ success: true, data: latestData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getData2 = async (req, res) => {
  try {
    // Fetch longitude and latitude data from the database
    const data = await Data.find({}, "plateNumber longitude latitude");
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// exports.getDataByPlateNumber = async (req, res) => {
//   try {
//     const { plateNumber } = req.params;

//     // Find the data in the database by plateNumber
//     const data = await Data.findOne({ plateNumber });

//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         error: "Data not found for the given plate number",
//       });
//     }

//     // Respond with the latitude and longitude data
//     res.json({
//       success: true,
//       latitude: data.latitude,
//       longitude: data.longitude,
//     });
//   } catch (error) {
//     console.error("Error fetching data by plate number:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

exports.getDataByPlateNumber = async (req, res) => {
  try {
    const { plateNumber } = req.params;
    console.log(`Fetching data from MongoDB for plate number: ${plateNumber}`);
    
    // Fetch data from MongoDB
    const latestData = await Data.findOne({ plateNumber })
      .sort({ _id: -1 })
      .select("latitude longitude time");
    
    console.log("Latest data found:", latestData); // Log the data retrieved
    
    if (!latestData) {
      console.log(`No data found in MongoDB for plate number: ${plateNumber}`);
      return res.status(404).json({
        success: false,
        error: "Data not found for the given plate number",
      });
    }

    // Respond with the latitude and longitude data
    res.json({
      success: true,
      data: {
        latitude: latestData.latitude,
        longitude: latestData.longitude,
        time: latestData.time
      },
    });
  } catch (error) {
    console.error("Error fetching data by plate number:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// exports.getDataByPlateNumber = async (req, res) => {
//   try {
//     const { plateNumber } = req.params; // Extract plate number from request parameters
//     console.log(`Fetching data from MongoDB for plate number: ${plateNumber}`);
//     // Find the latest data in the database by plateNumber
//     const latestData = await Data.findOne({ plateNumber })
//       .sort({ _id: -1 }) // Sort by _id in descending order to get the latest entry
//       .select("latitude longitude"); // Select only the required fields

//     if (!latestData) {
//       return res.status(404).json({
//         success: false,
//         error: "Data not found for the given plate number",
//       });
//     }

//     // Respond with the latitude and longitude data
//     res.json({
//       success: true,
//       latitude: latestData.latitude,
//       longitude: latestData.longitude,
//     });
//   } catch (error) {
//     console.error("Error fetching data by plate number:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

// exports.checkPlate = async (req, res) => {
//   try {
//     let plateNumber = req.params.plateNumber;

//     console.log(plateNumber);

//     // Convert plateNumber to string if it's not already a string
//     if (typeof plateNumber !== 'string') {
//       plateNumber = plateNumber.toString();

//        // Find the data in the database by plateNumber
//     const existingData = await Data.findOne({ plateNumber });

//     if (existingData) {
//       res.json({ exists: true });
//     } else {
//       res.json({ exists: false });
//     }
//     }

//   } catch (error) {
//     console.error('Error checking plate number:', error);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// }

exports.checkPlate = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;

    // Find the data in the database by plateNumber
    const existingData = await Data.findOne({ plateNumber });

    if (existingData) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking plate number:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.updateData = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;
    const { latitude, longitude } = req.body;

    // Convert latitude and longitude to numbers
    const latitudeNumber = parseFloat(latitude);
    const longitudeNumber = parseFloat(longitude);

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitudeNumber) || isNaN(longitudeNumber)) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude must be valid numbers",
      });
    }

    // Use findOneAndUpdate with upsert option to update existing data or insert new data
    const updatedData = await Data.findOneAndUpdate(
      { plateNumber },
      { latitude: latitudeNumber, longitude: longitudeNumber },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
