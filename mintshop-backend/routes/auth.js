const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// Đăng ký tài khoản (mặc định là customer)
router.post('/register', async (req, res) => {
  const { email, password, fullName, phone, address, dob } = req.body;

  const existing = await Customer.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email đã được đăng ký' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Customer.create({
    email,
    password: hashedPassword,
    fullName,
    phone,
    address,
    dob,
    role: 'customer',
    accounts: []
  });

  res.json({ message: 'Đăng ký thành công' });
});

// Đăng nhập (admin hoặc customer)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await Customer.findOne({ email });
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc không hợp lệ' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Sai mật khẩu' });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    role: user.role,
    fullName: user.fullName,
    email: user.email
  });
});



module.exports = router;
