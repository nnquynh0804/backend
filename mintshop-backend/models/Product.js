const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  about: { type: String, required: false },
  imageUrl: { type: String, required: true },
  quantity: {type: Int, required: true }
});

module.exports = mongoose.model('Product', productSchema);
