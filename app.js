const express = require("express");
const {
	getAllTopics,
	getAllArticles,
} = require("./controllers/app.controller");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad request" });
	} else if (err.msg && err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({ msg: "Internal server error" });
	}
});

module.exports = app;
