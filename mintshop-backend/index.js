const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// 1. Nhận callback từ VietQR
app.post("/api/vietqr/callback", (req, res) => {
  console.log("📥 Callback từ VietQR:", req.body);
  // TODO: xử lý đơn hàng
  res.status(200).send("Callback received");
});

// 2. ✅ Route chính xác để VietQR gọi POST lấy token
app.post("/token_generate", async (req, res) => {
  try {
    const result = await axios.post("https://api.vietqr.io/vqr/api/token_generate", {}, {
      auth: {
        username: process.env.VQR_USER,
        password: process.env.VQR_PASS
      }
    });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend chạy tại http://localhost:${PORT}`);
});
