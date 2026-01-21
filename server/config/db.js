import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'appuser',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'contest_system',
  password: process.env.DB_PASSWORD || 'apppassword',
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

export default pool;
