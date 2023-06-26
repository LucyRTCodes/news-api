const db = require("../db/connection");
const fs = require("fs/promises");
exports.getAllEndpoints = () => {
	return fs
		.readFile(`${__dirname}/../endpoints.json`, "utf-8")
		.then((contents) => {
			return contents;
		});
};

exports.selectAllTopics = () => {
	return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
		return rows;
	});
};
