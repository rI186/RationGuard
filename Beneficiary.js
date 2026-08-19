const mongoose = require('mongoose');

// MEMBER SCHEMA
const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: Number,
    relation: String,

    aadhaar: {
        type: String,
        required: true,
        match: [/^\d{12}$/, "Invalid Aadhaar number"]
    },

    status: {
        type: String,
        enum: ["active", "removed"],
        default: "active"
    }
});

// ALERT SCHEMA
const alertSchema = new mongoose.Schema({
    name: String,
    aadhaar: String,

    count: {
        type: Number,
        default: 1
    },

    status: {
        type: String,
        enum: ["pending", "verified", "resolved"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    lastSentAt: {
        type: Date,
        default: Date.now
    }
});

// MAIN SCHEMA
const userSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true
    },

    password: String,
    name: String,
    cardType: String,
    shop: String,
    district: String,

    members: [memberSchema],
    alerts: [alertSchema],

    isBlocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Beneficiary', userSchema);