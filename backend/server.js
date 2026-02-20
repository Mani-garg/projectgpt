import dotenv from 'dotenv';
import app from './app.js';
import { initializeDatabase } from './utils/initDb.js';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const bootstrap = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

bootstrap();
