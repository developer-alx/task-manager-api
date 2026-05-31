import { afterAll } from "@jest/globals";
import { pool } from "../database";

afterAll(async () => {
  await pool.end();
});
