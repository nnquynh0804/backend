const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route imports
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders'); // ✅ Thêm dòng này
const uploadRouter = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
// Sau:
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/auth', authRoutes);
app.use('/orders', orderRoutes); // ✅ Thêm dòng này
app.use('/upload', uploadRouter);
// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
