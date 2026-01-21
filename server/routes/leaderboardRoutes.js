import express from "express";
import { getLeaderboard, getGlobalLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// Contest-specific leaderboard
router.get("/contest/:contestId", getLeaderboard);

// Optional: global leaderboard across all contests
router.get("/global", getGlobalLeaderboard);

export default router;