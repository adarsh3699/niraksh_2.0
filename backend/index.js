const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const axios = require('axios');
const multer = require("multer");
const cors = require('cors');

const allowlist = [
	'https://comparison.bhemu.me/',
	'http://localhost:3000/',
	'http://localhost:3001/',
	'https://price-comparison-web.vercel.app/',
	'http://localhost:5173/'
];



const port = 4000;
const app = express();

app.use(express.json());
app.use(cors(allowlist));

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

app.post('/medicine', async (req, res) => {
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



app.get('/adarsh', async (req, res) => {
	// import { GoogleGenerativeAI } from "@google/generative-ai";
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

	let result = await chat.sendMessage("I have 2 dogs in my house.");
	console.log(result.response.text());
	let result2 = await chat.sendMessage("How many paws are in my house?");
	console.log(result2.response.text());


	res.send('Hello, Adarsh');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});