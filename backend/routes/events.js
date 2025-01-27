const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Save event
router.post('/save/:eventId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log('User found:', user);
    console.log('Event ID to save:', req.params.eventId);

    if (!user.savedEvents.includes(req.params.eventId)) {
      user.savedEvents.push(req.params.eventId);
      await user.save();
      console.log('Updated user:', user);
    }
    res.json({ message: 'Event saved successfully', savedEvents: user.savedEvents });
  } catch (error) {
    console.error('Failed to save event:', error);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

// Unsave event
router.delete('/save/:eventId', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { savedEvents: req.params.eventId }
    });
    res.json({ message: 'Event removed from saved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove event' });
  }
});

// Get saved events
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('savedEvents');
    console.log('Found user:', user);
    console.log('Saved events:', user.savedEvents);
    res.json(user.savedEvents);
  } catch (error) {
    console.error('Failed to fetch saved events:', error);
    res.status(500).json({ error: 'Failed to fetch saved events' });
  }
});

module.exports = router;