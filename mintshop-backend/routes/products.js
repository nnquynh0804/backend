// routes/products.js
const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

/* ------------------------- GET danh sách ------------------------- */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error: err.message });
  }
});

/* -------------------------- GET chi tiết ------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format', error: err.message });
  }
});

/* --------------------------- CREATE ------------------------------ */
router.post('/', async (req, res) => {
  const { name, price, quantity, imageUrl } = req.body;

  // Kiểm tra thiếu trường
  if (!name || !price || !quantity || !imageUrl) {
    return res.status(400).json({ message: 'Thiếu name, price, quantity hoặc imageUrl' });
  }

  try {
    const product = new Product({ name, price, quantity, images: imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: err.message });
  }
});

/* ---------------------------- UPDATE ----------------------------- */
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật', error: err.message });
  }
});

/* ---------------------------- DELETE ----------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi xoá', error: err.message });
  }
});

module.exports = router;
