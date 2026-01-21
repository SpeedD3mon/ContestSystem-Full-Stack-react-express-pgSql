import * as contestModel from '../models/contestModel.js';
import * as attemptModel from "../models/attemptModel.js";
/**
 * Get contests user can play
 */
export const playableContests = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const contests = await contestModel.getPlayableContests(req.user.role, req.user.user_id);
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get single contest
 */
export const getContest = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await contestModel.getContestById(id);
    if (!contest) return res.status(404).json({ error: "Contest not found" });
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Start contest attempt
 */
export const startContest = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { contestId } = req.params;

    // 1️ Check if user already has an attempt for this contest
    const existingAttempt = await contestModel.getCurrentAttempt(userId, contestId);

    if (existingAttempt) {
      if (existingAttempt.is_completed) {
        return res.status(400).json({ error: "You have already completed this contest" });
      } else {
        return res.json({ message: "Resuming your existing attempt", attempt: existingAttempt });
      }
    }

    // 2️ Create a new attempt
    const attempt = await attemptModel.startAttempt(userId, contestId);
    res.json({ message: "Contest started", attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get single contest
 */
export const getContestList = async (req, res) => {
  try {
   
    const contest = await contestModel.getContestList();
    if (!contest) return res.status(404).json({ error: "Contest not found" });
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

