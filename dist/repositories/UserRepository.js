"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../database");
// Responsável por comunicação direta com o banco.
class UserRepository {
    async create({ name, email, password, role }) {
        const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, password, role, created_at
    `;
        const values = [name, email, password, role ?? "user"];
        const { rows } = await database_1.pool.query(query, values);
        return rows[0];
    }
    async findByEmail(email) {
        const query = `
      SELECT id, name, email, password, role, created_at FROM users
      WHERE email = $1
    `;
        const { rows } = await database_1.pool.query(query, [email]);
        return rows[0];
    }
    async findById(id) {
        const query = `
      SELECT id, name, email, password, role, created_at FROM users
      WHERE id = $1
    `;
        const { rows } = await database_1.pool.query(query, [id]);
        return rows[0];
    }
    async findAll() {
        const query = `
     SELECT id, name, email, role, created_at FROM users
     ORDER BY id
    `;
        const { rows } = await database_1.pool.query(query);
        return rows;
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        if (data.name !== undefined) {
            values.push(data.name);
            updates.push(`name = $${values.length}`);
        }
        if (data.email !== undefined) {
            values.push(data.email);
            updates.push(`email = $${values.length}`);
        }
        if (updates.length === 0) {
            const query = `
        SELECT * FROM users
        WHERE id = $1
      `;
            const { rows } = await database_1.pool.query(query, [id]);
            return rows[0];
        }
        values.push(id);
        const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;
        const { rows } = await database_1.pool.query(query, values);
        return rows[0];
    }
    async delete(id) {
        const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;
        const { rows } = await database_1.pool.query(query, [id]);
        return rows[0];
    }
}
exports.UserRepository = UserRepository;
