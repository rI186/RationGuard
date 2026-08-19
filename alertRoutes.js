const express = require('express');
const router = express.Router();

const {
    submitAlert,
    getAllAlerts,
    getAlertsByCard,
    verifyAlert,
    getAlertById
} = require('../controllers/alertController');

router.post('/submit', submitAlert);
router.post('/verify', verifyAlert);

router.get('/all', getAllAlerts);
router.get('/id/:id', getAlertById);
router.get('/card/:cardNumber', getAlertsByCard);

module.exports = router;