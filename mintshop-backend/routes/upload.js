const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/upload', async (req, res) => {
  const { filename, contentBase64 } = req.body;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  const url = `https://api.github.com/repos/${REPO}/contents/images/${filename}`;
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
      },
      body: JSON.stringify(body)
    });

    const json = await result.json();
    if (json.content && json.content.download_url) {
      res.json({ url: json.content.download_url });
    } else {
      res.status(500).json({ error: json });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(express.json({
  strict: true,
  verify: (req, res, buf) => {
    if (buf && buf.length === 0) {
      throw new Error('❌ Empty JSON body');
    }
  }
}));

module.exports = router;
