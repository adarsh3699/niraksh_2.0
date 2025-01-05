const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { JWT_SECRET, md5Hash, sendMail, encryptText, decryptText, createTokens } = require("../utils");
const HospitalRegModels = require("../models/hospitalRegModels");

const router = express.Router();
const app = express();

router.get("/", (req, res) => {
	res.send("Hello hospital");
});

// normal-auth
router.post("/signin", async (req, res) => {
	const username = req.body?.username?.trim();
	const password = req.body?.password?.trim();

	if (!username || !password) return res.status(400).json({ statusCode: 400, msg: "Invalid field!" });
	try {
		const existingUser = await HospitalRegModels.findOne({ username });

		if (!existingUser) {
			return res.status(404).json({ statusCode: 404, msg: "Hospital don't exist!" });
		}

		const encryptedPassword = md5Hash(password);

		if (encryptedPassword !== existingUser.password) {
			return res.status(400).json({ statusCode: 400, msg: "Invalid credintials!" });
		}

		const token = createTokens({
			userId: existingUser._id,
			email: existingUser.email,
			username: username,
			type: "hospital",
		});
		const loginInfo = createTokens({
			verified: existingUser?.verified,
			linkWithGoogle: existingUser?.linkWithGoogle,
			linkWithPassword: existingUser?.linkWithPassword,
		});

		res.status(200).json({
			statusCode: 200,
			jwt: token,
			loginInfo,
			msg: "Login Successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: "Something went wrong!" });
	}
});

// create new User
router.post("/signup", async (req, res) => {
	try {
		const {
			hospitalName,
			hospitalType,
			googleMapsLink,
			email,
			phone,
			state,
			district,
			address,
			hospitalWebsite,
			averageOPD,
			numberOfBeds,
			numberOfDoctors,
			departmentsAvailable,
			facilitiesAvailable,
			username,
			password,
		} = req.body;

		const createdOn = new Date(Date.now());
		console.log(email);

		if (
			!hospitalName ||
			!hospitalType ||
			!googleMapsLink ||
			!email ||
			!phone ||
			!state ||
			!district ||
			!address ||
			!hospitalWebsite ||
			!averageOPD ||
			!numberOfBeds ||
			!numberOfDoctors ||
			!departmentsAvailable ||
			!facilitiesAvailable ||
			!username ||
			!password
		)
			return res.status(400).json({
				statusCode: 400,
				msg: "Please Provide all Details",
			});

		if (password.length < 8)
			return res.status(400).json({
				statusCode: 400,
				msg: "Password must be at least 8 characters",
			});

		const existingUser = await HospitalRegModels.findOne({ username });

		if (existingUser) return res.status(400).json({ statusCode: 400, msg: "Hospital already exist!" });

		const hashedPassword = md5Hash(password);

		const result = await HospitalRegModels.create({
			...req.body,
			password: hashedPassword,
			createdOn,
		});

		res.status(200).json({ statusCode: 200, msg: "Successfully Created" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: "Something went wrong!" });
	}
});

router.post("/forget_password", function (req, res) {
	const email = req.body.email ? req.body.email.trim() : req.body.email;
	try {
		if (email) {
			let toSend = {};
			const otp = Math.floor(1000 + Math.random() * 9000);

			sendMail(email, "Forgot Password", "Your OTP is", otp);
			toSend.statusCode = 200;
			toSend.msg = "OTP sent successfully";
			toSend.otp = encryptText(otp + "");

			res.status(toSend.statusCode);
			res.send(toSend);
		} else {
			res.status(400);
			res.send({ statusCode: 400, msg: "Please Enter Your Email" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: "Something went wrong!" });
	}
});

router.post("/change_password", async function (req, res) {
	const email = req.body.email ? req.body.email.trim() : req.body.email;
	const password = req.body.password ? req.body.password.trim() : req.body.password;
	const otp = req.body.otp ? req.body.otp.trim() : req.body.otp;
	const encryptedOtp = decryptText(req.body.encryptedOtp);

	try {
		if (email && req.body.password && otp && req.body.encryptedOtp) {
			if (otp == encryptedOtp) {
				const encryptedPassword = md5Hash(password);

				const queryResp = await HospitalRegModels.updateOne(
					{ email },
					{ $set: { password: encryptedPassword } }
				);

				let toSend = {};
				toSend.statusCode = 200;
				toSend.msg = "Password updated successfully";
				res.status(toSend.statusCode);
				res.send(toSend);
			} else {
				res.status(400);
				res.send({ statusCode: 400, msg: "OTP do not match" });
			}
		} else {
			res.status(400);
			res.send({ statusCode: 400, msg: "Please provide all details" });
		}
	} catch (e) {
		res.status(500);
		res.send({
			statusCode: 500,
			msg: "Something went wrong",
			error: e.message,
		});
	}
});

module.exports = router;
