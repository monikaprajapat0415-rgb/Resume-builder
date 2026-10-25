import 'dotenv/config';
import { checkEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { app } from './app.js';

const port = Number(process.env.PORT) || 5000;

try {
  checkEnv();
  await connectDB();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
} catch (err) {
  console.error('Could not start:', err.message);
  process.exit(1);
}
