const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const { getMongoDb } = require("./utils");
const { authenticateUser, optionalAuth } = require("./middleware/auth");

const UserReg = require("./routes/UserReg");
const Gemini = require("./routes/Gemini");


const allowlist = [
    'https://niraksh.bhemu.me/',
    'https://niraksh-20.vercel.app/',
    'http://localhost:3000/',
    'http://localhost:5173/'
];

const app = express();

app.use(cors(allowlist));
app.use(express.json());

// Public routes (no authentication required)
app.use("/user", UserReg);

// Protected routes (authentication required)
app.use("/ai", authenticateUser, Gemini);

const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
    res.send("Hello World");
});

// Test auth middleware route
app.get("/auth-test", authenticateUser, (req, res) => {
    res.json({
        statusCode: 200,
        msg: "You are authenticated!",
        user: req.user
    });
});

mongoose
    .connect(getMongoDb()) // No options are required for modern versions
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    )
    .catch((err) => {
        console.log(err);
    });