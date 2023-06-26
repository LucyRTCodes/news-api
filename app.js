const express = require("express");
const {
	getAllTopics,
	getArticleById,
} = require("./controllers/app.controller");

const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
	console.log(err);
});
module.exports = app;
