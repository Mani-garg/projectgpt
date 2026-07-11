// Vercel serverless entrypoint.
// Wraps the existing Express app (backend/app.js) so the whole backend runs
// as a single serverless function at /api/*, deployed together with the
// frontend in one Vercel project.

import dotenv from 'dotenv';
dotenv.config();

import app from '../backend/app.js';
import { initializeDatabase } from '../backend/utils/initDb.js';

// Cache DB initialization across warm invocations so we don't re-run
// CREATE TABLE IF NOT EXISTS / schema checks on every request.
let dbReady = null;

const ensureDatabase = async () => {
  if (!dbReady) {
    dbReady = initializeDatabase().catch((error) => {
      dbReady = null; // allow retry on next request if init failed
      throw error;
    });
  }
  return dbReady;
};

export default async function handler(req, res) {
  try {
    await ensureDatabase();
  } catch (error) {
    res.status(500).json({ message: `Database initialization failed: ${error.message}` });
    return;
  }
  return app(req, res);
}
