const express = require('express');
const router = express.Router();
const { shopLogin, beneficiaryLogin } = require('../controllers/authController');

// ✅ Shopkeeper Login
router.post('/shopkeeper', shopLogin);

// ✅ Beneficiary Login
router.post('/beneficiary', beneficiaryLogin);

module.exports = router;