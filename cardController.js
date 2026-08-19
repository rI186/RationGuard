const Beneficiary = require('../models/Beneficiary');

// ✅ GET cards by shop
exports.getCardsByShop = async (req, res) => {
    try {
        const cards = await Beneficiary.find({ shop: req.params.shopId });
        res.json({ success: true, cards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

// ✅ GET single card (MAIN FIX)
exports.getCardByNumber = async (req, res) => {
    try {
        const card = await Beneficiary.findOne({
            cardNumber: req.params.cardNumber
        });

        if (!card) {
            return res.status(404).json({ success: false, message: "Card not found" });
        }

        // optional filter (safe)
        const members = card.members.filter(m => m.status === "active");

        res.json({
            success: true,
            card: {
                ...card._doc,
                members
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

// ✅ ADD MEMBER (basic)
exports.addMember = async (req, res) => {
    try {
        const { cardNumber, name, dob, relation, aadhaar } = req.body;

        if (!cardNumber || !name || !dob || !relation || !aadhaar) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // find user
        const user = await Beneficiary.findOne({ cardNumber });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Card not found"
            });
        }

        // check duplicate Aadhaar inside same card
        const exists = user.members.find(m => m.aadhaar === aadhaar);

        if (exists) {
            return res.json({
                success: false,
                message: "Member with this Aadhaar already exists"
            });
        }

        // calculate age from dob
        const age = new Date().getFullYear() - new Date(dob).getFullYear();

        // add member
        user.members.push({
            name,
            age,
            relation,
            aadhaar,
            status: "active"
        });

        await user.save();

        res.json({
            success: true,
            message: "Member added successfully",
            members: user.members
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ✅ POLICY
exports.getPolicy = (req, res) => {
    res.json({
        success: true,
        policy: [
            { ageGroup: '0–5 years', rice: 1, wheat: 0.5 },
            { ageGroup: '6–12 years', rice: 2, wheat: 1 },
            { ageGroup: '13–18 years', rice: 3, wheat: 2 },
            { ageGroup: '19–60 years', rice: 5, wheat: 3 },
            { ageGroup: '61+ years', rice: 4, wheat: 2 }
        ]
    });
};