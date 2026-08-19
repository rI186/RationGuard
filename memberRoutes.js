const express = require('express');
const router = express.Router();

const Beneficiary = require('../models/Beneficiary');

// ✅ ADD MEMBER
router.post('/add', async (req, res) => {
    try {
        const { cardNumber, name, dob, gender, relation, aadhaar } = req.body;

        const user = await Beneficiary.findOne({ cardNumber });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null;

        user.members.push({
            name,
            age,
            relation,
            aadhaar
        });

        await user.save();

        res.json({ success: true });

    } catch (err) {
        console.error(err);

        // ✅ HANDLE DUPLICATE AADHAAR ERROR
        if (err.code === 11000) {
            return res.json({
                success: false,
                message: "Aadhaar already exists"
            });
        }

        res.json({ success: false, message: "Server error" });
    }
});

module.exports = router;