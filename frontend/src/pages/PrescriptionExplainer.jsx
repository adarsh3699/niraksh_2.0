import { memo, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { apiCall } from "../utils";

import { DNA } from "react-loader-spinner";

import "../styles/prescriptionExplainer.css";

const PrescriptionExplainer = () => {
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploaded, setUploaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const [description, setDescription] = useState("");

	// Memoize the onDrop handler to avoid re-creation on every render
	// Handle file drop
	const onDrop = useCallback((acceptedFiles) => {
		const newFiles = acceptedFiles.map((file) => ({
			file,
			preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
		}));
		setUploadedFiles((prev) => [...prev, ...newFiles]);
	}, []);

	// Memoize the handleUpload function
	const handleSearch = useCallback(async () => {
		if (uploadedFiles.length === 0) return;

		const formData = new FormData();
		uploadedFiles.forEach((fileObj) => formData.append("files", fileObj.file));

		try {
			setLoading(true);
			const response = await apiCall("ai/prescription", "POST", formData, true);

			setDescription(response.data?.description); // Update UI with API response
		} catch (error) {
			console.error("Upload Error:", error);
			alert("Error uploading files. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [uploadedFiles]);

	// Memoize the handleReset function
	const handleReset = useCallback(() => {
		setUploadedFiles([]);
		setDescription("");
		setUploaded(false);
	}, []);

	const removeFile = (index) => {
		setUploadedFiles((uploadedFiles) => {
			const newFiles = [...uploadedFiles];
			if (newFiles[index].preview) {
				URL.revokeObjectURL(newFiles[index].preview);
			}
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	// Memoize Dropzone hooks
	const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"application/pdf": [],
		},
		multiple: true,
		noClick: true, // Disable click upload globally
	});

	return (
		<div id="prescriptionExplainer" {...getRootProps()}>
			<h1 className="title">Upload and Analyze Your Prescription</h1>
			<p className="subtitle">Upload your prescriptions to get detailed medicine information and suggestions.</p>

			{/* Dropzone */}
			<div
				className={`dropzone ${isDragActive ? "active" : ""}`}
				onClick={(e) => {
					e.stopPropagation(); // Prevent triggering dropzone onClick
					open(); // Open file dialog
				}}
			>
				<input {...getInputProps()} />
				{isDragActive ? <p>Drop your files here...</p> : <p>Drag & drop files here or click to select them</p>}
			</div>

			{uploadedFiles.length > 0 && (
				<div className="uploaded-files">
					{uploadedFiles.map((file, index) => (
						<div key={index} className="file-preview">
							{file.preview ? (
								<img src={file.preview} width="100px" alt="Preview" />
							) : (
								<>
									<div className="pdf-preview">PDF</div>
									<span className="file-name">{file.file.name}</span>
								</>
							)}
							<button className="remove-file" onClick={() => removeFile(index)} aria-label="Remove file">
								×
							</button>
						</div>
					))}
				</div>
			)}

			{/* Buttons */}
			<div className="button-container">
				{uploaded ? (
					<button className="primary-btn reset-btn" onClick={handleReset}>
						Reset
					</button>
				) : (
					<button
						className="primary-btn upload-btn"
						onClick={handleSearch}
						disabled={uploadedFiles.length === 0 || loading}
					>
						Search
					</button>
				)}
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

			{/* Prescription Details */}
			{description && (
				<div className="prescription-details">
					<ReactMarkdown className="card-content">{description}</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

export default memo(PrescriptionExplainer);
