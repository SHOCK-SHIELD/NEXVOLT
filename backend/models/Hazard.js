const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({

    // Basic hazard information
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: [
            'exposed_wires',
            'fallen_power_line',
            'electrical_fire',
            'electric_shock',
            'damaged_equipment',
            'other'
        ]
    },

    // Location information
    location: {
        address: {
            type: String,
            default: ''
        },

        latitude: {
            type: Number
        },

        longitude: {
            type: Number
        }
    },

    // Uploaded images or videos
    media: [{
        url: String,
        publicId: String,
        resourceType: String
    }],

    // Person who reported the hazard
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Hazard report status
status: {
    type: String,
    enum: [
        'pending',
        'verified',
        'in_progress',
        'resolved',
        'rejected'
    ],
    default: 'pending'
},

// History of hazard status changes
statusHistory: [{
    status: {
        type: String,
        enum: [
            'pending',
            'verified',
            'in_progress',
            'resolved',
            'rejected'
        ]
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    message: {
        type: String,
        default: ''
    }
}]

},{timestamps: true});
module.exports = mongoose.model('Hazard', hazardSchema);