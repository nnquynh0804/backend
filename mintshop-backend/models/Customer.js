const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  balance: { type: Number, required: true }
});

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  dob: { type: Date },
  password: { type: String, required: true }, // ✅ sửa lại từ 'hashedPassword'
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  accounts: [accountSchema]
});

module.exports = mongoose.model('Customer', customerSchema);
