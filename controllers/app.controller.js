const { selectAllTopics, selectArticleById } = require("../models/app.models");

exports.getAllTopics = (_, res) => {
	selectAllTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;
	selectArticleById(id)
		.then((article) => {
			res.status(200).send({ article: article[0] });
		})
		.catch(next);
};
