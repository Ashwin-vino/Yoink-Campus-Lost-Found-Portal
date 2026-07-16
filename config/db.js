const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once("open", resolve);
            mongoose.connection.once("error", reject);
        });
    }

    try {
        cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
            socketTimeoutMS: 45000
        });

        console.log("✅ MongoDB Connected");
        return cachedConnection;
    } catch (error) {
        console.error("❌ Database Error:", error.message);
        return null;
    }
};

module.exports = connectDB;