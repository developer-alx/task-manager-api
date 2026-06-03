import { pool } from "../database";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
}

// Responsável por comunicação direta com o banco.
export class UserRepository {
  async create({ name, email, password }: CreateUserDTO) {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [name, email, password];

    const { rows } = await pool.query(query, values);

    return rows[0];
  }

  async findByEmail(email: string) {
    const query = `
      SELECT * FROM users
      WHERE email = $1
    `;

    const { rows } = await pool.query(query, [email]);

    return rows[0];
  }

  async findById(id: number) {
    const query = `
      SELECT * FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
  }

  async findAll() {
    const query = `
      SELECT * FROM users
      ORDER BY id
    `;

    const { rows } = await pool.query(query);

    return rows;
  }

  async update(id: number, data: UpdateUserDTO) {
    const updates: string[] = [];
    const values: any[] = [];

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
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    return rows[0];
  }

  async delete(id: number) {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
  }
}
