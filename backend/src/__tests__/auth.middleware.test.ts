import request from "supertest";
import app from "../index.js";

describe("Auth Middleware", () => {
  it("blocks request without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });
});
