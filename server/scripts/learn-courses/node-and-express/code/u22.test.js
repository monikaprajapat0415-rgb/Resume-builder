import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp, localStorageDriver, sniff } from './u22-upload.js';

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(20)]);

test('upload rules', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'up-'));
  const app = createApp({ driver: localStorageDriver(folder) });

  const ok = await request(app).post('/api/upload').attach('file', PNG, { filename: 'me.png', contentType: 'image/png' });
  assert.equal(ok.status, 201);
  assert.match(ok.body.name, /^[0-9a-f-]{36}\.png$/);
  assert.equal(fs.readdirSync(folder).length, 1);

  // A text file pretending to be a PNG is refused by the content check.
  const fake = await request(app).post('/api/upload').attach('file', Buffer.from('not an image'), { filename: 'x.png', contentType: 'image/png' });
  assert.equal(fake.status, 400);

  // A type that is not allowed is skipped by the filter.
  const bad = await request(app).post('/api/upload').attach('file', Buffer.from('hi'), { filename: 'x.txt', contentType: 'text/plain' });
  assert.equal(bad.status, 400);

  // Too big.
  const big = await request(app).post('/api/upload').attach('file', Buffer.concat([PNG, Buffer.alloc(1024 * 1024)]), { filename: 'big.png', contentType: 'image/png' });
  assert.equal(big.status, 413);

  assert.equal(sniff(Buffer.from('%PDF-1.7')), 'application/pdf');
  fs.rmSync(folder, { recursive: true });
});
