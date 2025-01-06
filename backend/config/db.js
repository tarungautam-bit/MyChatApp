const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:7579@TarNar@cluster0.9xpr3.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0;
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:7579@TarNar@cluster0.9xpr3.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0';

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
