// routes/upload.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ message: 'Thiếu imageBase64' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !REPO) {
    return res.status(500).json({ message: 'Thiếu cấu hình GitHub trong .env' });
  }

  const filename = `${uuidv4()}.png`;

  try {
    const uploadRes = await fetch(`https://api.github.com/repos/${REPO}/contents/images/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'UploadImageApp'
      },
      body: JSON.stringify({
        message: `Upload ${filename}`,
        content: imageBase64,
        branch: BRANCH
      })
    });

    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok || !uploadJson.content || !uploadJson.content.download_url) {
      return res.status(500).json({ message: 'Lỗi khi upload ảnh lên GitHub', detail: uploadJson });
    }

    res.status(200).json({ imageUrl: uploadJson.content.download_url });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi upload ảnh', error: err.message });
  }
});

module.exports = router;
