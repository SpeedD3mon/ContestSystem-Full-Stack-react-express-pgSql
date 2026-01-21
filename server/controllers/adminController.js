import * as adminModel from "../models/adminModel.js";

/**
 * Create a new contest
 */
export const createContest = async (req, res) => {
  try {
    const { name, description, access_level, prize, starts_at, ends_at } = req.body;

    if (!name || !access_level || !starts_at || !ends_at) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const contest = await adminModel.createContest(
      name, description, access_level, prize, starts_at, ends_at
    );

    res.json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Start / Activate contest
 */
export const startContest = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await adminModel.startContest(contestId);
    res.json({ message: "Contest started", contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllContests = async (req, res) => {
  try {
    const contests = await adminModel.getAllContests();
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};