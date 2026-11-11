// The production version with BullMQ and Redis. NOT run in this course (needs a Redis server):
//   npm install bullmq   and a Redis at REDIS_HOST / REDIS_PORT
import { Queue, Worker } from 'bullmq';

const connection = { host: process.env.REDIS_HOST ?? '127.0.0.1', port: Number(process.env.REDIS_PORT ?? 6379) };

export const emailQueue = new Queue('emails', { connection });

// In a route: add a job and answer the user straight away.
export const sendWelcomeLater = (to) =>
  emailQueue.add('welcome', { to }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 100 });

// In a SEPARATE process (a worker), so slow work never blocks your API.
export const worker = new Worker(
  'emails',
  async (job) => {
    // await mailer.send({ to: job.data.to, subject: 'Welcome' });
    return { sent: job.data.to };
  },
  { connection, concurrency: 5 },
);

worker.on('failed', (job, error) => console.error('Job failed', job?.id, error.message));

// A repeating job (cron style): every day at 02:00
// await emailQueue.add('daily-report', {}, { repeat: { pattern: '0 2 * * *' } });
