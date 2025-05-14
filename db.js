import { Pool } from 'pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'authdb',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // para aceitar certificados autoassinados
  }
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

    static async deleteUser(username, password) {
        const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) return false; 
    
        const hashedPassword = result.rows[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
    
        if (!isMatch) return false; 
    
        await pool.query('DELETE FROM users WHERE username = $1', [username]);
        return true;
    }
    
}