import React, { memo } from "react";

import "../styles/diseaseSearch.css";

const DiseaseSearch = () => {

	return (
		<div id="DiseaseSearch">
			<div className="container">
				<div className="chat-card">
					<div className="chat-header">
						<h1><i className="fas fa-heartbeat"></i> Smart Health System</h1>
						<p>Describe your symptoms to get precautions and advice</p>
					</div>
					<div className="chat-content" id="chatContent">
						<div className="message system">
							Welcome to the Smart Health System. Please describe your symptoms, and I'll provide some precautions and advice. Remember, this is not a substitute for professional medical advice.
						</div>
					</div>
					<div className="chat-footer">
						<form className="chat-form" id="chatForm">
							<input type="text" placeholder="Describe your symptoms..." className="chat-input" id="userInput" />
							<button type="submit" className="chat-button">submit<i className="fas fa-paper-plane"></i></button>
						</form>
					</div>
					<div className="quick-actions">
						<button className="quick-action-btn" data-symptom="Headache">Headache</button>
						<button className="quick-action-btn" data-symptom="Fever">Fever</button>
						<button className="quick-action-btn" data-symptom="Cough">Cough</button>
						<button className="quick-action-btn" data-symptom="Fatigue">Fatigue</button>
					</div>
				</div>
			</div>
			{/* Add your component code here */}
		</div>
	);
};

export default memo(DiseaseSearch);
