const mongoose = require('mongoose');

const deathAlertSchema = new mongoose.Schema({
    name: String,
    aadhaar: String,
    cardNumber: String,

    status: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DeathAlert', deathAlertSchema);