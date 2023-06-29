const db = require("../db/connection");

exports.checkExists = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllArticles = () => {
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
			FROM articles
			FULL JOIN comments ON comments.article_id = articles.article_id
			GROUP BY articles.article_id
			ORDER BY articles.created_at DESC;`
		)
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};
exports.selectArticleById = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};

exports.selectCommentsById = (id) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
			[id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.insertCommentById = (article_id, comment) => {
	const { username, body } = comment;
	if (typeof username !== "string" || typeof body !== "string")
		return Promise.reject({ status: 400, msg: "Bad request" });
	return db
		.query(
			`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
			[username, body, article_id]
		)
		.then(({ rows }) => {
			return rows;
		});
};
