const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/canada_fss_portal');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
