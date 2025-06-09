const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid'); // để tạo tên file ảnh không trùng

// POST /products - Thêm sản phẩm kèm ảnh base64
router.post('/', async (req, res) => {
  const { name, price, quantity, imageBase64 } = req.body;

  if (!name || !price || !quantity || !imageBase64) {
    return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc ảnh' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !REPO) {
    return res.status(500).json({ message: 'Thiếu cấu hình GitHub trong .env' });
  }

  // Tạo tên file duy nhất
  const filename = `${uuidv4()}.png`;

  try {
    // Upload ảnh lên GitHub
    const uploadRes = await fetch(`https://api.github.com/repos/${REPO}/contents/images/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Product App'
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content: imageBase64,
        branch: BRANCH
      })
    });

    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok || !uploadJson.content || !uploadJson.content.download_url) {
      console.error('Upload thất bại:', uploadJson);
      return res.status(500).json({ message: 'Lỗi khi upload ảnh lên GitHub' });
    }

    const imageUrl = uploadJson.content.download_url;

    // Lưu sản phẩm vào MongoDB
    const product = new Product({ name, price, quantity, images: imageUrl });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Lỗi:', err.message);
    res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm', error: err.message });
  }
});
