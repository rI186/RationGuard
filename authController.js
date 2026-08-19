const Shopkeeper = require("../models/Shopkeeper");
const Beneficiary = require("../models/Beneficiary");

// 🔐 SHOPKEEPER LOGIN (MongoDB)
exports.shopLogin = async (req, res) => {
    const { shopId, password } = req.body;

    try {
        const shop = await Shopkeeper.findOne({ shopId, password });

        if (!shop) {
            return res.status(401).json({
                success: false,
                message: "Invalid Shop ID or Password"
            });
        }

        res.json({
            success: true,
            shop: {
                shopId: shop.shopId
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// 👤 BENEFICIARY LOGIN (MongoDB)
exports.beneficiaryLogin = async (req, res) => {
    const { cardNumber, password } = req.body;

    try {
        const user = await Beneficiary.findOne({ cardNumber, password });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Incorrect card number or password"
            });
        }

        res.json({
            success: true,
            user: {
                cardNumber: user.cardNumber,
                name: user.name,
                cardType: user.cardType,
                shop: user.shop,
                district: user.district,
                alertCount: user.alertCount,
                isBlocked: user.isBlocked,
                members: user.members // ✅ IMPORTANT
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};