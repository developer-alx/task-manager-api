import { pool } from "../database";

export class RefreshTokenRepository {

  async create(userId: number, token: string, expiresAt: Date) {

    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1,$2,$3)
      RETURNING *
    `;

    const values = [userId, token, expiresAt];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  async findByToken(token: string) {

    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );

    return result.rows[0];
  }

  async delete(token: string) {

    await pool.query(
      "DELETE FROM refresh_tokens WHERE token = $1",
      [token]
    );

  }

}