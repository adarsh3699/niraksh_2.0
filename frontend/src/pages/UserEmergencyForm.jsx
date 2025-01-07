import React, { useCallback, useEffect, useState } from "react";
import "../styles/userEmergencyForm.css";
import ShowMsg from "../components/showMsg/ShowMsg";
import { addNewNote } from "../firebase/emergencyPatientForm";

import { extractEncryptedToken } from "../utils";

const userId = extractEncryptedToken(localStorage.getItem("JWT_token"))?.userId;

const UserEmergencyForm = () => {
	const [msg, setMsg] = useState({ text: "", type: "" });
	const [location, setLocation] = useState([]);
	const [imageUpload, setImageUpload] = useState(null);
	const [bookingId, setBookingId] = useState("");
	const [showModal, setShowModal] = useState(false);

	const handleMsgShown = useCallback((msgText, type) => {
		if (msgText) {
			setMsg({ text: msgText, type: type });
			setTimeout(() => {
				setMsg({ text: "", type: "" });
			}, 2500);
		} else {
			console.log("Please Provide Text Msg");
		}
	}, []);

	const success = useCallback(
		(position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;

			setLocation([latitude, longitude]);
			console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

			// setLoading(false);
			handleMsgShown("Location Retrieved Successfully", "success");
		},
		[handleMsgShown]
	);

	const error1 = useCallback(() => {
		handleMsgShown("Unable to retrieve your location", "error");
		console.log("Unable to retrieve your location");
	}, [handleMsgShown]);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error1);
			console.log("Geolocation supported");
		} else {
			console.log("Geolocation not supported");
		}
	}, [error1, success]);

	const handleImageUpload = useCallback(
		(e) => {
			setImageUpload(e.target.files[0]);
		},
		[setImageUpload]
	);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		const name = e.target.name.value;
		const age = e.target.age.value;
		const gender = e.target.gender.value;
		// console.log(location);
		// console.log(name, age, gender);

		const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();
		setBookingId(bookingId);
		// addNewNote({ name, age, gender, bookingId, location }, userId);
		setShowModal(true);
	}, []);

	return (
		<div id="userEmergencyForm">
			<div>
				<div>
					<h1>Emergency</h1>
					<h2>Patient Form</h2>
				</div>

				<p className="description">
					Please fill out the form below to provide information about the emergency patient.
				</p>
				<form id="emergencyForm" onSubmit={handleSubmit}>
					<div className="form-fields">
						<div className="form-group">
							<label htmlFor="name">Name</label>
							<input id="name" name="name" placeholder="Optional" />
						</div>
						<div className="form-group">
							<label htmlFor="age">Age</label>
							<input id="age" type="number" name="age" placeholder="Optional" />
						</div>
						<div className="form-group">
							<label htmlFor="gender">Gender</label>
							<input id="gender" name="gender" placeholder="M/F" />
						</div>
						<div className="form-group">
							<label htmlFor="location">Location</label>
							<div className="location-input">
								<svg
									className="location-icon"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<input
									id="location"
									placeholder="Click to get current location"
									value={location}
									readOnly
								/>
							</div>
						</div>
					</div>

					<button type="submit" className="start-btn">
						SUBMIT
					</button>
				</form>
			</div>
			<div className="image-upload" id="imageUpload">
				<div>Please click a picture of the incident</div>
				<div className="image-area">
					<img
						id="capturedImage"
						src={imageUpload ? URL?.createObjectURL(imageUpload) : ""}
						loading="lazy"
						alt="Captured incident"
					/>
					<input type="file" accept="image/*" id="image" onChange={handleImageUpload} />
				</div>
			</div>

			{showModal && (
				<div id="confirmationModal" className="modal">
					<div className="modal-content">
						<span className="close" onClick={() => setShowModal(false)}>
							&times;
						</span>

						<h2>Booking Confirmed</h2>

						<p>
							Your booking has been confirmed. Please show the following booking ID to the reception for
							further process:
						</p>

						<p id="bookingId" style={{ fontWeight: "bold", fontSize: "1.2em" }}>
							{bookingId}
						</p>
					</div>
				</div>
			)}
			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</div>
	);
};

export default UserEmergencyForm;
