const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (_, res) => {
	console.log("controller");
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			console.log(err);
		});
};
