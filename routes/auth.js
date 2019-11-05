const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Chatkit = require("@pusher/chatkit-server");
const { registerValidation, loginValidation } = require("../validation");

//constawdawd
const chatkit = new Chatkit.default({
	instanceLocator: process.env.INSTANCE_LOCATOR,
	key: process.env.SECRET_KEY
});

router.post("/register", async (req, res) => {
	//Validation of input
	const { error } = registerValidation(req.body);
	if (error) {
		res.statusMessage = error.details[0].message;
		return res.status(400).end();
	}

	//Checking if user is already in the database
	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists) {
		res.statusMessage = "Email already exists!";
		res.status(400).end();
	}

	//Hash password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	//Creation of user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword
	});
	chatkit
		.createUser({
			id: req.body.email,
			name: req.body.name
		})
		.then(() => {
			console.log("Created user!");
		});
	try {
		const savedUser = await user.save();
		res.send(savedUser);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	//Validate input
	console.log(req.body);
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//check if email is a user
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		res.statusMessage = "Email not in the system!";
		return res.status(400).end();
	}
	//check if password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		res.statusMessage = "Invalid password";
		return res.status(400).end();
	}

	//sets user to session
	req.session.user = {
		email: req.body.email
	};
	req.session.loggedIn = true;
	res.send({ user: req.session.user.email });
});

router.get("/logout", async (req, res) => {
	req.session.loggedIn = false;
	res.send("Logged out");
});

router.get("/loginstatus", async (req, res) => {
	if (req.session.user == null) return res.send({ loggedIn: false });
	res.send({
		email: req.session.user.email,
		loggedIn: req.session.loggedIn
	});
});

module.exports = router;
