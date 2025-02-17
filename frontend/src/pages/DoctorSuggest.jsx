import { useState } from "react";

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
			// console.log(searchCategories);

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
