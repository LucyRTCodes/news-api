const {
	selectAllTopics,
	selectAllArticles,
	selectAllUsers,
	selectArticleById,
	selectCommentsById,
	insertCommentById,
	updateArticleById,
	removeCommentById,
	selectUserByUsername,
	insertArticle,
} = require("../models/app.models");
const endpoints = require("../endpoints.json");
const {
	checkArticles,
	checkComments,
	checkTopics,
	checkUsers,
} = require("../check-exists");

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

exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query;
	const promises = [selectAllArticles(sort_by, order, topic)];
	if (topic) promises.push(checkTopics(topic));
	Promise.all(promises)
		.then((articles) => {
			res.status(200).send({ articles: articles[0] });
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

exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	selectUserByUsername(username)
		.then((user) => {
			res.status(200).send({ user: user[0] });
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

exports.postArticle = (req, res, next) => {
	const { author, title, body, topic, article_img_url } = req.body;
	const promises = [
		insertArticle(author, title, body, topic, article_img_url),
		checkUsers(author),
		checkTopics(topic),
	];
	Promise.all(promises)
		.then((content) => {
			const article = content[0][0];
			res.status(201).send({ article });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	const promises = [
		updateArticleById(inc_votes, article_id),
		checkArticles(article_id),
	];
	Promise.all(promises)
		.then((content) => {
			const article = content[0][0];
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
