const db = require("./db/connection");

exports.checkArticles = (article_id) => {
	return db
		.query(
			`SELECT * 
			FROM articles 
			WHERE article_id = $1`,
			[article_id]
		)
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};

exports.checkComments = (comment_id) => {
	return db
		.query(
			`SELECT * 
			FROM articles 
			WHERE article_id = $1`,
			[comment_id]
		)
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};

exports.checkTopics = (topic) => {
	return db
		.query(
			`SELECT * 
			FROM topics 
			WHERE slug = $1`,
			[topic]
		)
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.reject({ status: 404, msg: "Not found" });
			return rows;
		});
};

exports.checkUsers = (username) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1`, [username])
		.then(({ rows }) => {
			if (!rows.length)
				return Promise.rejected({ status: 404, msg: "Not found" });
		});
};
