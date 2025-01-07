import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiCall, extractEncryptedToken } from "../utils";
import ShowMsg from "../components/showMsg/ShowMsg";

import "../styles/userLogin.css";

const UserLogin = () => {
	const [msg, setMsg] = useState({ text: "", type: "" });

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
	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();
		const formData = {
			email: e.target.email.value,
			password: e.target.password.value,
		};

		const apiResp = await apiCall("user/signin", "post", formData);

		if (apiResp.statusCode === 200) {
			const extractedToken = extractEncryptedToken(apiResp.jwt);
			const userDetails = {
				type: "user",
				email: extractedToken?.email,
			};

			localStorage.setItem("user_details", JSON.stringify(userDetails));
			localStorage.setItem("JWT_token", apiResp.jwt);
			localStorage.setItem("login_info", apiResp.loginInfo);
			document.location.href = "/user-dashboard";
		} else {
			handleMsgShown(apiResp.msg, "error");
		}
	}, []);
	return (
		<div id="UserLogin">
			<div className="container">
				<h1>Login</h1>
				<form id="login-form" onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" required placeholder="Enter your email" />

					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" required placeholder="Enter your password" />

					<button type="submit">Login</button>
				</form>
				<button className="google-btn">
					<img
						src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
						loading="lazy"
						alt="Google"
						width="20px"
					/>
					Continue with Google
				</button>
				<div className="links">
					<NavLink to="/forgot-password">Forgot password?</NavLink>
					<NavLink to="/register">Don't have an account? Sign up</NavLink>
				</div>
			</div>
			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</div>
	);
};

export default UserLogin;
