import dotenv from 'dotenv';
dotenv.config();   // ✅ MUST be immediately after importing dotenv

import app from './app.js';
import { initializeDatabase } from './utils/initDb.js';

const PORT = Number(process.env.PORT || 5000);

const bootstrap = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

bootstrap();