"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const database_1 = require("../database");
class TaskRepository {
    async create({ title, description, user_id, }) {
        const query = `
      INSERT INTO tasks (
        title,
        description,
        user_id
      )
      VALUES ($1,$2,$3)
      RETURNING *
    `;
        const values = [
            title,
            description,
            user_id,
        ];
        const { rows } = await database_1.pool.query(query, values);
        return rows[0];
    }
    async findByUser(user_id) {
        const { rows } = await database_1.pool.query(`
      SELECT *
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
      `, [user_id]);
        return rows;
    }
    async findById(id) {
        const { rows } = await database_1.pool.query(`
    SELECT *
    FROM tasks
    WHERE id = $1
    `, [id]);
        return rows[0];
    }
    async update(id, title, description, completed) {
        const { rows } = await database_1.pool.query(`
    UPDATE tasks
    SET
      title = $1,
      description = $2,
      completed = $3
    WHERE id = $4
    RETURNING *
    `, [
            title,
            description,
            completed,
            id,
        ]);
        return rows[0];
    }
    async delete(id, user_id) {
        const query = `
    DELETE FROM tasks
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
        const result = await database_1.pool.query(query, [id, user_id]);
        return result.rows[0];
    }
}
exports.TaskRepository = TaskRepository;
