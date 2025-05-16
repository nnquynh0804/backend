const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: String,
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  shippingFee: Number,
  discount: Number,
  finalAmount: Number,
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String
  },
  paymentMethod: String,
  orderStatus: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
