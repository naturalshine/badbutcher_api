const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

/* Dropping the database and closing connection after each test. */
afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

/* Testing the API endpoints. */
describe("POST /api/slaughtered", () => {
    it("should create a slaughtered", async () => {
      const res = await request(app).post("/api/slaughtered").send({
        name: "img2",
        description: "description",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("img2");
    });
  });
  
describe("GET /api/slaughtered", () => {
  it("should return all slaughtered", async () => {
    const res = await request(app).get("/api/slaughtered");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/slaughtered/:id", () => {
  it("should return a slaughtered", async () => {
    const res = await request(app).get(
      "/api/slaughtered/63c3e58eaef3dd30df8b8ff3"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("img1");
  });
});


describe("PUT /api/slaughtered/:id", () => {
  it("should update a slaughtered", async () => {
    const res = await request(app)
      .patch("/api/slaughtered/63c3e58eaef3dd30df8b8ff3")
      .send({
        name: "Product 4",
        description: "Description 4",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Description 4");
  });
});

describe("DELETE /api/slaughtered/:id", () => {
  it("should delete a slaughtered", async () => {
    const res = await request(app).delete(
      "/api/slaughtered/63c3e58eaef3dd30df8b8ff3"
    );
    expect(res.statusCode).toBe(200);
  });
});

describe("BUTCHER /api/butcher", () => {
    it("it should butcher", async () => {
        const res = await request(app).post("/api/butcher").send({
          name: "Product 2",
          description: "Description 2",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Product 2");
      });
  });

