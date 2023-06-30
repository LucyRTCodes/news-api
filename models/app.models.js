const { checkTopics } = require("../check-exists");
const db = require("../db/connection");

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
	const greenList = ["created_at", "votes", "desc", "asc"];
	if (!greenList.includes(sort_by) || !greenList.includes(order))
		return Promise.reject({ status: 400, msg: "Bad request" });
	const values = [];
	let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
			FROM articles
			FULL JOIN comments ON comments.article_id = articles.article_id `;

	if (topic) {
		query += `WHERE articles.topic = $1 `;
		values.push(topic);
	}

	query += `
			GROUP BY articles.article_id
			ORDER BY ${sort_by} ${order};`;

	return db.query(query, values).then(({ rows }) => {
		return rows;
	});
};

exports.selectAllUsers = () => {
	return db
		.query(`SELECT username, name, avatar_url FROM users;`)
		.then(({ rows }) => {
			return rows;
		});
};

exports.selectArticleById = (id) => {
	return db
		.query(
			`SELECT articles.*, COUNT(comments.article_id) AS comment_count
		FROM articles
		FULL JOIN comments ON comments.article_id = articles.article_id 
		WHERE articles.article_id = $1
		GROUP BY articles.article_id`,
			[id]
		)
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

exports.updateArticleById = (inc_votes, id) => {
	return db
		.query(
			`UPDATE articles
				SET votes = votes + $1
				WHERE article_id = $2
				RETURNING *`,
			[inc_votes, id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.removeCommentById = (id) => {
	return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
};
