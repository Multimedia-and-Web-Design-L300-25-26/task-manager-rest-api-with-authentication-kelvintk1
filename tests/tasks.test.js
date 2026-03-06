import request from "supertest";
import app from "../src/app.js";

describe("Task Routes", () => {
  let token;
  let userId;

  // Create a fresh user before each test
  beforeEach(async () => {
    console.log("🔍 Creating fresh test user...");
    
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        username: `taskuser_${Date.now()}`, // Unique username
        email: `taskuser_${Date.now()}@example.com`, // Unique email
        password: "password123"
      });

    token = registerRes.body.data.token;
    userId = registerRes.body.data.user._id;
    console.log("✅ Fresh user created with token");
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Task");
    expect(res.body).toHaveProperty("owner", userId);
  });

  it("should get user tasks only", async () => {
    // First create a task
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task"
      });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("should delete own task", async () => {
    // First create a task
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Delete Me",
        description: "To be deleted"
      });

    const deleteRes = await request(app)
      .delete(`/api/tasks/${createRes.body._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toMatch(/deleted/i);
  });
});