const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["active", "archived"], default: "active" } // Add status field
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
