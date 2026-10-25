// Lesson 37: logs a person reads in development, and one JSON object per line in production
// (easy for tools such as pm2, journald, Loki or any log search to read and filter).
const production = process.env.NODE_ENV === 'production';

const write = (level, message, extra = {}) => {
  if (production) {
    console[level === 'error' ? 'error' : 'log'](JSON.stringify({ time: new Date().toISOString(), level, message, ...extra }));
  } else {
    console[level === 'error' ? 'error' : 'log'](`[${level}] ${message}`, Object.keys(extra).length ? extra : '');
  }
};

export const log = {
  info: (m, x) => write('info', m, x),
  warn: (m, x) => write('warn', m, x),
  error: (m, x) => write('error', m, x),
};
