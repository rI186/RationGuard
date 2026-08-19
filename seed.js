const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Shopkeeper = require("./models/Shopkeeper");
const Beneficiary = require("./models/Beneficiary");

const seedData = async () => {
    try {
        await connectDB();

        // clear old data
        await Shopkeeper.deleteMany();
        await Beneficiary.deleteMany();

        // add shopkeeper
        await Shopkeeper.create({
            shopId: "MH-PUNE-0047",
            password: "shop@2026"
        });

        await Beneficiary.create({
            cardNumber: "MH-2201-Y",
            password: "anand@2026",
            name: "Anand Kharat",
            cardType: "Yellow (BPL)",
            shop: "MH-PUNE-0047",
            district: "Pune",

            members: [
                {
                    name: "Anand Kharat",
                    age: 45,
                    relation: "Head",
                    aadhaar: "111122223333",
                    status: "active"
                },
                {
                    name: "Meena Kharat",
                    age: 40,
                    relation: "Spouse",
                    aadhaar: "111122223334",
                    status: "active"
                },
                {
                    name: "Raj Kharat",
                    age: 18,
                    relation: "Son",
                    aadhaar: "111122223335",
                    status: "active"
                },
                {
                    name: "Priya Kharat",
                    age: 14,
                    relation: "Daughter",
                    aadhaar: "111122223336",
                    status: "active"
                },
                {
                    name: "Tai Kharat",
                    age: 72,
                    relation: "Mother",
                    aadhaar: "111122223337",
                    status: "active"
                }
            ],

            alerts: [], // 
            isBlocked: false
        });

        console.log("✅ Data Seeded Successfully");
        process.exit();

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedData();