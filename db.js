import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'authdb',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 5432,
});