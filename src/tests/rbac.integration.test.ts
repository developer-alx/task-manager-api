import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, expect } from "@jest/globals";
import { pool } from "../database";
import app from "../app";

describe("RBAC First Delivery", () => {
  it("should create a new user with role=user in the database", async () => {
    const email = `rbac-user-db-${Date.now()}@example.com`;

    await request(app)
      .post("/users")
      .send({
        name: "RBAC User DB",
        email,
        password: "123456"
      })
      .expect(201);

    const result = await pool.query("SELECT role FROM users WHERE email = $1", [email]);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].role).toBe("user");
  });

  it("should include role claim in the access token payload", async () => {
    const email = `rbac-user-jwt-${Date.now()}@example.com`;

    await request(app)
      .post("/users")
      .send({
        name: "RBAC User JWT",
        email,
        password: "123456"
      })
      .expect(201);

    const response = await request(app)
      .post("/login")
      .send({
        email,
        password: "123456"
      })
      .expect(200);

    expect(response.body).toHaveProperty("accessToken");

    const decoded = jwt.verify(
      response.body.accessToken,
      process.env.JWT_SECRET as string
    ) as any;

    expect(decoded).toHaveProperty("role", "user");
    expect(decoded).toHaveProperty("userId");
  });
});
