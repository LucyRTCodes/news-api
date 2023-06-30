const express = require("express");
const {
	getApiEndpoints,
	getAllTopics,
	getAllArticles,
	getAllUsers,
	getArticleById,
	getCommentsById,
	postCommentById,
	patchArticleById,
	deleteCommentById,
	getUserByUsername,
	postArticle,
	patchCommentById,
} = require("./controllers/app.controller");
const { psqlError, customError, serverError } = require("./error-handlers");

const app = express();
app.use(express.json());

app.get("/api/", getApiEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUserByUsername);

app.post("/api/articles/:article_id/comments", postCommentById);
app.post("/api/articles", postArticle);

app.patch("/api/articles/:article_id", patchArticleById);
app.patch("/api/comments/:comment_id", patchCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(psqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
