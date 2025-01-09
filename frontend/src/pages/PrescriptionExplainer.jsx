import { memo, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/prescriptionExplainer.css";

const PrescriptionExplainer = () => {
	const [files, setFiles] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [uploaded, setUploaded] = useState(false);

	const dummyData = {
		name: "Dolo 650 Tablet",
		uses: [
			"Relief of mild to moderate pain such as headaches, muscle pain, arthritis, backache, toothaches, and menstrual cramps.",
			"Reduction of fever.",
		],
		sideEffects: ["Nausea", "Vomiting", "Stomach pain", "Allergic reactions (rare)"],
		dosage: "As prescribed by the physician. Do not exceed 4 grams (4000 mg) per day.",
		precautions: [
			"Avoid consuming alcohol while taking this medication.",
			"Consult a doctor if you have liver or kidney issues.",
			"Not recommended for use in patients with severe liver impairment.",
		],
	};

	// Memoize the onDrop handler to avoid re-creation on every render
	const onDrop = useCallback((acceptedFiles) => {
		setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
		setShowResults(false); // Reset results when new files are uploaded
	}, []);

	// Memoize the handleUpload function
	const handleUpload = useCallback(() => {
		setUploaded(true);
		alert("Files uploaded successfully!");
	}, []);

	// Memoize the handleReset function
	const handleReset = useCallback(() => {
		setFiles([]);
		setShowResults(false);
		setUploaded(false);
	}, []);

	const handleSearch = useCallback(() => {
		setShowResults(true);
	}, []);

	// Memoize Dropzone hooks
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"application/pdf": [],
		},
		multiple: true,
	});

	return (
		<div className="prescriptionExplainer">
			<h1 className="title">Upload and Analyze Your Prescription</h1>
			<p className="subtitle">Upload your prescriptions to get detailed medicine information and suggestions.</p>

			{/* Dropzone */}
			<div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
				<input {...getInputProps()} />
				{isDragActive ? <p>Drop your files here...</p> : <p>Drag & drop files here or click to select them</p>}
			</div>

			{/* Uploaded Files */}
			{files.length > 0 && (
				<div className="uploaded-files">
					<h3>Uploaded Files:</h3>
					<ul>
						{files.map((file, index) => (
							<li key={index} className="file-item">
								<span className="file-name">{file.name}</span>{" "}
								<span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Buttons */}
			<div className="button-container">
				{uploaded ? (
					<button className="primary-btn reset-btn" onClick={handleReset}>
						Reset
					</button>
				) : (
					<button className="primary-btn upload-btn" onClick={handleUpload} disabled={files.length === 0}>
						Upload
					</button>
				)}
				<button className="primary-btn search-btn" onClick={handleSearch} disabled={!uploaded}>
					Search
				</button>
			</div>

			{/* Prescription Details */}
			{showResults && (
				<div className="prescription-details">
					<h3>{dummyData.name}</h3>
					<p>
						<strong>Uses:</strong>
					</p>
					<ul>
						{dummyData.uses.map((use, index) => (
							<li key={index}>{use}</li>
						))}
					</ul>
					<p>
						<strong>Side Effects:</strong>
					</p>
					<ul>
						{dummyData.sideEffects.map((sideEffect, index) => (
							<li key={index}>{sideEffect}</li>
						))}
					</ul>
					<p>
						<strong>Dosage:</strong> {dummyData.dosage}
					</p>
					<p>
						<strong>Precautions:</strong>
					</p>
					<ul>
						{dummyData.precautions.map((precaution, index) => (
							<li key={index}>{precaution}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default memo(PrescriptionExplainer);
