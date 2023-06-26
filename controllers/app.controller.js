const { getAllEndpoints, selectAllTopics } = require("../models/app.models");

exports.getApiEndpoints = (_, res) => {
	getAllEndpoints().then((endpoints) => {
		res.status(200).send({ endpoints: JSON.parse(endpoints) });
	});
};

exports.getAllTopics = (_, res) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			console.log(err);
		});
};
