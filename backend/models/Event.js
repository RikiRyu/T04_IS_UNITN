const mongoose = require('mongoose');

/**
 * Schema for events in Trento
 * Defines the structure and validation rules for event documents
 */
const eventSchema = new mongoose.Schema({
    // Unique identifier from the Trento API
    apiId: {
        type: String,
        required: true,
        unique: true  // Ensures no duplicate events
    },
    // Event title
    title: {
        type: String,
        required: true
    },
    // Event description with default value
    description: {
        type: String,
        default: 'No description available'
    },
    // Event date and time
    date: {
        type: Date,
        required: true
    },
    // Geographic coordinates for map placement
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    // Physical location name
    venue: {
        type: String,
        default: 'Unknown location'
    },
    // Categorization of the event
    category: {
        type: String,
        enum: ['cultural', 'sport', 'music', 'food', 'art', ''], // Restricted to these values
        default: ''
    },
    // Original event type in Italian
    originalType: String
}, { 
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Event', eventSchema);