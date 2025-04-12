import { useState, useEffect } from "react";
import { apiCall } from "../utils";

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
	const [category, setCategory] = useState("");
	const [symptoms, setSymptoms] = useState("");
	const [doctors, setDoctors] = useState([]);
	const [fromChat, setFromChat] = useState(false);
	const [fromHomepage, setFromHomepage] = useState(false);
	const [symptomSummary, setSymptomSummary] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysisError, setAnalysisError] = useState("");
	const [analysisReasoning, setAnalysisReasoning] = useState("");
	const [recommendedCategories, setRecommendedCategories] = useState([]);

	useEffect(() => {
		// Check for data sources in order of priority

		// 1. Check if we have the AI-generated symptom summary from chat assistant
		const summary = sessionStorage.getItem("symptomSummary");
		if (summary) {
			setSymptoms(summary);
			setSymptomSummary(summary);
			setFromChat(true);
			// Clear the session storage to avoid persisting between visits
			sessionStorage.removeItem("symptomSummary");

			// Use the enhanced semantic analysis instead of simple keyword matching
			analyzeSymptomsSemantically(summary);
			return; // Exit early if we found chat data
		}

		// 2. Check if we have symptoms from home page search
		const homeSearchSymptoms = sessionStorage.getItem("homeSearchSymptoms");
		if (homeSearchSymptoms) {
			setSymptoms(homeSearchSymptoms);
			setFromHomepage(true);
			// Clear the session storage
			sessionStorage.removeItem("homeSearchSymptoms");

			// Analyze the symptoms from home page search
			analyzeSymptomsSemantically(homeSearchSymptoms);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// New function that uses the backend LangChain-based symptom analyzer
	const analyzeSymptomsSemantically = async (symptomText) => {
		setIsAnalyzing(true);
		setAnalysisError("");
		setAnalysisReasoning("");
		setRecommendedCategories([]);

		try {
			// Call the backend API for semantic analysis using LangChain
			const response = await apiCall("ai/analyze-symptoms", "POST", {
				symptoms: symptomText,
			});

			if (response?.data?.categories && response.data.categories.length > 0) {
				// Use the categories returned from the semantic analysis
				const searchCategories = response.data.categories;
				setRecommendedCategories(searchCategories);

				// Store the reasoning if provided
				if (response.data.reasoning) {
					setAnalysisReasoning(response.data.reasoning);
				}

				fetchDoctorsForCategories(searchCategories);
			} else {
				// Fallback to keyword-based matching if semantic analysis returned no results
				findDoctorWithKeywordMatching(symptomText);
			}
		} catch (error) {
			console.error("Error in semantic symptom analysis:", error);
			setAnalysisError("There was an error analyzing your symptoms. Falling back to basic matching.");
			// Fallback to original method
			findDoctorWithKeywordMatching(symptomText);
		} finally {
			setIsAnalyzing(false);
		}
	};

	// The original keyword-based matching approach (kept as a fallback)
	const findDoctorWithKeywordMatching = (symptomText) => {
		let searchCategories = [];

		// Current approach: simple keyword matching
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

		setRecommendedCategories(searchCategories);
		setAnalysisReasoning("Based on keyword matching in your symptoms.");
		fetchDoctorsForCategories(searchCategories);
	};

	// Extract the common doctor fetching logic into a separate function
	const fetchDoctorsForCategories = (categories) => {
		try {
			const doctorResults = [];
			const categoryPriority = {}; // Map to store priority of each category

			// Assign priority values based on order in the categories array
			categories.forEach((cat, index) => {
				categoryPriority[cat] = index; // Lower index = higher priority
			});

			// Collect doctors from all recommended categories
			categories.forEach((cat) => {
				if (DoctoreCategories[cat]) {
					// Tag each doctor with their category for sorting
					const doctorsWithCategory = DoctoreCategories[cat].map((doc) => ({
						...doc,
						__categoryPriority: categoryPriority[cat], // Add category priority as a metadata field
					}));
					doctorResults.push(...doctorsWithCategory);
				}
			});

			// Sort doctors by:
			// 1. Category priority (primary recommendation first)
			// 2. Experience (high to low)
			// 3. Fee (low to high)
			doctorResults.sort((a, b) => {
				// First sort by category priority
				if (a.__categoryPriority !== b.__categoryPriority) {
					return a.__categoryPriority - b.__categoryPriority;
				}

				// If from same category, sort by experience
				let expA = parseInt(a["Years of Experience"]) || 0;
				let expB = parseInt(b["Years of Experience"]) || 0;
				if (expA !== expB) {
					return expB - expA;
				}

				// If same experience, sort by fee
				let feeA = parseInt(a["Consult Fee"]?.replace("₹", "")) || 0;
				let feeB = parseInt(b["Consult Fee"]?.replace("₹", "")) || 0;
				return feeA - feeB;
			});

			setDoctors(doctorResults);
		} catch (error) {
			console.error("Error loading doctor data:", error);
		}
	};

	const findDoctor = async (e) => {
		e.preventDefault();
		setIsAnalyzing(true);
		setAnalysisError("");
		setAnalysisReasoning("");
		setRecommendedCategories([]);

		// If category is selected directly, use that
		if (category) {
			setRecommendedCategories([category]);
			setAnalysisReasoning("Category selected directly by you.");
			fetchDoctorsForCategories([category]);
			setIsAnalyzing(false);
			return;
		}

		// If symptoms are entered but no category selected, use semantic analysis
		if (symptoms) {
			try {
				// Use the semantic analysis API
				const response = await apiCall("ai/analyze-symptoms", "POST", {
					symptoms: symptoms,
				});

				if (response?.data?.categories && response.data.categories.length > 0) {
					setRecommendedCategories(response.data.categories);
					if (response.data.reasoning) {
						setAnalysisReasoning(response.data.reasoning);
					}
					fetchDoctorsForCategories(response.data.categories);
				} else {
					// Fallback to basic matching
					findDoctorWithKeywordMatching(symptoms);
				}
			} catch (error) {
				console.error("Error in semantic analysis:", error);
				setAnalysisError("There was an error analyzing your symptoms. Falling back to basic matching.");
				findDoctorWithKeywordMatching(symptoms);
			}
		} else {
			setDoctors([]);
		}

		setIsAnalyzing(false);
	};

	return (
		<div id="doctorSuggest">
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

				{fromHomepage && (
					<div className="from-homepage-notice">
						Analyzing your search: <strong>{symptoms}</strong>
					</div>
				)}

				{analysisError && <div className="analysis-error">{analysisError}</div>}

				{recommendedCategories.length > 0 && (
					<div className="recommended-specialists">
						<h3>Recommended Specialists:</h3>
						<ul>
							{recommendedCategories.map((cat, index) => (
								<li key={index}>
									{cat.replace(/_/g, " ")}
									{index === 0 && (
										<span className="primary-recommendation">(Primary Recommendation)</span>
									)}
								</li>
							))}
						</ul>
						{analysisReasoning && (
							<div className="reasoning">
								<h4>Why these specialists are recommended:</h4>
								<p>{analysisReasoning}</p>
							</div>
						)}
					</div>
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
					disabled={category || isAnalyzing}
					onChange={(e) => setSymptoms(e.target.value)}
					placeholder="Enter symptoms (e.g., 'I have a headache for 3 days')"
				/>
				<button type="submit" disabled={isAnalyzing}>
					{isAnalyzing ? "Analyzing Symptoms..." : "Search"}
				</button>

				<div className="doctor-grid">
					{isAnalyzing ? (
						<div className="loading-container">
							<div className="loading-spinner"></div>
							<p>Analyzing your symptoms for the best specialist match...</p>
						</div>
					) : doctors.length > 0 ? (
						doctors.map((doc, index) => (
							<div
								key={index}
								className={`doctor-card ${
									index < 3 && doc.__categoryPriority === 0 ? "primary-recommendation-card" : ""
								}`}
							>
								{doc.__categoryPriority === 0 && index < 3 && (
									<div className="recommendation-badge">Top Recommendation</div>
								)}
								<p>
									<strong>{doc.Name}</strong>
								</p>
								<p>Speciality: {doc.Speciality}</p>
								<p>Experience: {doc["Years of Experience"]} years</p>
								<p>Consultation Fee: {doc["Consult Fee"]}</p>
							</div>
						))
					) : (
						<p>No doctors found. Try describing your symptoms differently or select a category.</p>
					)}
				</div>
			</form>
		</div>
	);
};

export default DoctorFinder;
