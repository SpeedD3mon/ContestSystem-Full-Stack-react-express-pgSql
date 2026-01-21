import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import contestRoutes from './routes/contestRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/admin', adminRoutes);
// Error handling middleware
app.use(errorMiddleware);

export default app;
