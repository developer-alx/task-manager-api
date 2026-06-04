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

describe("RBAC Second Delivery", () => {
  const createUser = async (email: string) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "RBAC Test", email, password: "123456" })
      .expect(201);

    return res.body.id as number;
  };

  const login = async (email: string) => {
    const { rows } = await pool.query("SELECT id, role FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user) throw new Error("User not found for token generation");

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "1h"
    });

    return token;
  };

  const setRole = async (email: string, role: string) => {
    await pool.query("UPDATE users SET role = $1 WHERE email = $2", [role, email]);
  };

  it("T018: user role 'user' should get 403 on GET /users", async () => {
    const email = `rbac-user-get-${Date.now()}@example.com`;
    await createUser(email);
    const token = await login(email);

    await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("T019: admin role should get 200 on GET /users", async () => {
    const email = `rbac-admin-get-${Date.now()}@example.com`;
    await createUser(email);
    await setRole(email, "admin");
    const token = await login(email);

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("T020: user updates own profile -> 200", async () => {
    const email = `rbac-user-update-own-${Date.now()}@example.com`;
    const id = await createUser(email);
    const token = await login(email);

    const res = await request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name" })
      .expect(200);

    expect(res.body).toHaveProperty("name", "Updated Name");
  });

  it("T021: user attempts to update another user -> 403", async () => {
    const emailA = `rbac-user-a-${Date.now()}@example.com`;
    const emailB = `rbac-user-b-${Date.now()}@example.com`;
    const idA = await createUser(emailA);
    const idB = await createUser(emailB);
    const tokenA = await login(emailA);

    await request(app)
      .put(`/users/${idB}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Malicious Update" })
      .expect(403);
  });

  it("T022: user deletes own account -> 200", async () => {
    const email = `rbac-user-delete-own-${Date.now()}@example.com`;
    const id = await createUser(email);
    const token = await login(email);

    const res = await request(app)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("id", id);
  });

  it("T023: user attempts to delete another user -> 403", async () => {
    const emailA = `rbac-user-del-a-${Date.now()}@example.com`;
    const emailB = `rbac-user-del-b-${Date.now()}@example.com`;
    const idA = await createUser(emailA);
    const idB = await createUser(emailB);
    const tokenA = await login(emailA);

    await request(app)
      .delete(`/users/${idB}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(403);
  });

  it("T024: admin updates any user -> 200", async () => {
    const adminEmail = `rbac-admin-update-${Date.now()}@example.com`;
    const userEmail = `rbac-admin-update-user-${Date.now()}@example.com`;
    const userId = await createUser(userEmail);
    await createUser(adminEmail);
    await setRole(adminEmail, "admin");
    const adminToken = await login(adminEmail);

    const res = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Admin Updated" })
      .expect(200);

    expect(res.body).toHaveProperty("name", "Admin Updated");
  });

  it("T025: admin deletes any user -> 200", async () => {
    const adminEmail = `rbac-admin-delete-${Date.now()}@example.com`;
    const userEmail = `rbac-admin-delete-user-${Date.now()}@example.com`;
    const userId = await createUser(userEmail);
    await createUser(adminEmail);
    await setRole(adminEmail, "admin");
    const adminToken = await login(adminEmail);

    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("id", userId);
  });

  it("T026: GET /users/me works for both user and admin -> 200", async () => {
    const userEmail = `rbac-me-user-${Date.now()}@example.com`;
    const adminEmail = `rbac-me-admin-${Date.now()}@example.com`;
    const userId = await createUser(userEmail);
    await createUser(adminEmail);
    await setRole(adminEmail, "admin");

    const userToken = await login(userEmail);
    const adminToken = await login(adminEmail);

    const resUser = await request(app)
      .get(`/users/me`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(resUser.body).toHaveProperty("id", userId);

    await request(app)
      .get(`/users/me`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });
});
