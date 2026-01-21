import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  startAttempt,
  getAttemptQuestions,
  submitAttempt,
  discardAttemptOnExit,
} from "../controllers/attemptController.js";

const router = express.Router();

// Start a contest attempt
router.post("/start/:contestId", protect, startAttempt);

// Get questions for an attempt
router.get("/:attemptId/questions", protect, getAttemptQuestions);

// Submit an attempt
router.post("/:attemptId/submit", protect, submitAttempt);
// discard an attempt
router.post("/:attemptId/discard", protect, discardAttemptOnExit);
export default router;
