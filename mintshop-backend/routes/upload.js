// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Middleware để parse JSON, và kiểm tra body không rỗng
app.use(express.json({
  strict: true,
  verify: (req, res, buf) => {
    if (buf && buf.length === 0) {
      throw new Error('❌ Empty JSON body');
    }
  }
}));

// POST /upload để upload ảnh base64 lên GitHub
app.post('/upload', async (req, res) => {
  const { filename, contentBase64 } = req.body;

  if (!filename || !contentBase64) {
    return res.status(400).json({ error: 'Thiếu filename hoặc contentBase64' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO; // ví dụ: "username/reponame"
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !REPO) {
    return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN hoặc GITHUB_REPO trong env' });
  }

  const url = `https://api.github.com/repos/${REPO}/contents/images/${filename}`;

  // Body request API GitHub upload file
  const body = {
    message: `Upload ${filename}`,
    content: contentBase64,
    branch: BRANCH
  };

  try {
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js App'
      },
      body: JSON.stringify(body)
    });

    const json = await result.json();

    if (result.ok && json.content && json.content.download_url) {
      return res.json({ url: json.content.download_url });
    } else {
      console.error('GitHub API error:', json);
      return res.status(500).json({ error: json.message || 'Lỗi khi upload file lên GitHub' });
    }
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route test để xem server chạy
app.get('/', (req, res) => {
  res.send('Server upload ảnh lên GitHub đang chạy');
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
