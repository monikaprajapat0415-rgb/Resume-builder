import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app = express();
app.use(express.json({ limit: '1mb' }));

const here = path.dirname(fileURLToPath(import.meta.url));

// Every file inside server/routes is a router. To add an endpoint, add a file.
const routesDir = path.join(here, 'routes');
for (const file of fs.readdirSync(routesDir).filter((f) => f.endsWith('.js')).sort()) {
  const { default: router } = await import(pathToFileURL(path.join(routesDir, file)).href);
  app.use('/api', router);
}

// Unknown /api paths get a JSON 404.
app.use('/api', (req, res) => res.status(404).json({ error: { message: 'Not found' } }));

// After "npm run build" the server can also serve the Angular app itself.
const dist = path.join(here, '..', 'dist', 'ai-lab', 'browser');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// One place that turns any error into a safe, friendly JSON reply.
// The full error is logged on the server; the user only sees a short message.
app.use((err, req, res, next) => {
  console.error('[error]', err?.status || '', err?.message);
  const status = err?.status >= 400 && err?.status < 600 ? err.status : 500;
  const messages = {
    400: 'The request was not valid.',
    401: 'The server API key is missing or wrong. Check your .env file.',
    403: 'The server is not allowed to do that.',
    413: 'That file or text is too large.',
    429: 'Too many requests right now. Please wait a moment and try again.',
  };
  const message = err?.userMessage || messages[status] || (status >= 500 ? 'The AI service is busy. Please try again.' : 'Request failed.');
  res.status(status).json({ error: { message, status } });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI Lab server on http://localhost:${port}`));
