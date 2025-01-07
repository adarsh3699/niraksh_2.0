import { memo } from "react";
import "./heroSection.css";

import professional from "../../../assets/professionalImg.svg";
import captureIcon from "../../../assets/icons/capture.svg";

const HeroSection = () => {
	return (
		<div className="hero-section">
			<div className="text-content">
				<h1 className="hero-title">
					Find <span className="emergency-call">detailed information</span> about your medicines
				</h1>
				<p className="hero_desc">Search for medicines by name, brand or active</p>
				<form className="searchArea">
					<div className="searchbar">
						<input type="text" placeholder="Search for medicines" />
						<img src={captureIcon} className="captureBtn" loading="lazy" alt="Capture Icon" />
					</div>
					<button className="searchBtn">Search</button>
				</form>
			</div>
			{/* <div className="image-content"> */}
			<img src={professional} className="professional_image" loading="lazy" alt="Medical professionals" />
			{/* </div> */}
		</div>
	);
};

export default memo(HeroSection);
