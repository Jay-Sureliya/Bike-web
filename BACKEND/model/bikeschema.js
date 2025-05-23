const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bikeDB');

const bikeSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    color: String,
    rating: Number
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
