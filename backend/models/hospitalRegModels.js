const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	id: { type: String },
	hospitalName: { type: String, required: true },
	hospitalType: { type: String, required: true },
	googleMapsLink: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	state: { type: String, required: true },
	district: { type: String, required: true },
	address: { type: String, required: true },
	hospitalWebsite: { type: String, required: false },
	averageOPD: { type: Number, required: true },
	numberOfBeds: { type: Number, required: true },
	numberOfDoctors: { type: Number, required: true },
	departmentsAvailable: { type: Array, required: true },
	facilitiesAvailable: { type: Array, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	createdOn: { type: Date, required: true },
	lastLogin: { type: Date, required: false },
});

module.exports = mongoose.model("hospitalDetials", userSchema);
