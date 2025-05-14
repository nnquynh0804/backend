const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Callback API cho Ecommerce
app.post("/api/ecommerce/callback", (req, res) => {
  console.log("📥 Callback từ VietQR (Ecommerce):", req.body);
  res.status(200).send("Callback received");
});

// Endpoint tạo token cho Ecommerce
app.post("/api/token_generate", async (req, res) => {
  try {
    const result = await axios.post("https://api.vietqr.io/vqr/api/token_generate", {}, {
      headers: {
        'Authorization': `Bearer ${process.env.VQR_API_KEY}` // Sử dụng API key ở đây
      }
    });
    res.json(result.data);
  } catch (e) {
    console.error("❌ Lỗi token:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// In ra các routes đã đăng ký
app._router.stack
  .filter(r => r.route)
  .map(r => console.log(`✅ ROUTE: ${r.route.path}`));
