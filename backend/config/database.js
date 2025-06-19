const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not found in environment variables');
      console.log('Using default MongoDB connection: mongodb://localhost:27017/aquanest');
      console.log('Make sure MongoDB is running locally or set MONGODB_URI in .env file');
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aquanest';
    
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('');
    console.log('To fix this issue:');
    console.log('1. Install MongoDB locally, or');
    console.log('2. Use MongoDB Atlas and update MONGODB_URI in .env file');
    console.log('3. For now, the API will run without database connection');
    console.log('');
    // Don't exit process, let the app run without DB for development
  }
};

module.exports = connectDB;
