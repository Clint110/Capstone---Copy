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


exports.getData = async (req, res) => {
  try {
    // Fetch longitude and latitude data from the database
    const data = await Data.find({}, 'longitude latitude');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


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
    console.error('Error checking plate number:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



exports.updateData = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber;
    const { latitude, longitude } = req.body;

    // Convert latitude and longitude to numbers
    const latitudeNumber = parseFloat(latitude);
    const longitudeNumber = parseFloat(longitude);

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitudeNumber) || isNaN(longitudeNumber)) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude must be valid numbers' });
    }

    // Use findOneAndUpdate with upsert option to update existing data or insert new data
    const updatedData = await Data.findOneAndUpdate(
      { plateNumber },
      { latitude: latitudeNumber, longitude: longitudeNumber },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, message: 'Data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
