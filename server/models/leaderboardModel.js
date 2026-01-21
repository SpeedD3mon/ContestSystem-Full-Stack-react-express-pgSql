import pool from '../config/db.js';

/**
 * Get leaderboard for a specific contest
 */
export const getLeaderboardByContest = async (contestId) => {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      u.username,
      u.role,
      a.score,
      p.prize,
      RANK() OVER (ORDER BY a.score DESC) AS rank
    FROM user_contest_attempts a
    JOIN users u ON a.user_id = u.user_id
    LEFT JOIN prizes p 
      ON p.contest_id = a.contest_id AND p.user_id = a.user_id AND p.deleted_at IS NULL
    WHERE a.is_completed = true 
      AND a.deleted_at IS NULL
      AND a.contest_id = $1
    ORDER BY a.score DESC;
    `,
    [contestId]
  );

  return result.rows;
};

/**
 * Optional: Get global leaderboard across all contests
 */
export const getGlobalLeaderboard = async () => {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      u.username,
      u.role,
      SUM(a.score) AS total_score,
      RANK() OVER (ORDER BY SUM(a.score) DESC) AS rank
    FROM user_contest_attempts a
    JOIN users u ON a.user_id = u.user_id
    WHERE a.is_completed = true AND a.deleted_at IS NULL
    GROUP BY u.user_id, u.username, u.role
    ORDER BY total_score DESC;
    `
  );

  return result.rows;
};

export const getLeaderboardByContestId = async (contestId) => {
  const result = await pool.query(
    `
    SELECT 
      u.user_id,
      u.username,
      u.role,
      SUM(a.score) AS total_score,
      RANK() OVER (ORDER BY SUM(a.score) DESC) AS rank
    FROM user_contest_attempts a
    JOIN users u ON a.user_id = u.user_id
    WHERE 
      a.is_completed = true 
      AND a.deleted_at IS NULL
      AND a.contest_id = $1
    GROUP BY u.user_id, u.username, u.role
    ORDER BY total_score DESC
    `,
    [contestId]
  );

  return result.rows;
};
