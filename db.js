// db.js
const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/oloserver_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully...");
    } catch (error) {
        console.error(" MongoDB connection failed:", error);
    }
}
mongoose.connection.on("error", err => {
    console.error("MongoDB error:", err);
});

module.exports = connectToDb;