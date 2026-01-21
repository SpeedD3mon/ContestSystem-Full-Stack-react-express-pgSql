import pool from '../config/db.js';

/**
 * Get contests user can play based on role
 */
export const getPlayableContests = async (role, userId) => {
  let query = `
    SELECT c.contest_id, c.name, c.access_level, c.prize
    FROM contests c
    LEFT JOIN user_contest_attempts a
      ON a.contest_id = c.contest_id AND a.user_id = $1 AND a.deleted_at IS NULL
    WHERE c.deleted_at IS NULL
      AND (a.attempt_id IS NULL OR a.is_completed = false)
      AND is_active = true
  `;

  if (role === 'signed-in') {
    query += ` AND c.access_level = 'normal'`;
  } else if (role === 'vip' || role === 'admin') {
    // VIP/admin can see all available contests
  } else {
    return [];
  }

  const result = await pool.query(query, [userId]);
  return result.rows;
};


/**
 * Get single contest by ID with questions + options
 */
export const getContestById = async (id) => {
  const contestQuery = `
    SELECT contest_id, name, access_level, prize
    FROM contests
    WHERE contest_id = $1 AND deleted_at IS NULL
  `;
  const contestResult = await pool.query(contestQuery, [id]);
  const contest = contestResult.rows[0];

  if (!contest) return null;

  const questionsQuery = `
    SELECT 
      q.question_id,
      q.question_text,
      q.question_type,
      q.points,
      json_agg(
        json_build_object(
          'option_id', o.option_id,
          'option_text', o.option_text
        )
      ) AS options
    FROM questions q
    LEFT JOIN options o ON o.question_id = q.question_id AND o.deleted_at IS NULL
    WHERE q.contest_id = $1 AND q.deleted_at IS NULL
    GROUP BY q.question_id
    ORDER BY q.question_id
  `;

  const questionsResult = await pool.query(questionsQuery, [id]);
  contest.questions = questionsResult.rows;
  return contest;
};



export const getCurrentAttempt = async (userId, contestId) => {
  const res = await pool.query(
    `SELECT * FROM user_contest_attempts
     WHERE user_id=$1 
       AND contest_id=$2 
       AND deleted_at IS NULL 
       AND is_completed=false`,
    [userId, contestId]
  );
  return res.rows[0] || null;
};


export const getContestList = async () => {
  const contestQuery = `
    SELECT contest_id, name
    FROM contests
    where is_active = true
  `;
  const contestResult = await pool.query(contestQuery);

  return contestResult.rows|| null;
}

export const getEndedUnprocessedContests = async () => {
  const res = await db.query(`
    SELECT * FROM contests
    WHERE end_time < NOW() AND prizes_processed = false
  `);
  return res.rows;
};

export const markContestProcessed = async (contestId) => {
  await db.query(`
    UPDATE contests SET prizes_processed = true
    WHERE contest_id = $1
  `, [contestId]);
};