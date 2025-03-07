// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

// const apiBaseUrl = 'https://bhemu-notes-api.onrender.com/';
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/';

// variables for setting cookie expiratiom tym
const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + COOKIE_EXPIRATION_MINS * 60 * 1000);


async function apiCall(endpoint, method = 'GET', body = null, file = false) {
	const apiUrl = apiBaseUrl + endpoint;
	const authorization = localStorage.getItem('JWT_token');

	const headers = {
		Authorization: `Bearer ${authorization}`,
	};

	if (!file && body) {
		headers['Content-Type'] = 'application/json';
	}

	try {
		const response = await fetch(apiUrl, {
			method,
			headers,
			body: file ? body : body ? JSON.stringify(body) : null,
		});

		const statusCode = response.status;
		const data = await response.json();

		return { data, statusCode };
	} catch (error) {
		console.error("Error in apiCall:", error);
		return { msg: 'Something went wrong', statusCode: 500 };
	}
}


function extractEncryptedToken(token) {
	try {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (err) {
		console.log(err);
	}
}

// function getLoggedUserId() {
// 	try {
// 		const myUserId = cookies.get('userId');
// 		if (myUserId) {
// 			return myUserId;
// 		}
// 	} catch {}

// 	return null;
// }

// function setLoggedUserId(userId) {
// 	try {
// 		cookies.set('userId', userId, {
// 			path: '/',
// 			expires: COOKIE_EXPIRATION_TIME,
// 		});
// 	} catch {}
// }

// function validateUsername(name) {
//     var re = /^[a-zA-Z0-9_]*$/;
//     return re.test(name);
// }

function userDeviceType() {
	const { innerWidth: width, innerHeight: height } = window;
	if (width > 900) {
		return { mobile: false, desktop: true, width, height };
	} else {
		return { mobile: true, desktop: false, width, height };
	}
}

export { apiCall, extractEncryptedToken, userDeviceType };
