// Import Mongoose - ODM (Object Data Modeling) library for MongoDB and Node.js
const mongoose = require('mongoose');

// Function to establish connection with MongoDB
const connectDB = async () => {
  try {
    // Connection options for MongoDB
    const options = {
      useNewUrlParser: true,      // Use new URL string parser
      useUnifiedTopology: true,   // Use new Server Discovery and Monitoring engine
      serverSelectionTimeoutMS: 30000, // Time to wait for server selection (30 seconds)
      socketTimeoutMS: 45000,     // Time to wait for operations to complete (45 seconds)
    };

    // Attempt to connect to MongoDB using environment variable MONGO_URI
    await mongoose.connect(process.env.MONGO_URI, options);
    
    // Error handling for connection issues
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    // Handler for disconnection events - useful for monitoring connection status
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    // Log successful connection
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  } catch (error) {
    // If connection fails, log error and exit process
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit with failure code
  }
};

// Export the connection function to be used in other parts of the application
module.exports = connectDB;