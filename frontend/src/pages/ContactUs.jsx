import React from 'react';
import '../styles/contactUs.css';

const ContactUs = () => {
	return (
		<div id="contactUs">
			<div className="container">
				<h1>Contact Us</h1>
				<p>We're here to assist you 24 x 7! Reach out for any queries or support.</p>
				<p>Email: support@niraksh.com</p>
				<p>Phone: +91-98345-67890</p>
				<div className="connect-with-us">
					<p>Connect with us:</p>
					<ul>
						<li>Instagram: @nirakshhealth</li>
						<li>Twitter: @nirakshhealth</li>
						<li>Facebook: Niraksh Health Solutions</li>
					</ul>
				</div>
				<p>Join us online for the latest updates, health tips, and more!</p>
			</div>
		</div>
	);
};

export default ContactUs;
