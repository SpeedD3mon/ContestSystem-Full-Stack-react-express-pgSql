import pool from '../config/db.js';

export const createUser = async ({ username, email, password, role }) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, password, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  console.log("findUserByEmail")
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT user_id, username, email, role, created_at FROM users WHERE deleted_at IS NULL'
  );
  return result.rows;
};

export const saveRefreshToken = async (userId, token) => {
  const result = await pool.query(
    'UPDATE users SET refresh_token = $1 WHERE user_id = $2',
    [token, userId]
  );
  return result.rowCount > 0;
};

export const findUserByRefreshToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE refresh_token = $1',
    [token]
  );
  return result.rows[0];
};

export const getUserHistoryById = async (userId) => {

    const result = await pool.query(`
      SELECT 
        a.contest_id,
        c.name AS contest_name,
        a.score,
        c.prize,
        a.created_at AS completed_at
      FROM user_contest_attempts a
      JOIN contests c ON a.contest_id = c.contest_id
      WHERE a.user_id = $1 AND a.is_completed = true
      ORDER BY a.created_at DESC
    `, [userId]);

    return result.rows;
  
};