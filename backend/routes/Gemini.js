const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const multer = require("multer");

const app = express();


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

        const prompt = "tell me about" + name;
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
            const prompt = "Describe about this medicine.";
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
        const prompt = "Describe the medical prescription in the uploaded images and give detailed information of medicine and suggestions.";

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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: "Only talk about medical and healthcare", });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Tell me only about healthcare. if any question outside dont answer it." }],
                }, ...history]
            ,
        });

        let result = await chat.sendMessage(msg);

        res.json({ description: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = app;