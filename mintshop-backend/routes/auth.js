const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// Đăng ký tài khoản
router.post('/register', async (req, res) => {
  const { email, password, fullName, phone, address, dob } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email đã được đăng ký' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    hashedPassword,        // ✅ lưu mật khẩu đã mã hóa vào field "hashedPassword"
    fullName,
    phone,
    address,
    dob,
    role: 'customer',      // mặc định là customer
    accounts: []
  });

  res.json({ message: 'Đăng ký thành công' });
});

// Đăng nhập tài khoản
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // ✅ kiểm tra với field "hashedPassword" thay vì "password"
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, role: user.role, fullName: user.fullName });
});

module.exports = router;
