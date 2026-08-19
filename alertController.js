const Beneficiary = require('../models/Beneficiary');
const DeathAlert = require('../models/DeathAlert');

// SUBMIT ALERT (store in DeathAlert collection)
exports.submitAlert = async (req, res) => {
    try {
        const { name, aadhaar, cardNumber } = req.body;

        if (!name || !aadhaar || !cardNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // optional: prevent duplicate pending alerts
        const existing = await DeathAlert.findOne({
            aadhaar,
            cardNumber,
            status: "pending"
        });

        if (existing) {
            return res.json({
                success: false,
                message: "Alert already exists"
            });
        }

        const alert = new DeathAlert({
            name,
            aadhaar,
            cardNumber,
            status: "pending"
        });

        await alert.save();

        res.json({
            success: true,
            message: "Alert submitted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALL ALERTS (for SK dashboard)
exports.getAllAlerts = async (req, res) => {
    try {
        const alerts = await DeathAlert.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            alerts
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// VERIFY ALERT (SK action)
exports.verifyAlert = async (req, res) => {
    try {
        const { alertId } = req.body;

        const alert = await DeathAlert.findById(alertId);
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        // ❌ already verified
        if (alert.status === "verified") {
            return res.json({
                success: false,
                message: "Already verified"
            });
        }

        const user = await Beneficiary.findOne({
            cardNumber: alert.cardNumber
        });

        if (!user) {
            return res.json({
                success: false,
                message: "No beneficiary found"
            });
        }

        // 🚫 STOP if card already blocked
        if (user.isBlocked) {
            return res.json({
                success: false,
                message: "Card already blocked"
            });
        }

        // ✅ match Aadhaar
        const member = user.members.find(
            m => m.aadhaar === alert.aadhaar
        );

        if (!member) {
            return res.json({
                success: false,
                message: "No matching member"
            });
        }

        // ✅ ensure alerts array
        if (!user.alerts) user.alerts = [];

        let person = user.alerts.find(
            a => a.aadhaar === alert.aadhaar
        );

        // ✅ FIRST TIME
        if (!person) {
            person = {
                alertId: alert._id,
                name: member.name,
                aadhaar: alert.aadhaar,
                count: 1,
                lastSentAt: new Date()
            };
            user.alerts.push(person);

        } else {
            // ❌ prevent duplicate click spam
            if (alert.status === "verified") {
                return res.json({
                    success: false,
                    message: "Already verified"
                });
            }

            person.count += 1;
            person.lastSentAt = new Date();
        }

        // 🚫 block after 3 alerts (per member)
        if (person.count >= 3) {
            user.isBlocked = true;
        }

        await user.save();

        // ✅ mark alert verified
        alert.status = "verified";
        await alert.save();

        res.json({
            success: true,
            message: "Verified and alert started",
            count: person.count
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALERTS BY CARD (for user dashboard)
exports.getAlertsByCard = async (req, res) => {
    try {
        const user = await Beneficiary.findOne({
            cardNumber: req.params.cardNumber
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            alerts: user.alerts || [],
            isBlocked: user.isBlocked || false
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.getAlertById = async (req, res) => {
    try {
        const alert = await DeathAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        // 🔥 find beneficiary
        const user = await Beneficiary.findOne({
            cardNumber: alert.cardNumber
        });

        let extra = {};

        if (user && user.alerts) {
            const person = user.alerts.find(
                a => a.aadhaar === alert.aadhaar
            );

            if (person) {
                extra = {
                    count: person.count,
                    lastSentAt: person.lastSentAt
                };
            }
        }

        res.json({
            success: true,
            alert: {
                ...alert.toObject(),
                ...extra   // ✅ merge here
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};