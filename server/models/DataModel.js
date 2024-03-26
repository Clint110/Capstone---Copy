const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  // Define your data fields here
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  // Add more fields as needed
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;