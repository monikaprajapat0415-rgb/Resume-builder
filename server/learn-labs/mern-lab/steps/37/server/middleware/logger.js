import { log } from '../utils/logger.js';

// One line per request, written when the answer has been sent. We log the path WITHOUT the query string
// and never the body or headers: they can contain passwords and tokens.
export function logger(req, res, next) {
  const started = Date.now();
  res.on('finish', () => {
    log.info(`${req.method} ${req.path} ${res.statusCode}`, { ms: Date.now() - started, status: res.statusCode, ip: req.ip });
  });
  next();
}
