import express from 'express';
import { register, login, getUsers, refreshToken,getUserHistory  } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/history',protect, getUserHistory )
// Admin only
router.get('/', protect, authorize('admin'), getUsers);

export default router;
