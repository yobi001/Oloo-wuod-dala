// server.js
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const connectToDb = require("./db");
const User = require("./models/User");

// Initialize
const app = express();
// This is key component to allow to cross origin request so that it communicate to the frontend*


app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true
}));


// Connect to MongoDB
connectToDb();

// --- ROUTES --- //

// ✅ Signup
app.post("/api/auth/signup", async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: "Signup successful!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Signup failed. Try again." });
    }
});

//  signin
app.post("/api/auth/signin", async(req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        res.json({ success: true, message: "signin successful!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "signin failed. Try again." });
    }
});

// --- Test Route ---
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Oloo Server API" });
});
//Stores data in the database
app.get("/api/players", async(req, res) => {
    const players = await db.collection("players").find().toArray();
    res.json(players);
});

app.post("/api/players", async(req, res) => {
    const { name, position } = req.body;
    await db.collection("players").insertOne({ name, position });
    res.json({ message: "Player added" });
});


// Start server

app.listen(3000, () => console.log(" Server running on port 3000"));