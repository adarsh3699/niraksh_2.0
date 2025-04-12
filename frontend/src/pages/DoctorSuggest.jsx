import { useState, useEffect } from "react";

import symptomsToCategory from "../../jsonData/symptoms_to_category.json";

import AYUSHHomoeopath from "../../jsonData/AYUSHHomoeopath.json";
import Cosmetic_Aesthetic_Dentist from "../../jsonData/Cosmetic_Aesthetic_Dentist.json";
import Dental_Surgeon from "../../jsonData/Dental_Surgeon.json";
import Dentist from "../../jsonData/Dentist.json";
import General_Physician from "../../jsonData/General_Physician.json";
import Gynecologist from "../../jsonData/Gynecologist.json";
import Obstetrician from "../../jsonData/Obstetrician.json";
import Orthopedic_surgeon from "../../jsonData/Orthopedic_surgeon.json";
import Dermatologist from "../../jsonData/Dermatologist.json";
import Periodontist from "../../jsonData/Periodontist.json";
import Sexologist from "../../jsonData/Sexologist.json";

import "../styles/doctorSuggest.css";

const DoctoreCategories = {
	AYUSHHomoeopath,
	Cosmetic_Aesthetic_Dentist,
	Dental_Surgeon,
	Dentist,
	General_Physician,
	Gynecologist,
	Obstetrician,
	Orthopedic_surgeon,
	Dermatologist,
	Periodontist,
	Sexologist,
};

const DoctorFinder = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [category, setCategory] = useState("");
	const [symptoms, setSymptoms] = useState("");
	const [doctors, setDoctors] = useState([]);
	const [fromChat, setFromChat] = useState(false);
	const [symptomSummary, setSymptomSummary] = useState("");

	useEffect(() => {
		// Check if we have the AI-generated symptom summary
		const summary = sessionStorage.getItem("symptomSummary");
		if (summary) {
			setSymptoms(summary);
			setSymptomSummary(summary);
			setFromChat(true);
			// Clear the session storage to avoid persisting between visits
			sessionStorage.removeItem("symptomSummary");

			// Automatically search with the AI-generated summary
			findDoctorWithSymptoms(summary);
		}
	}, []);

	const findDoctorWithSymptoms = (symptomText) => {
		let searchCategories = [];

		for (let symptom in symptomsToCategory) {
			if (symptomText.toLowerCase().includes(symptom.toLowerCase())) {
				searchCategories = symptomsToCategory[symptom] || [];
				break;
			}
		}

		if (searchCategories.length === 0) {
			// Default to General Physician if no specific category found
			searchCategories = ["General_Physician"];
		}

		try {
			const doctorResults = [];

			searchCategories.map(async (cat) => {
				const data = DoctoreCategories[cat];
				doctorResults.push(...data);
			});

			doctorResults.sort((a, b) => {
				let expA = parseInt(a["Years of Experience"]) || 0;
				let expB = parseInt(b["Years of Experience"]) || 0;
				let feeA = parseInt(a["Consult Fee"]?.replace("₹", "")) || 0;
				let feeB = parseInt(b["Consult Fee"]?.replace("₹", "")) || 0;

				return expB - expA || feeA - feeB;
			});

			setDoctors(doctorResults);
		} catch (error) {
			console.error("Error loading doctor data:", error);
		}
	};

	const findDoctor = async (e) => {
		e.preventDefault();

		let searchCategories = category ? [category] : [];

		if (!category && symptoms) {
			for (let symptom in symptomsToCategory) {
				if (symptoms.toLowerCase().includes(symptom.toLowerCase())) {
					searchCategories = symptomsToCategory[symptom] || [];
					break;
				}
			}
		}

		if (searchCategories.length === 0) {
			setDoctors([]);
			return;
		}

		try {
			const doctorResults = [];

			searchCategories.map(async (cat) => {
				const data = DoctoreCategories[cat];
				doctorResults.push(...data);
			});

			doctorResults.sort((a, b) => {
				let expA = parseInt(a["Years of Experience"]) || 0;
				let expB = parseInt(b["Years of Experience"]) || 0;
				let feeA = parseInt(a["Consult Fee"]?.replace("₹", "")) || 0;
				let feeB = parseInt(b["Consult Fee"]?.replace("₹", "")) || 0;

				return expB - expA || feeA - feeB;
			});

			setDoctors(doctorResults);
		} catch (error) {
			console.error("Error loading doctor data:", error);
		}
	};

	return (
		<div id="doctorSuggest" className={darkMode ? "dark-mode" : ""}>
			<div className="toggle-switch" onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? "☀️" : "🌙"}
			</div>
			<form className="container" onSubmit={findDoctor}>
				<h1>Find the Right Doctor</h1>
				{fromChat && (
					<>
						<div className="from-chat-notice">
							Recommendations based on AI analysis of your health assistant chat
						</div>
						{symptomSummary && (
							<div className="symptom-summary">
								<h3>Symptom Analysis:</h3>
								<p>{symptomSummary}</p>
							</div>
						)}
					</>
				)}
				<label>Select Category:</label>
				<select value={category} onChange={(e) => setCategory(e.target.value)}>
					<option value="">Not Sure? Enter Symptoms Below</option>
					{Object.keys(DoctoreCategories).map((cat) => (
						<option key={cat} value={cat}>
							{cat.replace(/_/g, " ")}
						</option>
					))}
				</select>

				<input
					type="text"
					value={symptoms}
					disabled={category}
					onChange={(e) => setSymptoms(e.target.value)}
					placeholder="Enter symptoms (e.g., 'I have a headache for 3 days')"
				/>
				<button>Search</button>

				<div className="doctor-grid">
					{doctors.length > 0 ? (
						doctors.map((doc, index) => (
							<div key={index} className="doctor-card">
								<p>
									<strong>{doc.Name}</strong>
								</p>
								<p>Speciality: {doc.Speciality}</p>
								<p>Experience: {doc["Years of Experience"]} years</p>
								<p>Consultation Fee: {doc["Consult Fee"]}</p>
							</div>
						))
					) : (
						<p>No doctors found.</p>
					)}
				</div>
			</form>
		</div>
	);
};

export default DoctorFinder;
