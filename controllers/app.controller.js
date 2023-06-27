const {
	selectAllTopics,
	selectAllArticles,
	selectArticleById,
	selectCommentsById,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getApiEndpoints = (_, res) => {
	res.status(200).send({ endpoints });
};

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
			res.status(200).send({ articles });
		})
		.catch(next);
};
exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;
	selectArticleById(id)
		.then((article) => {
			res.status(200).send({ article: article[0] });
		})
		.catch(next);
};

exports.getCommentsById = (req, res, next) => {
	const id = req.params.article_id;
	selectCommentsById(id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
