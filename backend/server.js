require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Add mongoose import
const connectDB = require('./config/database');
const cors = require('cors');
const fetchEvents = require('./jobs/fetchEvents');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Event = require('./models/Event');

// Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/auth', require('./routes/auth'));

// Initialize server function
const initializeServer = async () => {
  try {
    // First connect to database
    await connectDB();
    console.log('Database connected successfully');

    // Initialize events only after database connection is established
    try {
      console.log('Initializing events...');
      
      // Check if database is really connected before operations
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection not ready');
      }

      // Delete all existing events with timeout
      await Promise.race([
        Event.deleteMany({}),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Delete operation timed out')), 30000)
        )
      ]);
      console.log('Previous events cleared');

      // Fetch new events
      console.log('Fetching new events...');
      await fetchEvents();
      console.log('Events updated successfully');
    } catch (error) {
      console.error('Error during events initialization:', error);
      // Continue server startup even if event initialization fails
    }

    // Start HTTP Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      
      // Start the scheduler only after server is running
      require('./jobs/schedule');
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully.',
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Start the server
initializeServer();