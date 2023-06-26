const { getAllEndpoints, selectAllTopics } = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getApiEndpoints = (_, res) => {
	res.status(200).send({ endpoints });
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
