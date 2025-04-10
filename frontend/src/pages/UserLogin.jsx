import { useCallback, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { apiCall, extractEncryptedToken } from "../utils";
import { useAuthContext } from "../contexts/AuthContext";
import ShowMsg from "../components/showMsg/ShowMsg";

import "../styles/userLogin.css";

const UserLogin = () => {
	const [msg, setMsg] = useState({ text: "", type: "" });
	const [googleLoading, setGoogleLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated, checkAuthStatus } = useAuthContext();

	useEffect(() => {
		// If user is already logged in, redirect to requested page or home
		if (isAuthenticated) {
			const destination = location.state?.from?.pathname || "/";
			navigate(destination, { replace: true });
		}

		// Show message if redirected from a protected route
		if (location.state?.message) {
			handleMsgShown(location.state.message, "info");
		}
	}, [isAuthenticated, location, navigate]);

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

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const formData = {
				email: e.target.email.value,
				password: e.target.password.value,
			};

			try {
				const apiResp = await apiCall("user/signin", "post", formData);
				console.log("Login response:", apiResp);

				if (apiResp?.data?.statusCode === 200 && apiResp?.data?.jwt) {
					const extractedToken = extractEncryptedToken(apiResp.data.jwt);
					const userDetails = {
						type: "user",
						email: extractedToken?.email,
						userId: extractedToken?.userId,
					};

					localStorage.setItem("user_details", JSON.stringify(userDetails));
					localStorage.setItem("JWT_token", apiResp.data.jwt);
					localStorage.setItem("refresh_token", apiResp.data.refreshToken);
					localStorage.setItem("loginInfo", apiResp.data.loginInfo);

					console.log("Tokens stored successfully");

					// Refresh auth state
					checkAuthStatus();

					// Redirect to the page they were trying to access or home
					const destination = location.state?.from?.pathname || "/";
					navigate(destination, { replace: true });
				} else {
					handleMsgShown(apiResp?.data?.msg || "Login failed", "error");
				}
			} catch (error) {
				console.error("Login error:", error);
				handleMsgShown("Something went wrong during login", "error");
			}
		},
		[handleMsgShown, location, navigate, checkAuthStatus]
	);

	const handleGoogleLogin = useCallback(async () => {
		setGoogleLoading(true);
		// This is just a placeholder for Google OAuth integration
		// You would need to implement the actual Google OAuth flow here
		try {
			// Mock Google OAuth response for now
			const mockGoogleToken = "google_oauth_token";

			const apiResp = await apiCall("user/signin/google", "post", { googleAccessToken: mockGoogleToken });
			console.log("Google login response:", apiResp);

			if (apiResp?.data?.statusCode === 200 && apiResp?.data?.jwt) {
				const extractedToken = extractEncryptedToken(apiResp.data.jwt);

				const userDetails = {
					type: "user",
					email: extractedToken?.email,
					userId: extractedToken?.userId,
					firstName: apiResp.data?.details?.firstName,
					lastName: apiResp.data?.details?.lastName,
					profilePicture: apiResp.data?.details?.profilePicture,
				};

				localStorage.setItem("user_details", JSON.stringify(userDetails));
				localStorage.setItem("JWT_token", apiResp.data.jwt);
				localStorage.setItem("refresh_token", apiResp.data.refreshToken);
				localStorage.setItem("loginInfo", apiResp.data.loginInfo);

				console.log("Google login successful!");

				// Refresh auth state
				checkAuthStatus();

				// Redirect to the page they were trying to access or home
				const destination = location.state?.from?.pathname || "/";
				navigate(destination, { replace: true });
			} else {
				handleMsgShown(apiResp?.data?.msg || "Google login failed", "error");
			}
		} catch (error) {
			console.error("Google login error:", error);
			handleMsgShown("Something went wrong during Google login", "error");
		} finally {
			setGoogleLoading(false);
		}
	}, [handleMsgShown, location, navigate, checkAuthStatus]);

	return (
		<div id="UserLogin">
			<div className="container">
				<h1>Login</h1>
				{location.state?.message && <div className="login-message">{location.state.message}</div>}
				<form id="login-form" onSubmit={handleSubmit}>
					<label htmlFor="email">Email</label>
					<input type="email" id="email" name="email" required placeholder="Enter your email" />

					<label htmlFor="password">Password</label>
					<input type="password" id="password" name="password" required placeholder="Enter your password" />

					<button type="submit">Login</button>
				</form>
				<button className="google-btn" onClick={handleGoogleLogin} disabled={googleLoading}>
					<img
						src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
						loading="lazy"
						alt="Google"
						width="20px"
					/>
					{googleLoading ? "Connecting..." : "Continue with Google"}
				</button>
				<div className="links">
					<NavLink to="/forgot-password">Forgot password?</NavLink>
					<NavLink to="/register">Don&apos;t have an account? Sign up</NavLink>
				</div>
			</div>
			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</div>
	);
};

export default UserLogin;
