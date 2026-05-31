import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app";

describe("Create User", () => {

  it("should create a new user", async () => {

    const email = `test${Date.now()}@email.com`;

    const response = await request(app)
      .post("/users")
      .send({
        name: "TestUser",
        email: email,
        password: "123456"
      });

    expect(response.status).toBe(201);

  });

});
