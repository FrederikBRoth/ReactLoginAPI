const router = require("express").Router();
const sessionvalid = require("./sessionvalid");

router.get("/", sessionvalid, (req, res, next) => {
	res.json({
		test: {
			title: "Fuck you",
			description: "random data mother fuckeeeeer",
			session: req.session
		}
	});
});
module.exports = router;
