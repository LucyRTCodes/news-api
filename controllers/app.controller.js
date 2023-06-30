const {
	selectAllTopics,
	selectAllArticles,
	selectAllUsers,
	selectArticleById,
	selectCommentsById,
	insertCommentById,
	updateArticleById,
	removeCommentById,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");
const { checkArticles, checkComments } = require("../check-exists");

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

exports.getAllUsers = (_, res, next) => {
	selectAllUsers().then((users) => {
		res.status(200).send({ users });
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

exports.getCommentsById = (req, res, next) => {
	const { article_id } = req.params;
	const promises = [selectCommentsById(article_id), checkArticles(article_id)];
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
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	const promises = [
		checkArticles(article_id),
		updateArticleById(inc_votes, article_id),
	];
	Promise.all(promises)
		.then((content) => {
			const article = content[1][0];
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const promises = [removeCommentById(comment_id), checkComments(comment_id)];
	Promise.all(promises)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
