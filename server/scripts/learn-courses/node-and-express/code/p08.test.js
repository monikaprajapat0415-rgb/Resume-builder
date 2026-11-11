import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp, folderDriver } from './p08-files.js';
import { signToken } from './p-kit.js';

const as = (id) => ({ Authorization: `Bearer ${signToken({ id, role: 'user', name: `u${id}` })}` });

test('project 8: upload, owner checks, download, delete, quota', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'files-'));
  const app = createApp({ driver: folderDriver(folder) });

  assert.equal((await request(app).post('/api/files').attach('file', Buffer.from('hi'), { filename: 'a.txt', contentType: 'text/plain' })).status, 401);

  const up = await request(app).post('/api/files').set(as(1)).attach('file', Buffer.from('hello world'), { filename: '../../evil name.txt', contentType: 'text/plain' });
  assert.equal(up.status, 201);
  assert.equal(up.body.name, 'evil name.txt');                                // path parts are removed
  assert.equal(fs.readdirSync(folder).length, 1);
  assert.match(fs.readdirSync(folder)[0], /^[0-9a-f-]{36}\.txt$/);

  assert.equal((await request(app).post('/api/files').set(as(1)).attach('file', Buffer.from('x'), { filename: 'a.exe', contentType: 'application/x-msdownload' })).status, 415);
  assert.equal((await request(app).post('/api/files').set(as(1)).attach('file', Buffer.alloc(3 * 1024 * 1024), { filename: 'big.txt', contentType: 'text/plain' })).status, 413);

  const list = await request(app).get('/api/files').set(as(1));
  assert.equal(list.body.files.length, 1);
  assert.equal((await request(app).get('/api/files').set(as(2))).body.files.length, 0);

  const download = await request(app).get(`/api/files/${up.body.id}`).set(as(1));
  assert.equal(download.text, 'hello world');
  assert.equal(download.headers['x-content-type-options'], 'nosniff');
  assert.equal((await request(app).get(`/api/files/${up.body.id}`).set(as(2))).status, 404);       // not the owner
  assert.equal((await request(app).delete(`/api/files/${up.body.id}`).set(as(2))).status, 404);

  // Quota: two 2 MB files fit, the third does not.
  const two = Buffer.alloc(2 * 1024 * 1024 - 1, 'a');
  assert.equal((await request(app).post('/api/files').set(as(3)).attach('file', two, { filename: '1.txt', contentType: 'text/plain' })).status, 201);
  assert.equal((await request(app).post('/api/files').set(as(3)).attach('file', two, { filename: '2.txt', contentType: 'text/plain' })).status, 201);
  assert.equal((await request(app).post('/api/files').set(as(3)).attach('file', two, { filename: '3.txt', contentType: 'text/plain' })).status, 413);

  assert.equal((await request(app).delete(`/api/files/${up.body.id}`).set(as(1))).status, 204);
  assert.equal(fs.readdirSync(folder).length, 2);
  fs.rmSync(folder, { recursive: true });
});
