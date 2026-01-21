import pool from '../config/db.js';

export const getAttemptById = async (attemptId, userId) => {
  const res = await pool.query(
    `SELECT * FROM user_contest_attempts 
     WHERE attempt_id = $1 AND user_id = $2 AND is_completed = false AND deleted_at IS NULL`,
    [attemptId, userId]
  );
  console.log(userId)
  return res.rows[0];
};

/**
 * Start contest attempt
 */
export const createContestAttempt = async (userId, contestId) => {
  // Soft-delete old **incomplete** attempts
  const deleteOldQuery = `
    UPDATE user_contest_attempts
    SET deleted_at = NOW()
    WHERE user_id = $1 
      AND contest_id = $2 
      AND deleted_at IS NULL 
      AND is_completed = false
  `;
  await pool.query(deleteOldQuery, [userId, contestId]);

  // Insert new attempt
  const insertQuery = `
    INSERT INTO user_contest_attempts (user_id, contest_id)
    VALUES ($1, $2)
    RETURNING attempt_id, user_id, contest_id, score, is_completed, created_at
  `;
  const result = await pool.query(insertQuery, [userId, contestId]);

  return result.rows[0];
};
export const getContestQuestions = async (contestId) => {
  const res = await pool.query(
    `
    SELECT 
      q.question_id,
      q.question_type,
      q.points,
      json_agg(
        json_build_object(
          'option_id', o.option_id,
          'option_text', o.option_text
        )
      ) AS options
    FROM questions q
    JOIN options o ON o.question_id = q.question_id AND o.deleted_at IS NULL
    WHERE q.contest_id = $1 AND q.deleted_at IS NULL
    GROUP BY q.question_id
    ORDER BY q.question_id
    `,
    [contestId]
  );

  return res.rows;
};

export const getContestQuestionsWithAnswers = async (contestId) => {
  const res = await pool.query(
    `
    SELECT 
      q.question_id,
      q.points,
      json_agg(
        json_build_object(
          'option_id', o.option_id,
          'is_correct', o.is_correct
        )
      ) AS options
    FROM questions q
    JOIN options o ON o.question_id = q.question_id
    WHERE q.contest_id = $1 AND q.deleted_at IS NULL
    GROUP BY q.question_id
    `,
    [contestId]
  );

  return res.rows;
};

export const saveUserAnswer = async (attemptId, questionId, selectedOptions) => {
  const res = await pool.query(
    `
    INSERT INTO user_answers (attempt_id, question_id, selected_options)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [attemptId, questionId, JSON.stringify(selectedOptions)]
  );

  return res.rows[0];
};
export const isAttemptCompleted = async (attemptId) => {
  const res = await pool.query(
    `SELECT is_completed FROM user_contest_attempts WHERE attempt_id = $1`,
    [attemptId]
  );
  return res.rows[0]?.is_completed;
};

export const closeAttempt = async (attemptId, score) => {
  const res = await pool.query(
    `
    UPDATE user_contest_attempts
    SET score = $1,
        is_completed = true 
    WHERE attempt_id = $2
    RETURNING *
    `,
    [score, attemptId]
  );

  return res.rows[0];
};


export const discardAttempt = async (attemptId) => {
  const res = await pool.query(
    `
    UPDATE user_contest_attempts
    SET deleted_at = NOW()
    WHERE attempt_id = $1
      AND is_completed = false
      AND deleted_at IS NULL
    RETURNING *
    `,
    [attemptId]
  );

  return res.rows[0];
};