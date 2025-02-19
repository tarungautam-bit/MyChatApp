const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const mongoURI = process.env.MONGO_URI ;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
