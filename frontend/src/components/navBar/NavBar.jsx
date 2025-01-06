import { useState, memo } from "react";
import "./NavBar.css"; // Assuming you have a CSS file for styling

import { NavLink, useNavigate } from "react-router-dom";
import { extractEncryptedToken, userDeviceType } from "../../utils";
import MenuBar from "../menuBar/MenuBar";

import brandLogo from "../../assets/brandLogo.png";
import searchIcon from "../../assets/icons/search.svg";
import profileIcon from "../../assets/icons/profile.svg";
import menuIcon from "../../assets/icons/menu.svg";

const userLoggedIn = localStorage.getItem("JWT_token");

const userEmail = extractEncryptedToken(userLoggedIn)?.email;

const menuItems = [
	{
		name: "Medicine",
		path: "/medicine",
	},
	{
		name: "Prescription Explainer",
		path: "/prescription_Explainer",
	},
	{
		name: "Price Comp.",
		path: "/price-comparison",
	},
	{
		name: "Diseases",
		path: "/diseases",
	},
];

const NabBar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuName = location.pathname?.split("/")[1] || "/";

	const navigate = useNavigate();
	// const [isLogged, setIsLogged] = useState(!!userEmail);

	// const handleSignInOut = () => {
	// 	localStorage.removeItem('JWT_token');
	// 	localStorage.removeItem('user_details');
	// 	localStorage.removeItem('login_info');

	// 	if (userEmail) {
	// 		localStorage.removeItem('JWT_token');
	// 		localStorage.removeItem('user_details');
	// 		localStorage.removeItem('login_info');
	// 		navigate('/');
	// 		setIsLogged(false);
	// 	} else {
	// 		navigate('/');
	// 	}
	// };

	return (
		<nav>
			{userDeviceType().mobile ? (
				<MobileNavBar
					navigate={navigate}
					menuName={menuName}
					isMenuOpen={isMenuOpen}
					setIsMenuOpen={setIsMenuOpen}
				/>
			) : (
				<DesktopNavBar />
			)}
		</nav>
	);
};

function DesktopNavBar() {
	return (
		<>
			<div className="nav-links">
				<NavLink className="nav-logo" to="/">
					<img src={brandLogo} alt="Logo" />
				</NavLink>

				{menuItems.map(({ name, path }, index) => (
					<NavLink key={index} to={path}>
						{name}
					</NavLink>
				))}
			</div>
			<div className="nav-links_2">
				<NavLink className="nav-icon" to="/">
					<img src={searchIcon} alt="sogo" />
				</NavLink>
				<NavLink className="nav-icon" to="/">
					<img src={profileIcon} alt="Logo" />
				</NavLink>
			</div>
		</>
	);
}

function MobileNavBar({ navigate, menuName, isMenuOpen, setIsMenuOpen }) {
	return (
		<>
			<div className="phone-nav-links">
				<div className="menuIcon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<img src={menuIcon} alt="Menu" />
				</div>
				<NavLink className="nav-logo phoneBrandLogo" to="/">
					<img src={brandLogo} alt="Logo" />
					Niraksh
				</NavLink>

				<NavLink className="nav-icon" to="/">
					<img src={profileIcon} alt="Logo" />
				</NavLink>
			</div>
			<MenuBar
				menuItems={menuItems}
				navigate={navigate}
				menuName={menuName}
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
			/>
		</>
	);
}

export default memo(NabBar);
