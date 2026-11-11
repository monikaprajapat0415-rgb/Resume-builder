import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { fetchJson, sign, verifySignature } from './t23-client.js';

function startServer(handler) {
  return new Promise((resolve) => {
    const server = http.createServer(handler).listen(0, () => resolve(server));
  });
}

test('retries a temporary error and then succeeds', async () => {
  let calls = 0;
  const server = await startServer((req, res) => {
    calls += 1;
    if (calls < 3) { res.statusCode = 503; return res.end(); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  });
  const url = `http://127.0.0.1:${server.address().port}/`;
  assert.deepEqual(await fetchJson(url), { ok: true });
  assert.equal(calls, 3);
  server.close();
});

test('does not retry a 404, and gives up after the limit', async () => {
  let calls = 0;
  const notFound = await startServer((req, res) => { calls += 1; res.statusCode = 404; res.end(); });
  await assert.rejects(fetchJson(`http://127.0.0.1:${notFound.address().port}/`), /HTTP 404/);
  assert.equal(calls, 1);
  notFound.close();

  const broken = await startServer((req, res) => { res.statusCode = 500; res.end(); });
  await assert.rejects(fetchJson(`http://127.0.0.1:${broken.address().port}/`, { retries: 1 }), /Failed after 2 attempts/);
  broken.close();
});

test('a slow server times out', async () => {
  const slow = await startServer(() => { /* never answers */ });
  await assert.rejects(fetchJson(`http://127.0.0.1:${slow.address().port}/`, { retries: 0, timeoutMs: 100 }), /Failed after 1 attempts/);
  slow.closeAllConnections();
  slow.close();
});

test('webhook signatures', () => {
  const body = '{"event":"paid"}';
  const signature = sign(body, 'secret');
  assert.equal(verifySignature(body, signature, 'secret'), true);
  assert.equal(verifySignature(body + ' ', signature, 'secret'), false);
  assert.equal(verifySignature(body, 'abc', 'secret'), false);
  assert.equal(verifySignature(body, undefined, 'secret'), false);
});
