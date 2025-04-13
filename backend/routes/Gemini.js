const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const multer = require("multer");
require('dotenv').config();

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyC7jSBWnP8zMq3qgndwbTM4nMH3hUTCyWM");

app.post('/medicine', upload.single('file'), async (req, res) => {
    const name = req.body.name

    if (name) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare" });

        const prompt = "tell me about this medicine named" + name + " and its uses and side effects and everything about it. Give a small note at the end to consult doctor medical advice.";
        const result = await model.generateContent(prompt);


        res.json({ description: result.response.text() });
    } else {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            const filePath = req.file.path;
            const mimeType = req.file.mimetype;

            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare" });
            const prompt = "Tell me about this medicine and its uses and side effects and everything about it. Give a small note at the end to consult doctor medical advice.";
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

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare" });
        const prompt = "Describe the medical prescription in the uploaded images and explain it and give detailed information on medicine and give suggestions or advice.";

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare" });

    const prompt = "Tell me about Drug Drug Interaction of these medicine" + medicines;
    const result = await model.generateContent(prompt);


    res.json({ description: result.response.text() });

});

app.post('/disease', async (req, res) => {
    const history = req.body.history
    const msg = req.body.msg



    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare", });

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

app.post('/summarize-symptoms', async (req, res) => {
    const chatHistory = req.body.chatHistory;

    if (!chatHistory || !Array.isArray(chatHistory)) {
        return res.status(400).json({ error: "Chat history is required and must be an array" });
    }

    try {
        // Extract all user messages
        const userMessages = chatHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.parts[0].text)
            .join("\n");

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: "Only talk about medical and healthcare" });

        const prompt = `Based on the following patient's conversation, summarize their key symptoms and health concerns in a clear, concise paragraph that would help a doctor understand their condition. Focus only on medical information and symptoms:\n\n${userMessages}`;

        const result = await model.generateContent(prompt);

        res.json({
            summary: result.response.text(),
            status: "success"
        });
    } catch (error) {
        console.error("Error summarizing symptoms:", error);
        res.status(500).json({ error: error.message });
    }
});

// New endpoint that uses LangChain-like semantic matching for symptoms to specialist mapping
app.post('/analyze-symptoms', async (req, res) => {
    const symptoms = req.body.symptoms;

    if (!symptoms || typeof symptoms !== 'string') {
        return res.status(400).json({ error: "Symptoms description is required" });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: "You are a medical specialist classifier. Your task is to determine which medical specialists would be most appropriate for a patient based on their symptoms."
        });

        // Create a structured prompt with the available categories
        const prompt = `
As a medical expert, analyze the following patient's symptoms and determine which medical specialists would be most appropriate for consultation.

Patient symptoms: "${symptoms}"

Available specialist categories:
- AYUSHHomoeopath (For homeopathic treatment, alternative medicine, natural remedies)
- Cosmetic_Aesthetic_Dentist (For teeth whitening, braces, smile correction)
- Dental_Surgeon (For tooth extractions, root canals, dental surgery)
- Dentist (For routine dental care, cavities)
- General_Physician (For common illnesses, fever, cough, general health issues)
- Gynecologist (For women's reproductive health, menstrual issues, PCOS)
- Obstetrician (For pregnancy care, childbirth, prenatal/postnatal care)
- Orthopedic_surgeon (For bone and joint issues, fractures, arthritis)
- Dermatologist (For skin conditions, hair and nail problems)
- Periodontist (For gum disease, gum health)
- Sexologist (For sexual health issues, fertility concerns)

Analyze the symptoms carefully and return a JSON object with ONLY the following structure:
{
  "categories": ["Category1", "Category2"],
  "reasoning": "Brief explanation of why these specialists are recommended"
}

List the categories in order of relevance (most relevant first). Include 1-3 categories that best match the symptoms.
`;

        const result = await model.generateContent(prompt);
        const resultText = result.response.text();

        try {
            // Parse the JSON response
            const jsonStart = resultText.indexOf('{');
            const jsonEnd = resultText.lastIndexOf('}') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonStr = resultText.substring(jsonStart, jsonEnd);
                const parsedResult = JSON.parse(jsonStr);

                // Validate the response format
                if (Array.isArray(parsedResult.categories) && parsedResult.categories.length > 0) {
                    return res.json(parsedResult);
                }
            }

            throw new Error("Invalid response format");
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);

            // Fallback: extract categories with regex if JSON parsing fails
            const categoryMatches = resultText.match(/["']categories["']\s*:\s*\[\s*["']([^"']+)["']/);
            if (categoryMatches && categoryMatches[1]) {
                const mainCategory = categoryMatches[1];
                return res.json({
                    categories: [mainCategory],
                    reasoning: "Extracted from response (fallback method)"
                });
            }

            throw new Error("Could not extract categories from response");
        }
    } catch (error) {
        console.error("Error analyzing symptoms:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;