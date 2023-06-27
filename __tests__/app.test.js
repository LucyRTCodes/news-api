const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

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
