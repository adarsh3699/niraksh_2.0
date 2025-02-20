import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { apiCall } from "../utils";

import stethoscope from "../assets/icons/stethoscope.svg";
import "../styles/diseaseSearch.css";

const symptoms = [
	{ name: "Headache", icon: "🤕 " },
	{ name: "Fever", icon: "🤒 " },
	{ name: "Cough", icon: "😷 " },
	{ name: "Fatigue", icon: "😴 " },
	{ name: "Sore Throat", icon: "🤧 " },
	{ name: "Nausea", icon: "🤢 " },
];

const DiseaseSearch = () => {
	const [messages, setMessages] = useState([
		{
			role: "model",
			parts: [
				{
					text: "Ask any doubt regrading your health, and I'll provide some precautions and advice. Remember, this is not a substitute for professional medical advice.",
				},
			],
		},
	]);
	const [userInput, setUserInput] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUserInput("");

		if (!userInput.trim()) return;

		const newMessage = { role: "user", parts: [{ text: userInput }] };

		// Update UI immediately
		setMessages((prevMessages) => [...prevMessages, newMessage]);

		try {
			const response = await apiCall("ai/disease", "POST", {
				history: messages,
				msg: userInput,
			});

			console.log(response);

			const botMessage = { role: "model", parts: [{ text: response?.data.description }] };
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (error) {
			console.error("Error:", error);
		}

		setUserInput("");
	};

	const handleQuickAction = (symptom) => {
		setUserInput(symptom);
	};

	return (
		<div id="DiseaseSearch">
			<div className="chat-header">
				<img src={stethoscope} alt="" height="30" />
				<h1>Smart Healthcare Assistant</h1>
				{/* <p>Describe your symptoms to get precautions and advice</p> */}
			</div>
			<div className="chat-content" id="chatContent">
				{messages.map((msg, index) => (
					<ReactMarkdown key={index} className={`message ${msg.role}`}>
						{msg.parts[0].text}
					</ReactMarkdown>
				))}
			</div>

			<form className="chat-form" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Describe your symptoms..."
					className="chat-input"
					name="userInput"
					value={userInput}
					autoComplete="off"
					onChange={(e) => setUserInput(e.target.value)}
				/>
				<button type="submit" className="chat-button">
					Submit <i className="fas fa-paper-plane"></i>
				</button>
			</form>

			<div className="quick-actions">
				{symptoms.map((symptom) => (
					<button
						key={symptom.name}
						className="quick-action-btn"
						onClick={() => handleQuickAction(symptom.name)}
					>
						<span>{symptom.icon}</span>
						{symptom.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default DiseaseSearch;
