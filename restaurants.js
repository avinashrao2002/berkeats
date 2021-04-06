const mongoose = require('mongoose')
const restaurantSchema = new mongoose.Schema({
    name: String,
    open: Boolean,
    categories: Array,
    stars: Number,
    full_address: String,
    photo_url: String,
    price: Number
})
const Restaurant = mongoose.model('Restaurant', restaurantSchema)
module.exports.Restaurant = Restaurant
//