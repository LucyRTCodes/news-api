const {
	checkExists,
	selectAllTopics,
	selectAllArticles,
	selectArticleById,
	selectCommentsById,
	insertCommentById,
	updateArticleById,
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
	const promises = [selectCommentsById(id), checkExists(id)];
	Promise.all(promises)
		.then((comments) => {
			res.status(200).send({ comments: comments[0] });
		})
		.catch(next);
};

exports.postCommentById = (req, res, next) => {
	const { article_id } = req.params;
	const comment = req.body;
	insertCommentById(article_id, comment)
		.then((newComment) => {
			res.status(201).send({ comment: newComment[0] });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	const id = req.params.article_id;
	const { inc_votes } = req.body;
	const promises = [checkExists(id), updateArticleById(inc_votes, id)];
	Promise.all(promises)
		.then((content) => {
			const article = content[1][0];
			res.status(200).send({ article });
		})
		.catch(next);
};
