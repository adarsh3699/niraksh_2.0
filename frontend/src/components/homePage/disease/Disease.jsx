import React, { memo } from 'react';
import './disease.css';

function Diseases() {
	const diseases = [
		{
			title: 'Cancer',
			icon: '/placeholder.svg?height=80&width=80',
		},
		{
			title: 'Diabetes',
			icon: '/placeholder.svg?height=80&width=80',
		},
		{
			title: 'Heart',
			icon: '/placeholder.svg?height=80&width=80',
		},
		{
			title: 'Mental',
			icon: '/placeholder.svg?height=80&width=80',
		},
		{
			title: 'COVID-19',
			icon: '/placeholder.svg?height=80&width=80',
		},
		{
			title: 'Book a',
			icon: '/placeholder.svg?height=80&width=80',
		},
	];

	const handleCardClick = (disease) => {
		console.log(`Clicked on ${disease.title}`);
		// Add navigation or modal opening logic here
	};

	return (
		<div className="diseases-container">
			<h1 className="diseases-title">Diseases</h1>
			<div className="diseases-grid">
				{diseases.map((disease, index) => (
					<div
						key={index}
						className="disease-card"
						onClick={() => handleCardClick(disease)}
						role="button"
						tabIndex={0}
					>
						<h2 className="disease-title">{disease.title}</h2>
						<img src={disease.icon} alt={`${disease.title} icon`} className="disease-icon" />
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(Diseases);
