import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';
import express from 'express';
import { startContestPrizeCron } from "./cron/contestPrizeJob.js";
dotenv.config();
startContestPrizeCron();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end();
  process.exit(0);
});
