const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  name: String,
  image: String
});

module.exports = mongoose.model('Logo', logoSchema);
