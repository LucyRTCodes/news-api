const { selectAllTopics, selectAllArticles } = require("../models/app.models");

exports.getAllTopics = (_, res, next) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

exports.getAllArticles = (_, res, next) => {
	selectAllArticles()
		.then((articles) => {
			console.log(articles);
			res.status(200).send({ articles });
		})
		.catch(next);
};
