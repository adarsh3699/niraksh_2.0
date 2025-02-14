import React, { memo } from "react";

import "../styles/diseaseSearch.css";

const DiseaseSearch = () => {
	return (
		<div id="DiseaseSearch">
			<div class="container">
				<div class="chat-card">
					<div class="chat-header">
						<h1><i class="fas fa-heartbeat"></i> Smart Health System</h1>
						<p>Describe your symptoms to get precautions and advice</p>
					</div>
					<div class="chat-content" id="chatContent">
						<div class="message system">
							Welcome to the Smart Health System. Please describe your symptoms, and I'll provide some precautions and advice. Remember, this is not a substitute for professional medical advice.
						</div>
					</div>
					<div class="chat-footer">
						<form class="chat-form" id="chatForm">
							<input type="text" placeholder="Describe your symptoms..." class="chat-input" id="userInput" />
							<button type="submit" class="chat-button">submit<i class="fas fa-paper-plane"></i></button>
						</form>
					</div>
					<div class="quick-actions">
						<button class="quick-action-btn" data-symptom="Headache">Headache</button>
						<button class="quick-action-btn" data-symptom="Fever">Fever</button>
						<button class="quick-action-btn" data-symptom="Cough">Cough</button>
						<button class="quick-action-btn" data-symptom="Fatigue">Fatigue</button>
					</div>
				</div>
			</div>
			{/* Add your component code here */}
		</div>
	);
};

export default memo(DiseaseSearch);
