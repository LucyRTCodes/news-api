const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	return db.end();
});

describe("GET /api/topics", () => {
	test("200: should return all topics from topics table", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				const { topics } = body;
				expect(topics).toBeInstanceOf(Array);
				expect(topics.length).toBe(3);
				body.topics.forEach((topic) => {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});

describe("GET /api/", () => {
	test("200: should return all endpoints", () => {
		return request(app)
			.get("/api/")
			.expect(200)
			.then(({ body }) => {
				const { endpoints } = body;
				expect(endpoints).toBeInstanceOf(Object);
				expect(endpoints).toMatchObject(endpointsJSON);
			});
	});
});

describe("GET /api/articles", () => {
	test("200: should return all articles from articles table", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toBeInstanceOf(Array);
				expect(articles.length).toBe(13);
			});
	});
	test("200: should return all articles with author, title, article_id, topic, date, votes, image and comment_count ordered by date descending", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toBeSortedBy("created_at", { descending: true });
				body.articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
					expect(article.hasOwnProperty(body)).toBe(false);
				});
			});
	});
});

describe("GET /api/articles/:article_id", () => {
	test("200: should return article which article_id matches the article_id provided in the URL", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: 1,
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					article_img_url: expect.any(String),
				});
			});
	});
	test("400: should return not found when provided article_id is not valid", () => {
		return request(app)
			.get("/api/articles/three")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: should return not found when provided article_id is valid but non-existent", () => {
		return request(app)
			.get("/api/articles/2000")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("GET /api/articles/:article_id/comments", () => {
	test("200: should return all comments for article specified by article_id", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toBeInstanceOf(Array);
				expect(comments).toHaveLength(11);
			});
	});
	test("200: should return all comments with comment_id, votes,created_at, author, body, article_id", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toBeSortedBy("created_at", { descending: true });
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: 1,
					});
				});
			});
	});
	test("200: should return an empty array if no comments for associated article", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toEqual([]);
			});
	});
	test("400: should return not found when provided article_id is not valid", () => {
		return request(app)
			.get("/api/articles/three/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: should return not found when provided article_id is valid but non-existent", () => {
		return request(app)
			.get("/api/articles/2000/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	test("201: should add comment to relavent article", () => {
		const newComment = { username: "rogersop", body: "Testing!" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					article_id: 1,
					author: "rogersop",
					body: "Testing!",
					comment_id: expect.any(Number),
					created_at: expect.any(String),
					votes: expect.any(Number),
				});
			});
	});
	test("201: should ignore additional properties", () => {
		const newComment = {
			username: "rogersop",
			body: "Testing!",
			comment_name: "test comment",
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					article_id: 1,
					author: "rogersop",
					body: "Testing!",
					comment_id: expect.any(Number),
					created_at: expect.any(String),
					votes: expect.any(Number),
				});
			});
	});
	test("400: should return an error if passed invalid username", () => {
		const newComment = { username: "rogersup", body: "Testing!" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return not found when provided article_id is not valid", () => {
		const newComment = { username: "rogersup", body: "Testing!" };
		return request(app)
			.post("/api/articles/three/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request when provided body is missing properties", () => {
		const newComment = { username: "rogersup" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request when provided article_id is non-existent", () => {
		const newComment = { username: "rogersup", body: "Testing!" };
		return request(app)
			.post("/api/articles/2000/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request when provided username is invalid", () => {
		const newComment = { username: 3, body: "Testing!" };
		return request(app)
			.post("/api/articles/2000/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});
