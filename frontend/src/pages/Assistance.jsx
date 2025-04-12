import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

import { apiCall } from "../utils";

import stethoscope from "../assets/icons/stethoscope.svg";
import "../styles/assistance.css";

const symptoms = [
	{ name: "Headache", icon: "🤕" },
	{ name: "Fever", icon: "🤒" },
	{ name: "Cough", icon: "😷" },
	{ name: "Fatigue", icon: "😴" },
	{ name: "Sore Throat", icon: "🤧" },
	{ name: "Nausea", icon: "🤢" },
	{ name: "Body Pain", icon: "🩹" },
];

const initialMessage = {
	role: "model",
	parts: [
		{
			text: "👋 Hello! I'm your Smart Healthcare Assistant. How can I help you today? Feel free to describe your symptoms or health concerns, and I'll provide some guidance and precautions.\n\n*Remember, this is not a substitute for professional medical advice.*",
		},
	],
};

const AssistancePage = () => {
	const navigate = useNavigate();
	const [messages, setMessages] = useState(() => {
		const savedMessages = localStorage.getItem("healthAssistantChat");
		return savedMessages ? JSON.parse(savedMessages) : [initialMessage];
	});
	const [userInput, setUserInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
	const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
	const chatContentRef = useRef(null);
	const inputRef = useRef(null);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("healthAssistantChat", JSON.stringify(messages));
		scrollToBottom();
	}, [messages]);

	// Check if scroll is at bottom
	useEffect(() => {
		const chatContent = chatContentRef.current;

		const handleScroll = () => {
			if (!chatContent) return;

			const isScrolledUp = chatContent.scrollHeight - chatContent.scrollTop > chatContent.clientHeight + 100;
			setShowScrollDownBtn(isScrolledUp);
		};

		if (chatContent) {
			chatContent.addEventListener("scroll", handleScroll);
			return () => chatContent.removeEventListener("scroll", handleScroll);
		}
	}, []);

	const scrollToBottom = () => {
		if (chatContentRef.current) {
			chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
			setShowScrollDownBtn(false);
		}
	};

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

			const botMessage = { role: "model", parts: [{ text: response?.data.description }] };
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (error) {
			console.error("Error:", error);
			const errorMessage = {
				role: "model",
				parts: [{ text: "❌ Sorry, I encountered an error. Please try again later." }],
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setIsLoading(false);
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	};

	const handleQuickAction = (symptom) => {
		setUserInput((prev) => (prev ? `${prev}, ${symptom}` : symptom));
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const startNewChat = () => {
		if (window.confirm("Are you sure you want to start a new chat? This will clear your current conversation.")) {
			setMessages([initialMessage]);
		}
	};

	const navigateToDoctorSuggest = async () => {
		if (messages.length <= 1) {
			alert("Please have a conversation about your symptoms first before getting doctor recommendations.");
			return;
		}

		try {
			setIsGeneratingSummary(true);

			// Call the new API endpoint to summarize symptoms
			const response = await apiCall("ai/summarize-symptoms", "POST", {
				chatHistory: messages,
			});

			if (response?.data?.summary) {
				// Save the summary in sessionStorage
				sessionStorage.setItem("symptomSummary", response.data.summary);

				// Navigate to doctor suggest page
				navigate("/doctor_suggest");
			} else {
				throw new Error("Failed to summarize symptoms");
			}
		} catch (error) {
			console.error("Error generating symptom summary:", error);
			alert("Sorry, there was an error analyzing your symptoms. Please try again.");
		} finally {
			setIsGeneratingSummary(false);
		}
	};

	return (
		<div id="assistancePage">
			<div className="chat-header">
				<div className="header-left">
					<img src={stethoscope} alt="" height="30" />
					<h1>Smart Healthcare Assistant</h1>
				</div>
				<div className="header-buttons">
					<button className="new-chat-btn" onClick={startNewChat} title="Start a new conversation">
						<span>🔄</span> New Chat
					</button>
					<button
						className="doctor-recommend-btn"
						onClick={navigateToDoctorSuggest}
						disabled={isGeneratingSummary || isLoading || messages.length <= 1}
						title="Get doctor recommendations based on your symptoms"
					>
						{isGeneratingSummary ? (
							<>
								<span className="loading-spinner"></span> Analyzing...
							</>
						) : (
							<>
								<span>👨‍⚕️</span> Find Doctors
							</>
						)}
					</button>
				</div>
			</div>

			<div className="chat-container">
				<div className="chat-content" id="chatContent" ref={chatContentRef}>
					{messages.map((msg, index) => (
						<div key={index} className={`message-container ${msg.role}`}>
							{msg.role === "model" && <div className="avatar assistant-avatar">🩺</div>}
							<ReactMarkdown className={`message ${msg.role}`}>{msg.parts[0].text}</ReactMarkdown>
							{msg.role === "user" && <div className="avatar user-avatar">👤</div>}
						</div>
					))}

					{isLoading && (
						<div className="message-container model">
							<div className="avatar assistant-avatar">🩺</div>
							<div className="message model loading">
								<div className="typing-indicator">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					)}

					{showScrollDownBtn && (
						<button
							className="scroll-to-bottom-btn"
							onClick={scrollToBottom}
							title="Scroll to latest messages"
						>
							↓
						</button>
					)}
				</div>

				<div className="chat-footer">
					<form className="chat-form" onSubmit={handleSubmit}>
						<input
							ref={inputRef}
							type="text"
							placeholder="Describe your symptoms or ask a health question..."
							className="chat-input"
							name="userInput"
							value={userInput}
							autoComplete="off"
							onChange={(e) => setUserInput(e.target.value)}
							disabled={isLoading || isGeneratingSummary}
						/>
						<button
							type="submit"
							className="chat-button"
							disabled={isLoading || isGeneratingSummary || !userInput.trim()}
							title="Send message"
						>
							{isLoading ? <span className="loading-spinner small"></span> : "Send"}
						</button>
					</form>

					<div className="quick-actions">
						<div className="quick-actions-label">Common symptoms:</div>
						<div className="quick-actions-buttons">
							{symptoms.map((symptom) => (
								<button
									key={symptom.name}
									className="quick-action-btn"
									onClick={() => handleQuickAction(symptom.name)}
									disabled={isLoading || isGeneratingSummary}
									title={`Add "${symptom.name}" to your message`}
								>
									<span className="symptom-icon">{symptom.icon}</span>
									<span className="symptom-name">{symptom.name}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssistancePage;
