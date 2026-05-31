"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../database");
// Responsável por comunicação direta com o banco.
class UserRepository {
    async create({ name, email, password }) {
        const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const values = [name, email, password];
        const { rows } = await database_1.pool.query(query, values);
        return rows[0];
    }
    async findByEmail(email) {
        const query = `
      SELECT * FROM users
      WHERE email = $1
    `;
        const { rows } = await database_1.pool.query(query, [email]);
        return rows[0];
    }
}
exports.UserRepository = UserRepository;
