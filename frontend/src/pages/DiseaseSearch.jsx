import { useState } from "react";

import { apiCall } from "../utils";
import "../styles/diseaseSearch.css";

const DiseaseSearch = () => {
	const [messages, setMessages] = useState([
		{
			role: "system",
			text: "Welcome to the Smart Health System. Please describe your symptoms, and I'll provide some precautions and advice. Remember, this is not a substitute for professional medical advice.",
		},
	]);
	const [userInput, setUserInput] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!userInput.trim()) return;

		const newMessage = { role: "user", text: userInput };

		// Update UI immediately
		setMessages((prevMessages) => [...prevMessages, newMessage]);

		try {
			const response = await apiCall("ai/disease", "POST", {
				history: messages,
				msg: userInput,
			});

			const botMessage = { role: "bot", text: response?.data.description };
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
							<i className="fas fa-heartbeat"></i> Smart Health System
						</h1>
						<p>Describe your symptoms to get precautions and advice</p>
					</div>
					<div className="chat-content" id="chatContent">
						{messages.map((msg, index) => (
							<div key={index} className={`message ${msg.role}`}>
								{msg.text}
							</div>
						))}
					</div>
					<div className="chat-footer">
						<form className="chat-form" onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Describe your symptoms..."
								className="chat-input"
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
