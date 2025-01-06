import React from 'react';
import '../styles/aboutUs.css';
import aboutpic from '../imgs/doctor-online-service-platform-healthcare-modern-medicine-treatment-analysis-diagnosis-emergency-call-isolated-vector-illustration_613284-1170-removebg-preview.png';
const AboutUs = () => {
	return (
		<div id="aboutUs">
			<h1>ABOUT US</h1>
			<div className="content">
				<div className="text">
					<p>
						At Niraksh, we offer a real-time prediction system that enables patients and bystanders to
						quickly locate available hospital beds.
					</p>
					<p>
						By utilizing AI-driven models, we predict bed availability at nearby hospitals, minimizing the
						time spent searching for care during emergencies. For hospitals, our platform helps optimize
						patient flow, alleviating overcrowding and reducing wait times.
					</p>
					<p>
						Our mission is to make healthcare more accessible by eliminating delays and ensuring timely care
						for every patient.
					</p>
				</div>
				<div className="image">
					<img src={aboutpic} alt="Healthcare Illustration" />
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
