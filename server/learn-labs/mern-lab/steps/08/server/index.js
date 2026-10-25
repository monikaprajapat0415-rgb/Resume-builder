// Lesson 8: package.json, npm scripts and environment variables.
import 'dotenv/config'; // reads server/.env into process.env

const port = Number(process.env.PORT) || 5000;
console.log(`Job Tracker server would listen on port ${port}`);
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
