import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const spec = JSON.parse(fs.readFileSync(fileURLToPath(new URL('./r21-openapi.json', import.meta.url)), 'utf8'));

export function createDocsApp() {
  const app = express();
  app.get('/openapi.json', (req, res) => res.json(spec));          // for tools and code generators
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));         // the interactive page
  return app;
}
