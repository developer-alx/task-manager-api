import { pool } from "../database";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
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
}
