const db = require("../db/connection");

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
			GROUP BY comments.article_id`
		)
		.then(({ rows }) => {
			console.log(rows);
			return rows;
		});
};
