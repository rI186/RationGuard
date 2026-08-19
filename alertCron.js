const cron = require('node-cron');
const Beneficiary = require('../models/Beneficiary');

cron.schedule('0 0 */6 * *', async () => {
    console.log("Running 6-day alert job...");

    const users = await Beneficiary.find({});

    for (let user of users) {

        // ❌ skip blocked
        if (user.isBlocked) continue;

        for (let person of user.alerts) {

            // ❌ skip max reached
            if (person.count >= 3) continue;

            const last = new Date(person.lastSentAt);
            const now = new Date();

            const diffSeconds = (now - last) / 1000;

            if (diffSeconds >= 10) {
                
                person.count += 1;
                person.lastSentAt = new Date();

                console.log(`Alert sent to ${person.name}, count: ${person.count}`);

                // 🚫 block if limit reached
                if (person.count >= 3) {
                    user.isBlocked = true;
                    console.log("Card BLOCKED");
                }
            }
        }

        await user.save();
    }
});