const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDbStatus } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database (with automatic fallback to in-memory store)
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AgriTech - Smart Farming Management System',
    timestamp: new Date().toISOString(),
    databaseConnected: getDbStatus(),
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 AgriTech API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
