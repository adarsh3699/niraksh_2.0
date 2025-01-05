import React, { useState } from 'react';
import '../styles/hospitalDashboard.css'; // Move the styles into a separate CSS file

// Sample data (moved from global scope)
const initialBedStatus = [
	{ bedNumber: 101, patient: 'John Doe', admissionDate: '2023-06-01', dischargeDate: '2023-06-10' },
	{ bedNumber: 102, patient: 'Jane Smith', admissionDate: '2023-06-03', dischargeDate: '2023-06-13' },
	{ bedNumber: 103, patient: null, admissionDate: null, dischargeDate: null },
	{ bedNumber: 104, patient: 'Bob Johnson', admissionDate: '2023-06-05', dischargeDate: '2023-06-15' },
	{ bedNumber: 105, patient: null, admissionDate: null, dischargeDate: null },
];

const availableDoctors = [
	{ name: 'Dr. Emily Brown', department: 'Cardiology' },
	{ name: 'Dr. Michael Lee', department: 'Neurology' },
	{ name: 'Dr. Sarah Parker', department: 'Pediatrics' },
	{ name: 'Dr. David Kim', department: 'Orthopedics' },
];

const initialRequests = [
	{ id: 'REQ001', name: 'Alice Cooper', sex: 'Female', ageRange: '30-40', severity: 7 },
	{ id: 'REQ002', name: 'Bob Dylan', sex: 'Male', ageRange: '60-70', severity: 9 },
	{ id: 'REQ003', name: 'Carol Danvers', sex: 'Female', ageRange: '20-30', severity: 3 },
	{ id: 'REQ004', name: 'David Bowie', sex: 'Male', ageRange: '50-60', severity: 6 },
	{ id: 'REQ005', name: 'Eva Green', sex: 'Female', ageRange: '40-50', severity: 5 },
];

const HospitalDashboard = () => {
	// State management
	const [bedStatus, setBedStatus] = useState(initialBedStatus);
	const [requests, setRequests] = useState(initialRequests);
	const [modalData, setModalData] = useState(null);
	const [isBedModalOpen, setIsBedModalOpen] = useState(false);
	const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

	const availableBedsCount = bedStatus.filter((bed) => !bed.patient).length;

	// Function to update bed details
	const updateBed = (bedNumber, patient, admissionDate, dischargeDate) => {
		const updatedBeds = bedStatus.map((bed) =>
			bed.bedNumber === bedNumber ? { ...bed, patient, admissionDate, dischargeDate } : bed
		);
		setBedStatus(updatedBeds);
	};

	const dischargeBed = (bedNumber) => {
		const updatedBeds = bedStatus.map((bed) =>
			bed.bedNumber === bedNumber ? { ...bed, patient: null, admissionDate: null, dischargeDate: null } : bed
		);
		setBedStatus(updatedBeds);
	};

	const assignBed = (requestId) => {
		const availableBed = bedStatus.find((bed) => !bed.patient);
		if (!availableBed) {
			alert('No available beds');
			return;
		}

		const request = requests.find((req) => req.id === requestId);
		if (request) {
			updateBed(availableBed.bedNumber, request.name, new Date().toISOString().split('T')[0], null);
			setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
		}
	};

	// Bed modal functions
	const openBedModal = (bed) => {
		setModalData(bed);
		setIsBedModalOpen(true);
	};

	const closeBedModal = () => {
		setIsBedModalOpen(false);
		setModalData(null);
	};

	// Request modal functions
	const openRequestModal = () => {
		setIsRequestModalOpen(true);
		console.log('sdf');
	};

	const closeRequestModal = () => {
		setIsRequestModalOpen(false);
	};

	return (
		<div id="HospitalDashboard">
			<h1>Hospital Dashboard</h1>
			<div className="dashboard">
				<div className="card">
					<h2>
						Bed Status <span className="badge">{availableBedsCount} Available</span>
					</h2>
					<ul>
						{bedStatus.map((bed) => (
							<li key={bed.bedNumber} onClick={() => openBedModal(bed)}>
								{`Bed ${bed.bedNumber}: ${bed.patient || 'Available'}`}
							</li>
						))}
					</ul>
				</div>

				<div className="card">
					<h2>Available Doctors</h2>
					<ul>
						{availableDoctors.map((doctor) => (
							<li key={doctor.name}>
								<strong>{doctor.name}</strong>
								<br />
								{doctor.department}
							</li>
						))}
					</ul>
				</div>

				<div className="card3" onClick={openRequestModal}>
					<h2>Requests</h2>
					<div
						style={{
							fontSize: '2em',
							textAlign: 'center',
							fontWeight: 'bold',
							color: 'rgb(255,86,87,255)',
						}}
					>
						{requests.length}
					</div>
					<div style={{ textAlign: 'center' }}>Pending Requests</div>
				</div>
			</div>

			{isBedModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={closeBedModal}>
							&times;
						</span>
						<h2>
							{modalData.patient
								? `Update Bed ${modalData.bedNumber}`
								: `Assign Patient to Bed ${modalData.bedNumber}`}
						</h2>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								updateBed(
									modalData.bedNumber,
									e.target.patientName.value,
									e.target.admissionDate.value,
									e.target.dischargeDate.value
								);
								closeBedModal();
							}}
						>
							<label htmlFor="patientName">Patient Name:</label>
							<input
								type="text"
								id="patientName"
								name="patientName"
								defaultValue={modalData.patient || ''}
								required
							/>

							<label htmlFor="admissionDate">Admission Date:</label>
							<input
								type="date"
								id="admissionDate"
								name="admissionDate"
								defaultValue={modalData.admissionDate || ''}
								required
							/>

							<label htmlFor="dischargeDate">Discharge Date:</label>
							<input
								type="date"
								id="dischargeDate"
								name="dischargeDate"
								defaultValue={modalData.dischargeDate || ''}
							/>

							<button type="submit">Update</button>
							{modalData.patient && (
								<button
									type="button"
									style={{ backgroundColor: '#f44336' }}
									onClick={() => {
										dischargeBed(modalData.bedNumber);
										closeBedModal();
									}}
								>
									Discharge
								</button>
							)}
						</form>
					</div>
				</div>
			)}

			{isRequestModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="close" onClick={closeRequestModal}>
							&times;
						</span>
						<h2>Pending Requests</h2>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Sex</th>
									<th>Age</th>
									<th>Severity</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{requests.map((req) => (
									<tr key={req.id}>
										<td>{req.id}</td>
										<td>{req.name}</td>
										<td>{req.sex}</td>
										<td>{req.ageRange}</td>
										<td>{req.severity}</td>
										<td>
											<button onClick={() => assignBed(req.id)}>Assign Bed</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default HospitalDashboard;
