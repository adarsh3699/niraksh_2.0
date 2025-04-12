import { useState, useEffect, useRef } from "react";
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

const initialMessage = {
	role: "model",
	parts: [
		{
			text: "Ask any doubt regrading your health, and I'll provide some precautions and advice. Remember, this is not a substitute for professional medical advice.",
		},
	],
};

const DiseaseSearch = () => {
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem("healthAssistantChat");
		return savedMessages ? JSON.parse(savedMessages) : [initialMessage];
	});
	const [userInput, setUserInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const chatContentRef = useRef(null);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("healthAssistantChat", JSON.stringify(messages));
		// Scroll to the bottom when messages change
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUserInput("");

		if (!userInput.trim()) return;

		const newMessage = { role: "user", parts: [{ text: userInput }] };

		// Update UI immediately
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setIsLoading(true);

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
			const errorMessage = {
				role: "model",
				parts: [{ text: "Sorry, I encountered an error. Please try again later." }],
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setIsLoading(false);
		}

		setUserInput("");
	};

	const handleQuickAction = (symptom) => {
		setUserInput(symptom);
	};

	const startNewChat = () => {
		if (window.confirm("Are you sure you want to start a new chat? This will clear your current conversation.")) {
			setMessages([initialMessage]);
		}
	};

	return (
		<div id="DiseaseSearch">
			<div className="chat-header">
				<img src={stethoscope} alt="" height="30" />
				<h1>Smart Healthcare Assistant</h1>
				<button className="new-chat-btn" onClick={startNewChat}>
					New Chat
				</button>
			</div>
			<div className="chat-content" id="chatContent" ref={chatContentRef}>
				{messages.map((msg, index) => (
					<ReactMarkdown key={index} className={`message ${msg.role}`}>
						{msg.parts[0].text}
					</ReactMarkdown>
				))}
				{isLoading && (
					<div className="message model loading">
						<div className="typing-indicator">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				)}
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
					disabled={isLoading}
				/>
				<button type="submit" className="chat-button" disabled={isLoading}>
					Submit <i className="fas fa-paper-plane"></i>
				</button>
			</form>

			<div className="quick-actions">
				{symptoms.map((symptom) => (
					<button
						key={symptom.name}
						className="quick-action-btn"
						onClick={() => handleQuickAction(symptom.name)}
						disabled={isLoading}
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
