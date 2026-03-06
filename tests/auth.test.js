import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user).not.toHaveProperty("password");
    expect(res.body.data).toHaveProperty("token");
  });

  it("should login user and return token", async () => {
    // First register a user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "loginuser",
        email: "login@example.com",
        password: "password123"
      });

    // Then login
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@example.com",
        password: "password123"
      });

    console.log("Login response:", res.statusCode);
    console.log("Login body:", JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toBe(200);
    
    // Your API returns data.token, not top-level token
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.token).toBeDefined();
  });

  it("should not register user with existing email", async () => {
    // First register
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "existinguser",
        email: "duplicate@example.com",
        password: "password123"
      });

    // Try to register again with same email
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "anotheruser",
        email: "duplicate@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email.*already/i);
  });

  it("should not login with wrong password", async () => {
    // Register
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "wrongpass",
        email: "wrong@example.com",
        password: "correctpassword"
      });

    // Try login with wrong password
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@example.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});