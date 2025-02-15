import React, { useState, useEffect } from 'react';
import '../styles/doctorSuggest.css';

const DoctorFinder = () => {
	const [darkMode, setDarkMode] = useState(false);
	const [category, setCategory] = useState('');
	const [symptoms, setSymptoms] = useState('');
	const [symptomsToCategory, setSymptomsToCategory] = useState({});
	const [doctors, setDoctors] = useState([]);

	useEffect(() => {
		fetch('../../jsonData/symptoms_to_category.json')
			.then((response) => response.json())
			.then((data) => setSymptomsToCategory(data))
			.catch((error) => console.error('Error loading symptoms data:', error));
	}, []);

	const findDoctor = async () => {
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
			await Promise.all(
				searchCategories.map(async (cat) => {
					const response = await fetch(`../../jsonData/${cat}.json`);
					const data = await response.json();
					doctorResults.push(...data);
				})
			);

			doctorResults.sort((a, b) => {
				let expA = parseInt(a['Years of Experience']) || 0;
				let expB = parseInt(b['Years of Experience']) || 0;
				let feeA = parseInt(a['Consult Fee'].replace('₹', '')) || 0;
				let feeB = parseInt(b['Consult Fee'].replace('₹', '')) || 0;

				return expB - expA || feeA - feeB;
			});

			setDoctors(doctorResults);
		} catch (error) {
			console.error('Error loading doctor data:', error);
		}
	};

	return (

		<div id='DiseaseSearch' className={darkMode ? 'dark-mode' : ''}>
			<div className="toggle-switch" onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? '☀️' : '🌙'}
			</div>
			<div className="container">
				<h2>Find the Right Doctor</h2>
				<label>Select Category:</label>
				<select value={category} onChange={(e) => setCategory(e.target.value)}>
					<option value="">Not Sure? Enter Symptoms Below</option>
					{[
						'Dermatologist',
						'Orthopedic_surgeon',
						'General_Physician',
						'Gynecologist',
						'Obstetrician',
						'Sexologist',
						'Cosmetic_Aesthetic_Dentist',
						'Periodontist',
						'Dental_Surgeon',
						'AYUSHHomoeopath',
					].map((cat) => (
						<option key={cat} value={cat}>
							{cat.replace(/_/g, ' ')}
						</option>
					))}
				</select>

				<input
					type="text"
					value={symptoms}
					onChange={(e) => setSymptoms(e.target.value)}
					placeholder="Enter symptoms (e.g., 'I have a headache for 3 days')"
				/>
				<button onClick={findDoctor}>Search</button>

				<div className="doctor-grid">
					{doctors.length > 0 ? (
						doctors.map((doc, index) => (
							<div key={index} className="doctor-card">
								<p>
									<strong>{doc.Name}</strong>
								</p>
								<p>Speciality: {doc.Speciality}</p>
								<p>Experience: {doc['Years of Experience']} years</p>
								<p>Consultation Fee: {doc['Consult Fee']}</p>
							</div>
						))
					) : (
						<p>No doctors found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default DoctorFinder;
