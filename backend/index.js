const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { getMongoDb } = require("./utils");

const UserReg = require("./routes/UserReg");
const HospitalReg = require("./routes/HospitalReg");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", UserReg);
app.use("/hospital", HospitalReg);

const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
	res.send("Hello World");
});

mongoose
	.connect(getMongoDb()) // No options are required for modern versions
	.then(() =>
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT}`);
		})
	)
	.catch((err) => {
		console.log(err);
	});
