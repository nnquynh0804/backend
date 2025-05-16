const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

router.post('/register', async (req, res) => {
  const { email, password, fullName, phone, address, dob } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email đã được đăng ký' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    hashedPassword,
    fullName,
    phone,
    address,
    dob,
    role: 'customer',   // mặc định
    accounts: []         // mặc định là chưa có tài khoản nào
  });

  res.json({ message: 'Đăng ký thành công' });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, role: user.role });
});

module.exports = router;
