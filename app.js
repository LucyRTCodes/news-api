const express = require("express");
const {
	getApiEndpoints,
	getAllTopics,
	getAllArticles,
	getArticleById,
	getCommentsById,
	postCommentById,
} = require("./controllers/app.controller");
const { psqlError, customError, serverError } = require("./error-handlers");

const app = express();
app.use(express.json());

app.get("/api/", getApiEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);

app.use(psqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
