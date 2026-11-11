import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './s19-app.js';

test('static file, create, read, delete and 404', async () => {
  const app = createApp();

  const home = await request(app).get('/');
  assert.equal(home.status, 200);
  assert.match(home.text, /Book shelf/);

  const created = await request(app).post('/api/books').send({ title: ' Dune ' });
  assert.equal(created.status, 201);
  assert.equal(created.body.title, 'Dune');

  assert.equal((await request(app).get('/api/books/1')).body.author, 'Unknown');
  assert.equal((await request(app).post('/api/books').send({})).status, 400);
  assert.equal((await request(app).delete('/api/books/1')).status, 204);
  assert.equal((await request(app).get('/api/books/1')).status, 404);
  assert.equal((await request(app).get('/nothing-here')).status, 404);
});
