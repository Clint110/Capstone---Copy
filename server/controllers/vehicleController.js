const Vehicle = require('../models/Vehicle');
const Booking = require('../models/BookingModel');

exports.addvehicle = async (req, res) => {
    try {
        const { plateNumber2, addvehicles } = req.body;
        const carImage = req.file ? req.file.filename : null; // Check if a file is uploaded
    
        if (!carImage) {
          // Handle the case when no image is uploaded
          return res.status(400).json({ success: false, error: 'No image uploaded' });
      }

      const vehicle = new Vehicle({
          plateNumber: plateNumber2,
          vehicleName: addvehicles,
          carImage: carImage,
      });
    
        await vehicle.save();
    
        res.json({ success: true });
      } catch (error) {
        console.error('Error adding vehicle:', error);
        res.json({ success: false, error: 'Internal Server Error' });
      }
};

// exports.vecstatus = async (req, res) => {
//     try {
//         // Fetch all distinct plate numbers from the Vehicle model
//         const plateNumbersInVehicles = await Vehicle.find().distinct('plateNumber');

//         const statusObject = {};
        
//         plateNumbersInVehicles.forEach((plateNumber) => {
//           statusObject[plateNumber] = 'Available';
//         });
    
//         // Use Promise.all to handle asynchronous operations
//         await Promise.all(plateNumbersInVehicles.map(async (plateNumber) => {
//           // Check if the plate number is used in the Booking model
//           const isPlateNumberUsed = await Booking.exists({ plateNumber });
    
//           // If used, update the status to "Used"
//           if (isPlateNumberUsed) {
//             statusObject[plateNumber] = 'Used';
//           }
//         }));
    
//         // Send the vehicle status as JSON response
//         res.json(statusObject);
//       } catch (error) {
//         console.error('Error fetching vehicle status:', error);
//         res.status(500).json({ error: 'Internal server error' });
//       }
//   };


// exports.vecstatus = async (req, res) => {
//   try {
//     // Fetch all distinct plate numbers from the Vehicle model
//     const plateNumbersInVehicles = await Vehicle.find().distinct('plateNumber');

//     const statusObject = {};

//     // Initialize all vehicle statuses as 'Available' by default
//     plateNumbersInVehicles.forEach((plateNumber) => {
//       statusObject[plateNumber] = 'Available';
//     });

//     // Use Promise.all to handle asynchronous operations
//     await Promise.all(plateNumbersInVehicles.map(async (plateNumber) => {
//       // Check if there is any booking for the plate number
//       const latestBooking = await Booking.findOne({ plateNumber }).sort({ returnDate: -1 });

//       if (latestBooking) {
//         // If a booking is found, check if the return date has passed
//         const returnDate = new Date(latestBooking.returnDate);
//         const currentDate = new Date();
//         if (currentDate > returnDate) {
//           // If return date has passed, mark the vehicle as 'Available'
//           statusObject[plateNumber] = 'Available';
//         } else {
//           // If return date has not passed, mark the vehicle as 'Used'
//           statusObject[plateNumber] = 'Used';
//         }
//       }
//     }));

