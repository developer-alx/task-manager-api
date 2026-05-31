import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app";

describe("Login", () => {

  it("should authenticate user", async () => {

    const email = `login${Date.now()}@email.com`;

    await request(app)
      .post("/users")
      .send({
        name: "LoginUser",
        email: email,
        password: "123456"
      });

    const response = await request(app)
      .post("/login")
      .send({
        email: email,
        password: "123456"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");

  });

});
