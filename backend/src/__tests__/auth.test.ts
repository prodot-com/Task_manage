import request from "supertest";
import app from "../index.js"; // Adjust path to your Express app entry point
import prisma from "../prisma.js";

describe("Auth Controller", () => {
  // Clear database before tests
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  const testUser = {
    userName: "testuser",
    password: "password123"
  };

  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.username).toBe(testUser.userName);
  });

  it("should not allow duplicate usernames", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toContain("already exists");
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });
});