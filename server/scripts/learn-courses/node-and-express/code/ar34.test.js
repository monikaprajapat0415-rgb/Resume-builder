import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PassThrough } from 'node:stream';
import { createApp, createLogger } from './ar34-errors-logs.js';

test('client errors show their message, server errors hide it but are logged', async () => {
  const stream = new PassThrough();
  let output = '';
  stream.on('data', (chunk) => { output += chunk; });
  const app = createApp({ logger: createLogger({ stream }) });

  const missing = await request(app).get('/items/9');
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error, 'Item not found');
  assert.equal(missing.body.code, 'NOT_FOUND');

  const boom = await request(app).get('/boom').set('x-request-id', 'req-123');
  assert.equal(boom.status, 500);
  assert.equal(boom.body.error, 'Something went wrong');          // the secret is NOT sent to the client
  assert.equal(boom.body.requestId, 'req-123');

  await new Promise((resolve) => setTimeout(resolve, 20));
  const lines = output.trim().split('\n').map((l) => JSON.parse(l));
  const serverError = lines.find((l) => l.level === 'error');
  assert.match(serverError.message, /hunter2/);                    // ...but it IS in the log, with the request id
  assert.equal(serverError.requestId, 'req-123');
  assert.ok(lines.some((l) => l.level === 'info' && l.message.includes('req-123')));
});
