const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);


const bikeSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    color: String,
    rating: Number
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
