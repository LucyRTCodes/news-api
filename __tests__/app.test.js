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
	test("200: should return articles in ascending order if provided order query ascending", () => {
		return request(app)
			.get("/api/articles?order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("created_at", { descending: false });
			});
	});
	test("200: should return articles sorted by votes if provided sort_by votes query", () => {
		return request(app)
			.get("/api/articles?sort_by=votes")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("votes", { descending: true });
			});
	});
	test("200: should return articles sorted by votes ascending if provided sort_by votes and order ascending queries", () => {
		return request(app)
			.get("/api/articles?sort_by=votes&order=asc")
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy("votes", { descending: false });
			});
	});
	test("200: should return articles filtered by topic if provided topic query", () => {
		return request(app)
			.get("/api/articles?topic=mitch")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toHaveLength(12);
				articles.forEach((article) => {
					expect(article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: "mitch",
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(String),
					});
				});
			});
	});
	test("200: should return empty array if provided existing topic query with no associated articles", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toEqual([]);
			});
	});
	test("400: should return bad request if passed invalid sort_by value", () => {
		return request(app)
			.get("/api/articles?sort_by=carrots")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request if passed invalid order value", () => {
		return request(app)
			.get("/api/articles?order=carrots")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: should return bad request if passed non-existent topic", () => {
		return request(app)
			.get("/api/articles?topic=bananas")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("GET /api/users", () => {
	test("200: should return all users", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				expect(users).toBeInstanceOf(Array);
				expect(users).toHaveLength(4);
			});
	});
	test("200: should return all users with properties username, name, avatar_url", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				users.forEach((user) => {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
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
	test("200: should return article which article_id matches the article_id provided in the URL", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article.hasOwnProperty("comment_count")).toBe(true);
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

describe("GET /api/users/:username", () => {
	test("200: should return user whose username matches the username provided in the URL", () => {
		return request(app)
			.get("/api/users/butter_bridge")
			.expect(200)
			.then(({ body }) => {
				const { user } = body;
				expect(user).toMatchObject({
					username: "butter_bridge",
					name: "jonny",
					avatar_url:
						"https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
				});
			});
	});
	test("404: should return not found when provided username is valid but non-existent", () => {
		return request(app)
			.get("/api/users/butter_ridge")
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
	test("400: should return not found when provided article_id is not valid", () => {
		const newComment = { username: "rogersop", body: "Testing!" };
		return request(app)
			.post("/api/articles/three/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request when provided body is missing properties", () => {
		const newComment = { username: "rogersop" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: should return bad request when provided username is invalid", () => {
		const newComment = { username: 3, body: "Testing!" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: should return an error if passed non-existent username", () => {
		const newComment = { username: "rogersup", body: "Testing!" };
		return request(app)
			.post("/api/articles/1/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
	test("404: should return not found when provided article_id is non-existent", () => {
		const newComment = { username: "rogersop", body: "Testing!" };
		return request(app)
			.post("/api/articles/2000/comments")
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("POST /api/articles", () => {
	test("201: should add article", () => {
		const newArticle = {
			author: "rogersop",
			title: "cool article",
			body: "cool article body",
			topic: "cats",
			article_img_url:
				"https://www.shutterstock.com/shutterstock/photos/1842198919/display_1500/stock-photo-funny-large-longhair-gray-kitten-with-beautiful-big-green-eyes-lying-on-white-table-lovely-fluffy-1842198919.jpg",
		};
		return request(app)
			.post("/api/articles")
			.send(newArticle)
			.expect(201)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					article_id: expect.any(Number),
					author: "rogersop",
					title: "cool article",
					body: "cool article body",
					topic: "cats",
					votes: expect.any(Number),
					created_at: expect.any(String),
					article_img_url:
						"https://www.shutterstock.com/shutterstock/photos/1842198919/display_1500/stock-photo-funny-large-longhair-gray-kitten-with-beautiful-big-green-eyes-lying-on-white-table-lovely-fluffy-1842198919.jpg",
				});
			});
	});
	test("201: should default article_img_url if not provided", () => {
		const newArticle = {
			author: "rogersop",
			title: "cool article",
			body: "cool article body",
			topic: "cats",
		};
		return request(app)
			.post("/api/articles")
			.send(newArticle)
			.expect(201)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					article_id: expect.any(Number),
					author: "rogersop",
					title: "cool article",
					body: "cool article body",
					topic: "cats",
					votes: expect.any(Number),
					created_at: expect.any(String),
					article_img_url:
						"https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
				});
			});
	});
	test("400: should return bad request when provided body is missing properties", () => {
		const newArticle = { author: "rogersop" };
		return request(app)
			.post("/api/articles")
			.send(newArticle)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: should return an error if passed non-existent username", () => {
		const newArticle = {
			author: "banana",
			title: "cool article",
			body: "cool article body",
			topic: "cats",
		};
		return request(app)
			.post("/api/articles")
			.send(newArticle)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("PATCH	/api/articles/:article_id", () => {
	test("200: updates votes on specific article by amount specified", () => {
		const update = { inc_votes: 2 };
		return request(app)
			.patch("/api/articles/1")
			.send(update)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: 1,
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: 102,
					article_img_url: expect.any(String),
				});
			});
	});
	test("200: updates votes on specific article by amount specified", () => {
		const update = { inc_votes: -1 };
		return request(app)
			.patch("/api/articles/1")
			.send(update)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toMatchObject({
					author: expect.any(String),
					title: expect.any(String),
					article_id: 1,
					body: expect.any(String),
					topic: expect.any(String),
					created_at: expect.any(String),
					votes: 99,
					article_img_url: expect.any(String),
				});
			});
	});
	test("400: return bad request if provided vote increase is not a number", () => {
		const update = { inc_votes: "3 more please" };
		return request(app)
			.patch("/api/articles/1")
			.send(update)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: return bad request if provided invalid article_id", () => {
		const update = { inc_votes: 3 };
		return request(app)
			.patch("/api/articles/three")
			.send(update)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: return not found if provided non-existent article_id", () => {
		const update = { inc_votes: 3 };
		return request(app)
			.patch("/api/articles/4000")
			.send(update)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("PATCH	/api/comments/:comment_id", () => {
	test("200: updates votes on specific comment by amount specified", () => {
		const update = { inc_votes: 2 };
		return request(app)
			.patch("/api/comments/1")
			.send(update)
			.expect(200)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					comment_id: 1,
					body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
					votes: 18,
					author: "butter_bridge",
					article_id: 9,
					created_at: expect.any(String),
				});
			});
	});
	test("400: return bad request if provided vote increase is not a number", () => {
		const update = { inc_votes: "3 more please" };
		return request(app)
			.patch("/api/comments/1")
			.send(update)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("400: return bad request if provided invalid comment_id", () => {
		const update = { inc_votes: 3 };
		return request(app)
			.patch("/api/comments/three")
			.send(update)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	test("404: return not found if provided non-existent comment_id", () => {
		const update = { inc_votes: 3 };
		return request(app)
			.patch("/api/comments/4000")
			.send(update)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("204: should delete comment by specified comment_id", () => {
		return request(app).delete("/api/comments/1").expect(204);
	});
	test("404: should return not found if comment_id not found", () => {
		return request(app)
			.delete("/api/comments/10000")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
	test("400: should return bad request if comment_id not valid", () => {
		return request(app)
			.delete("/api/comments/ten")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});

describe("DELETE /api/articles/:article_id", () => {
	test("204: should delete article by specified article_id", () => {
		return request(app).delete("/api/articles/1").expect(204);
	});
	test("404: should return not found if article_id not found", () => {
		return request(app)
			.delete("/api/articles/10000")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not found");
			});
	});
	test("400: should return bad request if article_id not valid", () => {
		return request(app)
			.delete("/api/articles/ten")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});
