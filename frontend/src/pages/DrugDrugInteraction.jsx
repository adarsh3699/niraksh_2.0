import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { apiCall } from "../utils";

import { DNA } from "react-loader-spinner";
import "../styles/drugDrugInteraction.css";

const DrugDrugInteraction = () => {
	const [medications, setMedications] = useState(["", ""]); // Start with 2 input fields
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState("");

	useEffect(() => {
		document.title = "Drug Drug Interaction | Niraksh";
		const temp = JSON.parse(localStorage.getItem("medicine"));

		setMedications(temp?.length > 0 ? (temp.length == 1 ? [...temp, ""] : temp) : ["", ""]);
	}, []);

	const handleAddMedication = () => {
		setMedications([...medications, ""]); // Add a new empty input field
	};

	const handleInteractionCheck = async (e) => {
		e.preventDefault();
		// Send medications to the API
		const temp = medications.join(", ");
		if (!temp) return;

		setLoading(true);
		try {
			const response = await apiCall("ai/drug-interaction", "POST", { medicines: temp });

			setDescription(response?.data.description); // Set API response
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div id="drugDrugInteraction">
			<div className="container">
				<h1>Drug Drug Interaction Checker</h1>
				<p className="subtitle">
					Enter the names of the medicines you are taking to check drug interactions or side effect with other
					medicines.
				</p>
				<form id="interactionForm" onSubmit={handleInteractionCheck}>
					<div id="medicationInputs">
						{medications.map((med, index) => (
							<div key={index} className="searchbar">
								<input
									type="text"
									placeholder={`Enter medicine name ${index + 1}`}
									value={med}
									onChange={(e) => {
										const newMeds = [...medications];
										newMeds[index] = e.target.value;
										setMedications(newMeds);
									}}
								/>

								<button
									type="button"
									className="removeBtn"
									onClick={() => {
										const newMeds = medications.filter((_, medIndex) => medIndex !== index);
										setMedications(newMeds);
									}}
								>
									&times;
								</button>
							</div>
						))}
					</div>
					<div className="button-container">
						<button
							type="button"
							id="addMedication"
							className="primary-btn"
							onClick={handleAddMedication}
							disabled={loading}
						>
							Add Another Medication
						</button>
						<button type="submit" className="search-btn" disabled={loading}>
							Search
						</button>
					</div>
				</form>
			</div>
			<div className="loading-spinner" style={{ textAlign: "center" }}>
				<DNA
					visible={loading}
					height="180"
					width="180"
					ariaLabel="dna-loading"
					wrapperStyle={{}}
					wrapperClass="dna-wrapper"
				/>
			</div>
			{description && !loading && (
				<div className="medicine-card">
					<h2 className="card-title">Medicine Details</h2>
					<ReactMarkdown className="card-content">{description}</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

export default DrugDrugInteraction;
