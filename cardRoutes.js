const express = require('express');
const router = express.Router();

const {
    getCardsByShop,
    getCardByNumber,
    addMember,
    getPolicy
} = require('../controllers/cardController');

// ✅ GET policy
router.get('/policy', getPolicy);

// ✅ GET single card (for members display)
router.get('/card/:cardNumber', getCardByNumber);

// ✅ GET cards by shop
router.get('/shop/:shopId', getCardsByShop);

// ✅ ADD member
router.post('/members/add', addMember);

module.exports = router;