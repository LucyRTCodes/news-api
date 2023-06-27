const {
	selectAllTopics,
	selectAllArticles,
	selectArticleById,
} = require("../models/app.models");

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
