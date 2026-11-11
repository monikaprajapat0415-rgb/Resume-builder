import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import crypto from 'node:crypto';

// Custom error classes carry an HTTP status and a safe message for the client.
export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL') {
    super(message);
    this.status = status;
    this.code = code;
    this.expose = status < 500;     // only show messages of client errors, never of server bugs
  }
}
export const notFound = (what) => new AppError(`${what} not found`, 404, 'NOT_FOUND');
export const badRequest = (message) => new AppError(message, 400, 'BAD_REQUEST');

// Winston: levels, structured JSON, and one place to choose where logs go.
export function createLogger({ silent = false, stream } = {}) {
  return winston.createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    silent,
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
    transports: [stream ? new winston.transports.Stream({ stream }) : new winston.transports.Console()],
  });
}

export function createApp({ logger = createLogger({ silent: true }) } = {}) {
  const app = express();

  // Every request gets an id, so you can find all log lines of one request.
  app.use((req, res, next) => { req.id = req.get('x-request-id') ?? crypto.randomUUID(); res.set('x-request-id', req.id); next(); });

  // Morgan writes one line per request. We send it into Winston so all logs go to one place.
  morgan.token('id', (req) => req.id);
  app.use(morgan(':id :method :url :status :response-time ms', { stream: { write: (line) => logger.info(line.trim()) } }));

  app.get('/items/:id', (req, res) => {
    if (req.params.id !== '1') throw notFound('Item');
    res.json({ id: 1 });
  });
  app.get('/boom', () => { throw new Error('database password is hunter2'); });   // a bug with a secret in its message

  app.use((req, res) => res.status(404).json({ error: 'Not found', requestId: req.id }));

  // The ONE error handler. Express 5 also sends rejected promises from async handlers here.
  app.use((err, req, res, next) => {
    const status = err.status ?? 500;
    logger[status >= 500 ? 'error' : 'warn']({ message: err.message, code: err.code, status, requestId: req.id, stack: status >= 500 ? err.stack : undefined });
    res.status(status).json({ error: err.expose ? err.message : 'Something went wrong', code: err.code ?? 'INTERNAL', requestId: req.id });
  });
  return app;
}
