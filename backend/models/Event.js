const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    apiId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description available'
    },
    date: {
        type: Date,
        required: true
    },

    category: String,
    originalType: String,

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
    venue: {
        type: String,
        default: 'Unknown location'
    },
    category: {
        type: String,
        enum: ['cultural', 'sport', 'music', 'food', 'art', ''],
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);