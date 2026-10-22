const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech', {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to local MongoDB (${error.message}).`);
    console.log(`[AgriTech] Running with memory cache fallback for demo/offline use. To persist data to cloud MongoDB, set MONGO_URI in backend/.env to your MongoDB Atlas connection string.`);
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
