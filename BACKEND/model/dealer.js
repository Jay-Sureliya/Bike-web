const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  phone: String,
  email: String,
  mapUrl: String,
});

module.exports = mongoose.model("dealer", dealerSchema);
