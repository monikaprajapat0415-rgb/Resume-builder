import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

process.env.NODE_ENV = 'test';
let server, base, token;

test.before(async () => {
  const app = createApp({ secret: 'test-secret-1234567890' });
  server = app.listen(0);
  base = `http://localhost:${server.address().port}`;
});
test.after(() => server.close());

const call = (path, { method = 'GET', body, auth = true } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(auth && token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

test('tasks need a login', async () => {
  const res = await call('/api/tasks', { auth: false });
  assert.equal(res.status, 401);
});

test('register, then create and read a task', async () => {
  const reg = await call('/api/auth/register', { method: 'POST', body: { email: 'a@example.com', password: 'longenough1' } });
  assert.equal(reg.status, 201);
  token = (await reg.json()).token;

  const created = await call('/api/tasks', { method: 'POST', body: { title: 'Write tests' } });
  assert.equal(created.status, 201);
  const task = await created.json();
  assert.equal(task.title, 'Write tests');
  assert.equal(task.done, false);

  const list = await (await call('/api/tasks')).json();
  assert.equal(list.length, 1);
});

test('bad input is rejected with 400', async () => {
  const res = await call('/api/tasks', { method: 'POST', body: { title: '' } });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'title is required');
});

test('a task can be updated and deleted', async () => {
  const { id } = await (await call('/api/tasks', { method: 'POST', body: { title: 'Temp' } })).json();
  const patched = await call(`/api/tasks/${id}`, { method: 'PATCH', body: { done: true } });
  assert.equal((await patched.json()).done, true);
  assert.equal((await call(`/api/tasks/${id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await call(`/api/tasks/${id}`)).status, 404);
});
