import { useEffect, useState, useCallback, memo } from "react";
import { useDropzone } from "react-dropzone";
import captureIcon from "../assets/icons/capture.svg";
import "../styles/medicineSearch.css";

const MedicineSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState([]);

	// Initialize Dropzone
	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop: (acceptedFiles) => {
			const newFile = acceptedFiles[0];
			const fileWithPreview = {
				file: newFile,
				preview: newFile.type.startsWith("image/") ? URL.createObjectURL(newFile) : null,
			};
			setUploadedFiles([fileWithPreview]); // Replace the existing file with the new one
		},
		accept: {
			"image/*": [".jpeg", ".jpg", ".png"],
			"application/pdf": [".pdf"],
		},
		maxSize: 5242880, // 5MB
		noClick: true, // Disable click upload globally
		multiple: false, // Allow only one file at a time
	});

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Searching for:", searchQuery);
	};

	const removeFile = (index) => {
		setUploadedFiles((files) => {
			const newFiles = [...files];
			if (newFiles[index].preview) {
				URL.revokeObjectURL(newFiles[index].preview);
			}
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	useEffect(() => {
		return () => {
			uploadedFiles.forEach((file) => {
				if (file.preview) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
	}, [uploadedFiles]);

	return (
		<div {...getRootProps()} id="medicineSearch">
			<div className="search-section">
				<form className="searchForm" onSubmit={handleSearch}>
					<div className="searchbar">
						<input
							type="text"
							placeholder="Enter medicine name"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<img
							src={captureIcon}
							className="captureBtn"
							loading="lazy"
							alt="Capture Icon"
							onClick={(e) => {
								e.stopPropagation(); // Prevent triggering dropzone onClick
								open(); // Open file dialog
							}}
						/>
					</div>
					<button type="submit" className="searchBtn">
						Search
					</button>
				</form>

				<div
					className={`dropzone-content ${isDragActive ? "active" : ""}`}
					onClick={(e) => {
						e.stopPropagation(); // Prevent triggering dropzone onClick
						open(); // Open file dialog
					}}
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p>Drop the files here ...</p>
					) : (
						<p>Drag & drop images/PDFs here, or click the lens icon to select files</p>
					)}
				</div>

				{uploadedFiles.length > 0 && (
					<div className="uploaded-files">
						{uploadedFiles.map((file, index) => (
							<div key={index} className="file-preview">
								{file.preview ? (
									<img src={file.preview} width="100px" alt="Preview" />
								) : (
									<div className="pdf-preview">PDF</div>
								)}
								<button
									className="remove-file"
									onClick={() => removeFile(index)}
									aria-label="Remove file"
								>
									×
								</button>
								<span className="file-name">{file.file.name}</span>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="medicine-card">
				<h2 className="card-title">Medicine Details</h2>

				<section className="card-section">
					<h3>Uses</h3>
					<p>This medicine is used to treat high blood pressure and heart-related issues.</p>
				</section>

				<section className="card-section">
					<h3>Side Effects</h3>
					<p>Common side effects include nausea, dizziness, and headache.</p>
				</section>

				<section className="card-section">
					<h3>Dosage Information</h3>
					<p>The recommended dosage is 50mg once daily.</p>
				</section>
			</div>

			<button className="compare-button">Compare Prices with Other Websites</button>
		</div>
	);
};

export default memo(MedicineSearch);
