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

const Data = require('../models/DataModel');

exports.storeData = async (req, res) => {
  try {
    console.log('Received data:', req.body); // Add this line to print the received data
    
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.status(200).json({ success: true, message: "Data stored successfully", data: savedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}