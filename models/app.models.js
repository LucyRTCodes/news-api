const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleById = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then(({ rows }) => {
			return rows;
		});
};
