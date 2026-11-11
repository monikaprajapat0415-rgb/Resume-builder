import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createDocsApp } from './r21-docs.js';

test('the spec and the docs page are served', async () => {
  const app = createDocsApp();
  const spec = await request(app).get('/openapi.json');
  assert.equal(spec.body.openapi, '3.0.3');
  assert.ok(spec.body.paths['/api/v1/products'].post);

  const page = await request(app).get('/docs/');
  assert.equal(page.status, 200);
  assert.match(page.text, /swagger-ui/);
});
