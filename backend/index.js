const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const axios = require('axios');
const multer = require("multer");

const { getMongoDb } = require("./utils");

const UserReg = require("./routes/UserReg");
const { log } = require("console");


const allowlist = [
    'https://comparison.bhemu.me/',
    'http://localhost:3000/',
    'http://localhost:3001/',
    'https://price-comparison-web.vercel.app/',
    'http://localhost:5173/'
];

const app = express();

app.use(cors(allowlist));
app.use(express.json());

app.use("/user", UserReg);
// app.use("/gemini", Ais);

const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
    res.send("Hello World");
});


// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

const genAI = new GoogleGenerativeAI("AIzaSyC7jSBWnP8zMq3qgndwbTM4nMH3hUTCyWM");

app.post('/medicine', upload.single('file'), async (req, res) => {
    const name = req.body.name

    if (name) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "tell me about this medicine named" + name;
        const result = await model.generateContent(prompt);


        res.json({ description: result.response.text() });
    } else {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filePath = req.file.path;
            const mimeType = req.file.mimetype;

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = "Describe about this medicine. format must be write the only name of the medicine in first line like '_name_' and then tell me all about that medicine";
            const filePart = fileToGenerativePart(filePath, mimeType);

            const result = await model.generateContent([prompt, filePart]);

            res.json({ description: result.response.text() });

            // Cleanup: Delete uploaded file after processing
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
});


app.post('/prescription', upload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Describe the prescription in the uploaded images.";

        // Convert files to generative parts
        const imageParts = req.files.map(file => fileToGenerativePart(file.path, file.mimetype));

        // Generate content with multiple files
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        // Cleanup: Delete uploaded files after processing
        req.files.forEach(file => fs.unlinkSync(file.path));

        res.json({ description: text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/drug-interaction', upload.single('file'), async (req, res) => {
    const medicines = req.body.medicines?.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Tell me about Drug Drug Interaction of these medicine" + medicines;
    const result = await model.generateContent(prompt);


    res.json({ description: result.response.text() });

});


app.post('/disease', async (req, res) => {
    const history = req.body.history
    const msg = req.body.msg



    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Great to meet you. What would you like to know?" }],
                },
            ],
        });



        let result = await chat.sendMessage(msg);

        console.log(result.response.text());

        res.json({ description: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
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