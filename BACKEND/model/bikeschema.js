const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const bikeSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    color: String,
    rating: Number
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
