import express from 'express';
import { playableContests, getContest, startContest, getContestList } from '../controllers/contestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Playable contests based on logged-in user
router.get('/', getContestList);
router.get('/playable', protect, playableContests);

// Get contest details
router.get('/:id', protect, getContest);

// Start contest
router.post('/:contestId/start', protect, startContest);

export default router;
