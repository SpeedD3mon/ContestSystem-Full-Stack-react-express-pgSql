import pool from "../config/db.js";

/**
 * Create a new contest
 * @param {string} name
 * @param {string} description
 * @param {string} access_level
 * @param {string} prize
 * @param {string} starts_at
 * @param {string} ends_at
 */
export const createContest = async (name, description, access_level, prize, starts_at, ends_at) => {
  const result = await pool.query(
    `INSERT INTO contests
     (name, description, access_level, prize, starts_at, ends_at, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,false)
     RETURNING *`,
    [name, description, access_level, prize, starts_at, ends_at]
  );
  return result.rows[0];
};

/**
 * Start / activate a contest
 * @param {number} contestId
 */
export const startContest = async (contestId) => {
  const result = await pool.query(
    `UPDATE contests
     SET is_active = true
     WHERE contest_id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [contestId]
  );

  if (result.rows.length === 0) {
    throw new Error("Contest not found");
  }
  return result.rows[0];
};

/**
 * Get all active contests (for users)
 */
export const getActiveContests = async () => {
  const result = await pool.query(
    `SELECT * FROM contests
     WHERE is_active = true
       AND starts_at <= NOW()
       AND ends_at >= NOW()
       AND deleted_at IS NULL
     ORDER BY starts_at DESC`
  );
  return result.rows;
};

/**
 * Get contest by ID
 */
export const getContestById = async (contestId) => {
  const result = await pool.query(
    `SELECT * FROM contests
     WHERE contest_id = $1 AND deleted_at IS NULL`,
    [contestId]
  );
  return result.rows[0];
};

export const getAllContests = async () => {
  const result = await pool.query(
    "SELECT * FROM contests ORDER BY starts_at DESC"
  );
  return result.rows;
};