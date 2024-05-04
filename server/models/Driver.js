const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["currently driving", "active", "archived"], default: "available" } // Change "available" to "currently driving"
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
