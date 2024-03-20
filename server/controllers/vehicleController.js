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

exports.vecstatus = async (req, res) => {
    try {
        // Fetch all distinct plate numbers from the Vehicle model
        const plateNumbersInVehicles = await Vehicle.find().distinct('plateNumber');

        const statusObject = {};
        
        plateNumbersInVehicles.forEach((plateNumber) => {
          statusObject[plateNumber] = 'Available';
        });
    
        // Use Promise.all to handle asynchronous operations
        await Promise.all(plateNumbersInVehicles.map(async (plateNumber) => {
          // Check if the plate number is used in the Booking model
          const isPlateNumberUsed = await Booking.exists({ plateNumber });
    
          // If used, update the status to "Used"
          if (isPlateNumberUsed) {
            statusObject[plateNumber] = 'Used';
          }
        }));
    
        // Send the vehicle status as JSON response
        res.json(statusObject);
      } catch (error) {
        console.error('Error fetching vehicle status:', error);
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
        booking: {
          clientName: bookingDetails.clientName,
          passengerQuantity: bookingDetails.passengerQuantity,
          boundFor: bookingDetails.boundFor,
          timeAndDate: bookingDetails.timeAndDate,
          returnDate: bookingDetails.returnDate,
        },
      };

      console.log(details);
  
      res.json(details);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }