import { memo } from 'react';
import './doMore.css';

import bookBedsImg from '../../../assets/bookBeds.avif';
import prescription from '../../../assets/prescription.webp';

function DoMore() {
	const handleSearch = () => {
		console.log('Searching for diseases...');
		// Add search functionality here
	};

	const handleBooking = () => {
		console.log('Opening booking form...');
		// Add booking functionality here
	};

	return (
		<div className="DoMore-container">
			<header className="search-header">
				<svg className="paw-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6z" />
				</svg>
				<h1 className="DoMore-title">Do More for Cure</h1>
			</header>

			<div className="cards-grid">
				<div className="search-card">
					<img src={prescription} alt="Medical storage facility" loading="lazy" className="card-background" />
					<div className="card-overlay">
						<h2 className="card-title">Prescription Explainer</h2>
						<p className="card-subtitle">Get detailed info and treatment</p>
						<button className="card-button" onClick={handleSearch}>
							Search Now
						</button>
					</div>
				</div>

				<div className="search-card">
					<img src={bookBedsImg} alt="Hospital bed" loading="lazy" className="card-background" />
					<div className="card-overlay">
						<h2 className="card-title">Drug Drug Interaction</h2>
						<p className="card-subtitle">Find and Drug Interaction between multi Drug</p>
						<button className="card-button" onClick={handleBooking}>
							Book Now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(DoMore);
