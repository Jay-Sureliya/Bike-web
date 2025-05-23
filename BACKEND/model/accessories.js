const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    image: String,
    description: String,
});

module.exports = mongoose.model('Accessory', accessorySchema);