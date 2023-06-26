const { selectAllTopics } = require("../models/app.models");

exports.getAllTopics = (_, res) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			console.log(err);
		});
};
