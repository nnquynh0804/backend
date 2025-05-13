const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// 1. Nhận callback từ VietQR
app.post("/api/vietqr/callback", (req, res) => {
  console.log("📥 Callback từ VietQR:", req.body);

  // TODO: xử lý thông tin đơn hàng tại đây
  res.status(200).send("Callback received");
});

// 2. (Tuỳ chọn) Lấy Token từ VietQR (nếu tích hợp API thật)
app.get("/get-token", async (req, res) => {
  try {
    const result = await axios.post("https://api.vietqr.io/vqr/api/token_generate", {}, {
      auth: {
        username: process.env.VQR_USER,
        password: process.env.VQR_PASS
      }
    });
    res.json(result.data);
  } catch (e) {
    console.error("Lỗi lấy token:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend chạy tại http://localhost:${PORT}`);
});