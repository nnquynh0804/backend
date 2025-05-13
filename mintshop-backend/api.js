const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Callback từ VietQR (nếu dùng sau này)
app.post("/api/vietqr/callback", (req, res) => {
  console.log("📥 Callback từ VietQR:", req.body);
  res.status(200).send("Callback received");
});

// ✅ Endpoint CHUẨN để VietQR gọi POST
app.post("/api/token_generate", async (req, res) => {
  try {
    const result = await axios.post("https://api.vietqr.io/vqr/api/token_generate", {}, {
      auth: {
        username: process.env.VQR_USER,
        password: process.env.VQR_PASS
      }
    });
    res.json(result.data);
  } catch (e) {
    console.error("❌ Lỗi token:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
