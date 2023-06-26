const db = require("../db/connection");

exports.selectAllTopics = () => {
	console.log("model");
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};
