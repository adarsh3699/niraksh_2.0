import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { apiCall } from "../utils";
import "../styles/diseaseSearch.css";

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
			<div className="container">
				<div className="chat-card">
					<div className="chat-header">
						<h1>
							<i className="fas fa-heartbeat"></i> Smart Healthcare Assistant
						</h1>
						<p>Describe your symptoms to get precautions and advice</p>
					</div>
					<div className="chat-content" id="chatContent">
						{messages.map((msg, index) => (
							<ReactMarkdown key={index} className={`message ${msg.role}`}>
								{msg.parts[0].text}
							</ReactMarkdown>
						))}
					</div>
					<div className="chat-footer">
						<form className="chat-form" onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Describe your symptoms..."
								className="chat-input"
								name="userInput"
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
							/>
							<button type="submit" className="chat-button">
								Submit <i className="fas fa-paper-plane"></i>
							</button>
						</form>
					</div>
					<div className="quick-actions">
						{["Headache", "Fever", "Cough", "Fatigue"].map((symptom) => (
							<button
								key={symptom}
								className="quick-action-btn"
								onClick={() => handleQuickAction(symptom)}
							>
								{symptom}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiseaseSearch;
