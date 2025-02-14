const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const axios = require('axios');



const port = 4000;
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyC7jSBWnP8zMq3qgndwbTM4nMH3hUTCyWM");

app.post('/medicine', async (req, res) => {
	const name = req.body.name

	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	const prompt = "tell me about" + name;
	const result = await model.generateContent(prompt);
	const response = result.response

	res.send(response.text());
});

app.get('/describe', async (req, res) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	function fileToGenerativePart(path, mimeType) {
		return {
			inlineData: {
				data: Buffer.from(fs.readFileSync(path)).toString("base64"),
				mimeType,
			},
		};
	}

	const prompt = "Describe This Image";
	const imagePart = fileToGenerativePart("/path/to/image.png", "image/png");

	const result = await model.generateContent([prompt, imagePart]);

	res.send(result.response.text());

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