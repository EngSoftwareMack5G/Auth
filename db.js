import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'authdb',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,
});

export class DB {
    static async userExists(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows.length > 0;
    }

    static async registerUser(username, password, type) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password, type) VALUES ($1, $2, $3)', [username, hashedPassword, type]);
    }

    static async getUser(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

}