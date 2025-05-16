const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});

module.exports = mongoose.model('Customer', UserSchema, 'customers');

