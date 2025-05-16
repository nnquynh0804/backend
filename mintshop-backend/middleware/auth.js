const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// Kiểm tra xem người dùng đã đăng nhập chưa
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Gắn thông tin user vào req
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
}

// Chỉ cho phép người có role 'admin' truy cập
function requireAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin được phép truy cập' });
    }
    next();
  });
}

module.exports = {
  verifyToken,
  requireAdmin
};
