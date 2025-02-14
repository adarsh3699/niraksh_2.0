import { useEffect, useState, useCallback, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import captureIcon from '../assets/icons/capture.svg';
import '../styles/medicineSearch.css';

const MedicineSearch = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null); // Store file but don't upload immediately
	const [description, setDescription] = useState(''); // Store API response

	// Initialize Dropzone
	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop: useCallback((acceptedFiles) => {
			const newFile = acceptedFiles[0];
			const fileWithPreview = {
				file: newFile,
				preview: newFile.type.startsWith('image/') ? URL.createObjectURL(newFile) : null,
			};
			setUploadedFiles([fileWithPreview]); // Update UI with selected file
			setSelectedFile(newFile); // Store file for later search
		}, []),
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png'],
			'application/pdf': ['.pdf'],
		},
		maxSize: 5242880, // 5MB
		noClick: true, // Disable click upload globally
		multiple: false, // Allow only one file at a time
	});

	// Handle search when clicking the button
	const handleSearch = async (e) => {
		e.preventDefault();

		if (!searchQuery && !selectedFile) {
			alert('Please enter a medicine name or upload a file.');
			return;
		}

		// If a file is uploaded, send it to the API
		if (selectedFile) {
			const formData = new FormData();
			formData.append('file', selectedFile);

			try {
				const response = await axios.post('http://localhost:4000/medicine', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
				setDescription(response.data.description); // Set API response
			} catch (error) {
				console.error('Error uploading file:', error);
			}
		} else if (searchQuery) {
			// If no file is uploaded, send the search query to the API
			try {
				const response = await axios.post('http://localhost:4000/medicine', { name: searchQuery });

				setDescription(response.data.description); // Set API response
			} catch (error) {
				console.error('Error searching for medicine:', error);
			}
		}
	};

	const removeFile = useCallback(() => {
		if (uploadedFiles.length > 0 && uploadedFiles[0].preview) {
			URL.revokeObjectURL(uploadedFiles[0].preview);
		}
		setUploadedFiles([]);
		setSelectedFile(null);
		setDescription(''); // Clear description when file is removed
	}, [uploadedFiles]);

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
					className={`dropzone-content ${isDragActive ? 'active' : ''}`}
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
									<>
										<div className="pdf-preview">PDF</div>
										<span className="file-name">{file.file.name}</span>
									</>
								)}
								<button className="remove-file" onClick={removeFile} aria-label="Remove file">
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>
			{description && (
				<div className="medicine-card">
					<h2 className="card-title">Medicine Details</h2>
					<ReactMarkdown className="card-content">{description}</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

export default memo(MedicineSearch);
