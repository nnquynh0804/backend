const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST - Tạo đơn hàng
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Lấy tất cả đơn hàng
router.get('/', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

module.exports = router;
