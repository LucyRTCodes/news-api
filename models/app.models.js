const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllArticles = () => {
	return db.query(
		`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
			FROM articles
			FULL JOIN comments ON comments.article_id = articles.article_id
			GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
			ORDER BY articles.created_at DESC;`
	);
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
