const express = require("express");
const {
	getApiEndpoints,
	getAllTopics,
	getAllArticles,
	getArticleById,
	getCommentsById,
	postCommentById,
} = require("./controllers/app.controller");

const app = express();
app.use(express.json());

app.get("/api/", getApiEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);

app.use((err, req, res, next) => {
	if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
		res.status(400).send({ msg: "Bad request" });
	} else if (err.msg && err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		console.log(err);
		res.status(500).send({ msg: "Internal server error" });
	}
});
module.exports = app;
