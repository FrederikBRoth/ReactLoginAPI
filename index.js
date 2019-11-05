const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
//Route
const authRoute = require("./routes/auth");
const testRoute = require("./routes/test");

//DB Connect
mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to DB");
	}
);

//Middlewares

//fucking cors bullshit fix
app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: "federico123",
		resave: false,
		saveUninitialized: true
	})
);
app.use("/api/user", authRoute);
app.use("/api/test", testRoute);

app.get("/api/", (req, res) => {
	res.send({
		user: req.session.user,
		isloggedin: req.session.loggedIn
	});
});

app.get("/api/test123", (req, res) => {
	res.send(req.session.views);
});

app.listen(3000, "localhost");
