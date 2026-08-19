const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema({
    shopId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);