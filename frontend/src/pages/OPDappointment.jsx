import React, { useState, useEffect } from "react";

import "../styles/OPDappointment.css"; // Import your CSS styles

const departments = [
	"Cardiology",
	"Neurology",
	"Oncology",
	"Pediatrics",
	"Orthopedics",

	"Gynecology",
	"Dermatology",
	"Ophthalmology",
	"Psychiatry",
	"Urology",

	"Gastroenterology",
	"Endocrinology",
	"Nephrology",
	"Pulmonology",
];

const hospitals = [
	{ name: "City Hospital", slots: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"] },

	{ name: "Central Clinic", slots: ["10:00 AM - 12:00 PM", "3:00 PM - 5:00 PM"] },

	{ name: "Health Center", slots: ["11:00 AM - 1:00 PM", "4:00 PM - 6:00 PM"] },
];

const OPDappointment = () => {
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [consultationDate, setConsultationDate] = useState("");
	const [showHospitals, setShowHospitals] = useState(false);
	const [selectedHospital, setSelectedHospital] = useState("");
	const [selectedSlot, setSelectedSlot] = useState("");
	const [bookingId, setBookingId] = useState("");
	const [showModal, setShowModal] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (selectedDepartment && consultationDate) {
			setShowHospitals(true);
		}
	};

	const confirmBooking = () => {
		if (selectedHospital && selectedSlot) {
			const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();

			setBookingId(bookingId);

			setShowModal(true);
		} else {
			alert("Please select a hospital and time slot.");
		}
	};

	const closeModal = () => {
		setShowModal(false);
	};

	return (
		<div id="OPDappointment">
			<div className="container">
				<h1>OPD Registration Form</h1>

				<form onSubmit={handleSubmit}>
					<label htmlFor="department">Department:</label>

					<select
						id="department"
						value={selectedDepartment}
						onChange={(e) => setSelectedDepartment(e.target.value)}
						required
					>
						<option value="">Select a department</option>

						{departments.map((dept) => (
							<option key={dept} value={dept}>
								{dept}
							</option>
						))}
					</select>

					<label htmlFor="consultationDate">Consultation Date:</label>

					<input
						type="date"
						id="consultationDate"
						value={consultationDate}
						onChange={(e) => setConsultationDate(e.target.value)}
						required
					/>

					<button type="submit">Submit</button>
				</form>

				{showHospitals && (
					<div id="hospitalList" className="hospital-list">
						<h2>Available Hospitals and Time Slots</h2>

						{hospitals.map((hospital) => (
							<div key={hospital.name} className="hospital-item">
								<h3>{hospital.name}</h3>

								<div className="time-slots">
									{hospital.slots.map((slot) => (
										<span
											key={slot}
											className={`time-slot ${selectedSlot === slot ? "selected" : ""}`}
											onClick={() => {
												setSelectedSlot(slot);

												setSelectedHospital(hospital.name);
											}}
										>
											{slot}
										</span>
									))}
								</div>
							</div>
						))}

						<button onClick={confirmBooking}>Confirm Booking</button>
					</div>
				)}

				{showModal && (
					<div id="confirmationModal" className="modal">
						<div className="modal-content">
							<span className="close" onClick={closeModal}>
								&times;
							</span>

							<h2>Booking Confirmed</h2>

							<p>
								Your booking has been confirmed. Please show the following booking ID to the reception
								for further process:
							</p>

							<p id="bookingId" style={{ fontWeight: "bold", fontSize: "1.2em" }}>
								{bookingId}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default OPDappointment;
