"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const database_1 = require("../database");
class RefreshTokenRepository {
    async create(userId, token, expiresAt) {
        const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1,$2,$3)
      RETURNING *
    `;
        const values = [userId, token, expiresAt];
        const result = await database_1.pool.query(query, values);
        return result.rows[0];
    }
    async findByToken(token) {
        const result = await database_1.pool.query("SELECT * FROM refresh_tokens WHERE token = $1", [token]);
        return result.rows[0];
    }
    async delete(token) {
        await database_1.pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
