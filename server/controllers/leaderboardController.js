import * as leaderboardModel from '../models/leaderboardModel.js';

/**
 * Get leaderboard for a specific contest
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!contestId) {
      return res.status(400).json({ error: "Contest ID is required" });
    }

    const leaderboard = await leaderboardModel.getLeaderboardByContestId(contestId);
    console.log("i am here");
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Optional: global leaderboard across all contests
 */

export const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await leaderboardModel.getGlobalLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

