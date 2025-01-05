import React, { useCallback, useState } from 'react';

import '../styles/hospitalLogin.css';
import { NavLink } from 'react-router-dom';
import { apiCall, extractEncryptedToken } from '../utils';
import ShowMsg from '../components/showMsg/ShowMsg';

const HospitalLogin = () => {
	const [msg, setMsg] = useState({ text: '', type: '' });

	const handleMsgShown = useCallback((msgText, type) => {
		if (msgText) {
			setMsg({ text: msgText, type: type });
			setTimeout(() => {
				setMsg({ text: '', type: '' });
			}, 2500);
		} else {
			console.log('Please Provide Text Msg');
		}
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const formData = {
				username: e.target.username.value,
				password: e.target.password.value,
			};
			console.log(formData);
			const apiResp = await apiCall('hospital/signin', 'post', formData);

			if (apiResp.statusCode === 200) {
				const extractedToken = extractEncryptedToken(apiResp.jwt);
				const userDetails = {
					type: 'hospital',
					email: extractedToken?.email,
				};

				localStorage.setItem('user_details', JSON.stringify(userDetails));
				localStorage.setItem('JWT_token', apiResp.jwt);
				localStorage.setItem('login_info', apiResp.loginInfo);
				document.location.href = '/hospital-dashboard';
			} else {
				handleMsgShown(apiResp.msg, 'error');
			}
		},
		[handleMsgShown]
	);
	return (
		<div id="HospitalLogin">
			<div className="hospitalLogin_container">
				<h1>Hospital Login</h1>
				<form id="login-form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						required
						placeholder="Enter your username or email"
					/>

					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						minLength="8"
						required
						placeholder="Enter your password"
					/>

					<button type="submit">Login</button>
				</form>
				<div className="links">
					<NavLink to="#">Forgot password?</NavLink>
					<NavLink to="/hospital-registration">New Hospital? Register here</NavLink>
				</div>
			</div>
			{msg && <ShowMsg msgText={msg?.text} type={msg?.type} />}
		</div>
	);
};

export default HospitalLogin;
