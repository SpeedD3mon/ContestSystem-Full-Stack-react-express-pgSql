import * as attemptModel from "../models/attemptModel.js";

/**
 * Start a contest
 */
export const startAttempt = async (req, res) => {
  try {
      const { contestId } = req.params;
      const userId = req.user.user_id;
  
      const attempt = await attemptModel.createContestAttempt(userId, contestId);
      res.json(attempt);
    } catch (err) {
   
      res.status(500).json({ error: err.message });
    }
  };
  
/**
 * Get contest questions for a given attempt
 */
export const getAttemptQuestions = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { attemptId } = req.params;

    const attempt = await attemptModel.getAttemptById(attemptId, userId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.is_completed) return res.status(400).json({ error: "Attempt already completed" });

    const questions = await attemptModel.getContestQuestions(attempt.contest_id);
    res.json({ attemptId, contestId: attempt.contest_id, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Submit attempt
 */
export const submitAttempt = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { attemptId } = req.params;
    const { answers } = req.body;

    // 1️ Get attempt
    const attempt = await attemptModel.getAttemptById(attemptId, userId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.is_completed) return res.status(400).json({ error: "Attempt already submitted" });

    // 2️ Get correct answers
    const questions = await attemptModel.getContestQuestionsWithAnswers(attempt.contest_id);

    // 3️ Calculate score
    let score = 0;
    for (const q of questions) {
      const userAns = answers.find(a => a.question_id === q.question_id)?.selected_options || [];
      const correctOptions = q.options.filter(o => o.is_correct).map(o => o.option_id);

      if (
        correctOptions.length === userAns.length &&
        correctOptions.every(co => userAns.includes(co))
      ) {
        score += q.points;
      }
    }

    // 4️⃣ Close attempt
    const result = await attemptModel.closeAttempt(attemptId, score);

    res.json({ message: "Contest submitted", score: result.score, attempt_id: attemptId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * Discard attempt (on refresh / disconnect)
 */
export const discardAttemptOnExit = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await attemptModel.getAttemptById(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });

    // Only discard if not completed yet
    if (attempt.is_completed) {
      return res.status(400).json({ error: "Attempt already completed" });
    }

    const discarded = await attemptModel.discardAttempt(attemptId);
    res.json({ message: "Attempt discarded", attempt: discarded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

