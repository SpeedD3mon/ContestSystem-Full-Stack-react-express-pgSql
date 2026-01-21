import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// Check DB connection (Public)
router.get('/check-connection', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ message: 'Unable to connect to the database' });
  }
});

export default router;
