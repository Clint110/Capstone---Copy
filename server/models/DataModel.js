const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  plateNumber: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  time: { type: String, required: true }, // Adding time field
});
const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
