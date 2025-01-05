import React, { useState } from 'react';
import '../styles/hospitalSearch.css';

const HospitalSearch = () => {
	// Dummy data
	const states = ['California', 'New York', 'Texas'];
	const districts = {
		California: ['Los Angeles', 'San Francisco', 'San Diego'],
		'New York': ['New York City', 'Buffalo', 'Albany'],
		Texas: ['Houston', 'Austin', 'Dallas'],
	};
	const hospitals = {
		'Los Angeles': [
			{
				name: 'LA General Hospital',
				address: '123 Main St, Los Angeles, CA',
				phone: '(123) 456-7890',
				beds: 500,
				doctors: [
					{ department: 'Cardiology', count: 15 },
					{ department: 'Neurology', count: 10 },
					{ department: 'Pediatrics', count: 20 },
				],
			},
			{
				name: 'Cedars-Sinai Medical Center',
				address: '456 Cedar Ave, Los Angeles, CA',
				phone: '(234) 567-8901',
				beds: 800,
				doctors: [
					{ department: 'Oncology', count: 25 },
					{ department: 'Orthopedics', count: 18 },
					{ department: 'Gastroenterology', count: 12 },
				],
			},
		],
		'New York City': [
			{
				name: 'NYC Health Hospital',
				address: '789 Broadway, New York, NY',
				phone: '(345) 678-9012',
				beds: 700,
				doctors: [
					{ department: 'Emergency Medicine', count: 30 },
					{ department: 'Surgery', count: 25 },
					{ department: 'Internal Medicine', count: 35 },
				],
			},
			{
				name: 'Mount Sinai Hospital',
				address: '1 Gustave L. Levy Pl, New York, NY',
				phone: '(456) 789-0123',
				beds: 1100,
				doctors: [
					{ department: 'Cardiology', count: 28 },
					{ department: 'Oncology', count: 32 },
					{ department: 'Neurology', count: 20 },
				],
			},
		],
		Houston: [
			{
				name: 'Houston Methodist Hospital',
				address: '6565 Fannin St, Houston, TX',
				phone: '(567) 890-1234',
				beds: 850,
				doctors: [
					{ department: 'Cardiology', count: 30 },
					{ department: 'Oncology', count: 28 },
					{ department: 'Neurology', count: 22 },
				],
			},
			{
				name: 'Memorial Hermann Hospital',
				address: '6411 Fannin St, Houston, TX',
				phone: '(678) 901-2345',
				beds: 750,
				doctors: [
					{ department: 'Emergency Medicine', count: 35 },
					{ department: 'Surgery', count: 30 },
					{ department: 'Orthopedics', count: 20 },
				],
			},
		],
	};

	// State hooks
	const [selectedState, setSelectedState] = useState('');
	const [selectedDistrict, setSelectedDistrict] = useState('');
	const [selectedHospital, setSelectedHospital] = useState('');
	const [results, setResults] = useState([]);

	const handleStateChange = (e) => {
		setSelectedState(e.target.value);
		setSelectedDistrict('');
		setSelectedHospital('');
	};

	const handleDistrictChange = (e) => {
		setSelectedDistrict(e.target.value);
		setSelectedHospital('');
	};

	const handleHospitalChange = (e) => {
		setSelectedHospital(e.target.value);
	};

	const handleSearch = () => {
		if (selectedDistrict) {
			let filteredHospitals = hospitals[selectedDistrict];
			if (selectedHospital) {
				filteredHospitals = filteredHospitals.filter((hospital) => hospital.name === selectedHospital);
			}
			setResults(filteredHospitals);
		}
	};

	return (
		<div id="hospitalSearch">
			<header>
				<h1>Hospital Search</h1>
			</header>
			<main>
				<div className="search-container">
					<select value={selectedState} onChange={handleStateChange}>
						<option value="">Select State</option>
						{states?.map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</select>

					<select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedState}>
						<option value="">Select District</option>
						{selectedState &&
							districts[selectedState]?.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
					</select>

					<select value={selectedHospital} onChange={handleHospitalChange} disabled={!selectedDistrict}>
						<option value="">Select Hospital</option>
						{selectedDistrict &&
							hospitals[selectedDistrict]?.map((hospital) => (
								<option key={hospital.name} value={hospital.name}>
									{hospital.name}
								</option>
							))}
					</select>

					<button onClick={handleSearch}>Search</button>
				</div>

				<div id="results-container">
					{results?.length > 0 ? (
						results.map((hospital, index) => (
							<div key={index} className="hospital-card">
								<h2>{hospital.name}</h2>
								<p>{hospital.address}</p>
								<p>{hospital.phone}</p>
								<p>
									<strong>Number of Beds:</strong> {hospital.beds}
								</p>
								<h3>Doctors by Department</h3>
								<table>
									<thead>
										<tr>
											<th>Department</th>
											<th>Number of Doctors</th>
										</tr>
									</thead>
									<tbody>
										{hospital.doctors?.map((doctor, index) => (
											<tr key={index}>
												<td>{doctor.department}</td>
												<td>{doctor.count}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						))
					) : (
						<p>
							No hospitals found. Please select a state, district, and optionally a hospital, then search.
						</p>
					)}
				</div>
			</main>
		</div>
	);
};

export default HospitalSearch;
