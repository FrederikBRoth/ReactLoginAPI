const session = require("express-session");
const parseurl = require("parseurl");

module.exports = function(req, res, next) {
	console.log();
	if (!req.session.loggedIn) {
		req.session.loggedIn = {};
	}
	console.log(req.session);
	if (req.session.loggedIn === true) {
		next();
	} else {
		return res.status(403).send("Not Authorized");
	}
};