//     // Send the vehicle status as JSON response
//     res.json(statusObject);
//   } catch (error) {
//     console.error('Error fetching vehicle status:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.vecstatus = async (req, res) => {
  try {
    // Fetch all distinct plate numbers from the Vehicle model
    const plateNumbersInVehicles = await Vehicle.find().distinct('plateNumber');

    const statusObject = {};

    // Use Promise.all to handle asynchronous operations
    await Promise.all(plateNumbersInVehicles.map(async (plateNumber) => {
      // Find the latest booking for the plate number
      const latestBooking = await Booking.findOne({ plateNumber }).sort({ returnDate: -1 });

      if (latestBooking) {
        // Check if the return date has passed
        const returnDate = new Date(latestBooking.returnDate);
        const currentDate = new Date();

        if (currentDate <= returnDate) {
          // If return date has not passed, mark the vehicle as 'Used'
          statusObject[plateNumber] = 'Used';
        } else {
          // If return date has passed, mark the vehicle as 'Available'
          statusObject[plateNumber] = 'Available';
        }
      } else {
        // If no booking found, mark the vehicle as 'Available'
        statusObject[plateNumber] = 'Available';
      }
    }));

    // Send the vehicle status as JSON response
    res.json(statusObject);
  } catch (error) {
    console.error('Error fetching vehicle status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




  exports.getPlateNumbers = async (req, res) => {
    try {
      // Fetch all distinct plate numbers from the Vehicle model
      const plateNumbers = await Vehicle.find().distinct('plateNumber');
  
      // Send the plate numbers as JSON response
      res.json(plateNumbers);
    } catch (error) {
      console.error('Error fetching plate numbers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getVehicleDetails = async (req, res) => {
    try {
      const { plateNumber } = req.params;
      const vehicleDetails = await Vehicle.findOne({ plateNumber });
  
      if (!vehicleDetails) {
        return res.status(404).json({ error: 'Vehicle details not found' });
      }
  
      const bookingDetails = await Booking.findOne({ plateNumber });
  
      if (!bookingDetails) {
        return res.status(404).json({ error: 'Booking details not found' });
      }
  
      const details = {
        vehicle: {
          plateNumber: vehicleDetails.plateNumber,
          vehicleName: vehicleDetails.vehicleName,
          carImage: `http://localhost:3000/imagesforupload/${vehicleDetails.carImage}`,
        },
        // booking: {
        //   clientName: bookingDetails.clientName,
        //   passengerQuantity: bookingDetails.passengerQuantity,
        //   boundFor: bookingDetails.boundFor,
        //   timeAndDate: bookingDetails.timeAndDate,
        //   returnDate: bookingDetails.returnDate,
        // },
      };

      console.log(details);
  
      res.json(details);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // exports.markAvailable = async (req, res) => {
  //   try {
  //     const { plateNumber } = req.params;
  //     // Check if there is an active booking for this vehicle
  //     const booking = await Booking.findOne({ plateNumber, returnDate: { $gte: new Date() } });
  //     if (booking) {
  //       return res.status(400).json({ error: 'Cannot mark vehicle as available. There is an active booking for this vehicle.' });
  //     }
  //     // Update the status of the vehicle to "Available"
  //     await Vehicle.updateOne({ plateNumber }, { $set: { status: 'Available' } });
  //     res.json({ success: true, message: 'Vehicle marked as available.' });
  //   } catch (error) {
  //     console.error('Error marking vehicle as available:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };

  // exports.markAvailable = async (req, res) => {
  //   try {
  //     const { plateNumber } = req.params;
  
  //     // Check if the plate number is already in use
  //     const vehicle = await Vehicle.findOne({ plateNumber });
  //     if (!vehicle) {
  //       return res.status(404).json({ error: 'Vehicle not found.' });
  //     }
  
  //     if (vehicle.status === 'Used') {
  //       return res.status(400).json({ error: 'Cannot mark vehicle as available. The vehicle is currently in use.' });
  //     }
  
  //     // Update the status of the vehicle to "Available"
  //     await Vehicle.updateOne({ plateNumber }, { $set: { status: 'Available' } });
  //     res.json({ success: true, message: `Vehicle with the Plate Number: ${plateNumber} marked as available.` });
  //   } catch (error) {
  //     console.error('Error marking vehicle as available:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }


  
exports.markAvailable = async (req, res) => {
  try {
    const { plateNumber } = req.params;

    // Check if the plate number is already in use
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    // Find the latest booking for the plate number
    const latestBooking = await Booking.findOne({ plateNumber }).sort({ returnDate: -1 });

    if (latestBooking) {
      // Check if the return date has passed
      const returnDate = new Date(latestBooking.returnDate);
      console.log(returnDate);
      const currentDate = new Date();
      console.log(currentDate);
      if (currentDate <= returnDate) {
        // If return date has not passed, the vehicle is currently in use
        console.log("used");
        return res.status(400).json({ error: 'Cannot mark vehicle as available. The vehicle is currently in use.' });
        
      }
    }

    // Update the status of the vehicle to "Available"
    await Vehicle.updateOne({ plateNumber }, { $set: { status: 'Available' } });
    res.json({ success: true, message: `Vehicle with the Plate Number: ${plateNumber} marked as available.` });
  } catch (error) {
    console.error('Error marking vehicle as available:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// exports.editVehicle = async (req, res) => {
//   try {
//     const { plateNumber2 } = req.params;
//     console.log(plateNumber2);
//     const { newPlateNumber, vehicleName } = req.body; // Remove carImage from here
//     console.log(newPlateNumber, vehicleName);

//     // Find the vehicle by the original plate number
//     const vehicle = await Vehicle.findOne({ plateNumber: plateNumber2 });

//     if (!vehicle) {
//       return res.status(404).json({ error: 'Vehicle not found.' });
//     }

//     // Update the vehicle details
//     vehicle.plateNumber = newPlateNumber;
//     vehicle.vehicleName = vehicleName;
    
//     // Check if a new image is uploaded
//     if (req.file) {
//       vehicle.carImage = req.file.filename; // Store the file path or identifier
//     }

//     // Save the updated vehicle
//     await vehicle.save();

//     res.json({ success: true, message: 'Vehicle updated successfully.' });
//   } catch (error) {
//     console.error('Error editing vehicle:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


exports.editVehicle = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber2; // Corrected parameter name
    const { newPlateNumber, vehicleName } = req.body; // Destructure the updated data

    // Find the vehicle by plate number and update both plateNumber and vehicleName
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { plateNumber },
      { plateNumber: newPlateNumber, vehicleName },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.deleteVehicle = async (req, res) => {
  try {
    const plateNumber = req.params.plateNumber; // Get the plate number from the request parameters
    console.log(plateNumber);
    
    // Find the vehicle by plate number and delete it
    const deletedVehicle = await Vehicle.findOneAndDelete({ plateNumber });

    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


