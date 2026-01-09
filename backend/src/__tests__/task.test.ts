import request from "supertest";
import app from "../index.js";
import prisma from "../prisma.js";

describe("Task Controller", () => {
  let token: string;
  let taskId: number;

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create user and get token
    await request(app).post("/api/auth/register").send({
      userName: "taskuser",
      password: "password123"
    });
    const loginRes = await request(app).post("/api/auth/login").send({
      userName: "taskuser",
      password: "password123"
    });
    token = loginRes.body.data.token;
  });

  it("should create a new task for the logged-in user", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing Jest"
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
    taskId = res.body.id;
  });

  it("should fetch tasks only for the authenticated user", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return 404 for a non-existent task update", async () => {
    const res = await request(app)
      .put("/api/tasks/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated" });

    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});