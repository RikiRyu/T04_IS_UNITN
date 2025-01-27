const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Schema for user accounts
 * Includes authentication and event tracking functionality
 */
const UserSchema = new mongoose.Schema({
    // User's email address (used for login)
    email: { 
        type: String, 
        required: true, 
        unique: true  // Prevents duplicate accounts
    },
    // Hashed password
    password: { 
        type: String, 
        required: true 
    },
    // User subscription status
    role: { 
        type: String, 
        enum: ['free', 'subscribed'],  // Restricted to these values
        default: 'free' 
    },
    // Array of references to saved events
    savedEvents: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event'  // References the Event model
    }],
});

/**
 * Pre-save middleware to hash passwords
 * Only hashes the password if it has been modified
 */
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);  // Generate salt with 12 rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);