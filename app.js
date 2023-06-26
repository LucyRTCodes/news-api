const express = require("express");
const {
	getApiEndpoints,
	getAllTopics,
} = require("./controllers/app.controller");

const app = express();

app.get("/api/", getApiEndpoints);
app.get("/api/topics", getAllTopics);

module.exports = app;
