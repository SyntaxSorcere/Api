const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Food', foodSchema, 'fooddetails');
console.log("Food Model works");
