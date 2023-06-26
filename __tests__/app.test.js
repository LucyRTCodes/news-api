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
