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
app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
});

module.exports = router;
