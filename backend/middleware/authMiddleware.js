// Import required dependencies
const jwt = require('jsonwebtoken');     // JSON Web Token library for token handling
const User = require('../models/User');  // User model for database queries

/**
 * Middleware for verifying JWT authentication tokens
 * Protects routes by ensuring valid authentication before access
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Format: "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }

    // Verify token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token, excluding password field
    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists in database
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Attach user object to request for use in subsequent middleware/routes
    req.user = user;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle specific case of expired tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired' 
      });
    }
    
    // Handle all other token verification errors
    res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
};

// Export middleware for use in other parts of the application
module.exports = authMiddleware;