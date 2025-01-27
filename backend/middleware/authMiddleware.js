const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({ 
              error: 'Authentication required' 
          });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
          return res.status(404).json({ 
              error: 'User not found' 
          });
      }

      req.user = user;
      next();
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ 
              error: 'Token expired' 
          });
      }
      res.status(401).json({ 
          error: 'Invalid token' 
      });
  }
};

module.exports = authMiddleware;