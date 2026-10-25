// Lesson 24: automated tests with Node's built-in test runner. Run:  npm test
// They use a SEPARATE database, so set MONGODB_URI_TEST in .env (for example mongodb://127.0.0.1:27017/job_tracker_test).
// The whole test database is dropped at the end. Never point MONGODB_URI_TEST at real data.
import 'dotenv/config';
import { before, after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI_TEST;
if (!uri) {
  console.log('Skipping API tests: set MONGODB_URI_TEST in .env (a throw-away database).');
  process.exit(0);
}
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123';
process.env.AUTH_RATE_LIMIT = '1000';
const { app } = await import('../app.js');

let server, base;
const api = async (method, path, { body, token } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};
const signUp = async (name) => (await api('POST', '/auth/register', { body: { name, email: `${name.toLowerCase()}@example.com`, password: 'Password123' } })).body.token;

before(async () => {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  // dropDatabase also drops the unique index on email, so build every index again (otherwise duplicate emails would be accepted)
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  server.close();
});

describe('auth', () => {
  it('registers, logs in and never returns the password hash', async () => {
    const reg = await api('POST', '/auth/register', { body: { name: 'Ana', email: 'ANA@example.com', password: 'Password123' } });
    assert.equal(reg.status, 201);
    assert.equal(reg.body.user.email, 'ana@example.com'); // lower-cased
    assert.ok(!JSON.stringify(reg.body).includes('passwordHash'));
    const login = await api('POST', '/auth/login', { body: { email: 'ana@example.com', password: 'Password123' } });
    assert.equal(login.status, 200);
    assert.ok(login.body.token);
  });
  it('rejects a wrong password and a duplicate email', async () => {
    assert.equal((await api('POST', '/auth/login', { body: { email: 'ana@example.com', password: 'nope-nope-nope' } })).status, 401);
    assert.equal((await api('POST', '/auth/register', { body: { name: 'Ana', email: 'ana@example.com', password: 'Password123' } })).status, 409);
  });
  it('refuses NoSQL operator objects', async () => {
    const res = await api('POST', '/auth/login', { body: { email: { $gt: '' }, password: 'x' } });
    assert.equal(res.status, 400);
  });
});

describe('jobs', () => {
  it('needs a token', async () => {
    assert.equal((await api('GET', '/jobs')).status, 401);
    assert.equal((await api('GET', '/jobs', { token: 'garbage' })).status, 401);
  });
  it('creates, lists, updates and deletes my own jobs', async () => {
    const token = await signUp('Cara');
    const made = await api('POST', '/jobs', { token, body: { company: 'Acme', role: 'Clerk', user: 'ignored' } });
    assert.equal(made.status, 201);
    assert.equal(made.body.status, 'saved');
    const list = await api('GET', '/jobs?q=acme', { token });
    assert.equal(list.body.total, 1);
    const upd = await api('PUT', `/jobs/${made.body.id}`, { token, body: { status: 'offer' } });
    assert.equal(upd.body.status, 'offer');
    assert.equal((await api('DELETE', `/jobs/${made.body.id}`, { token })).status, 204);
  });
  it('validates input', async () => {
    const token = await signUp('Dan');
    const res = await api('POST', '/jobs', { token, body: { company: '', status: 'maybe' } });
    assert.equal(res.status, 400);
    assert.ok(res.body.details.company && res.body.details.status);
  });
  it('keeps people apart', async () => {
    const eve = await signUp('Eve');
    const fay = await signUp('Fay');
    const job = (await api('POST', '/jobs', { token: eve, body: { company: 'Secret Ltd', role: 'Spy' } })).body;
    assert.equal((await api('GET', `/jobs/${job.id}`, { token: fay })).status, 404);
    assert.equal((await api('PUT', `/jobs/${job.id}`, { token: fay, body: { status: 'offer' } })).status, 404);
    assert.equal((await api('GET', '/jobs', { token: fay })).body.total, 0);
  });
  it('paginates and counts', async () => {
    const token = await signUp('Gus');
    for (let i = 0; i < 12; i++) await api('POST', '/jobs', { token, body: { company: `Co ${i}`, role: 'Tester', status: i < 4 ? 'interview' : 'applied' } });
    const page2 = await api('GET', '/jobs?limit=5&page=2', { token });
    assert.equal(page2.body.items.length, 5);
    assert.equal(page2.body.pages, 3);
    const stats = await api('GET', '/jobs/stats', { token });
    assert.deepEqual([stats.body.total, stats.body.byStatus.interview, stats.body.byStatus.applied], [12, 4, 8]);
  });
});

describe('resume upload', () => {
  const form = (name, bytes, type = 'application/pdf') => { const f = new FormData(); f.append('resume', new Blob([bytes], { type }), name); return f; };
  const send = (path, method, token, body) => fetch(base + path, { method, headers: { Authorization: `Bearer ${token}` }, body });

  it('accepts a real PDF, serves it back, and refuses fakes', async () => {
    const token = await signUp('Hana');
    const job = (await api('POST', '/jobs', { token, body: { company: 'Acme', role: 'Clerk' } })).body;
    const pdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(200, 32)]);

    assert.equal((await send(`/jobs/${job.id}/resume`, 'POST', token, form('my cv.pdf', pdf))).status, 201);
    const back = await send(`/jobs/${job.id}/resume`, 'GET', token);
    assert.equal(back.status, 200);
    assert.deepEqual(Buffer.from(await back.arrayBuffer()), pdf);
    assert.equal((await api('GET', `/jobs/${job.id}`, { token })).body.resume.name, 'my cv.pdf');
    assert.ok(!JSON.stringify((await api('GET', `/jobs/${job.id}`, { token })).body).includes('storedName'));

    assert.equal((await send(`/jobs/${job.id}/resume`, 'POST', token, form('evil.exe', pdf))).status, 400);          // wrong type
    assert.equal((await send(`/jobs/${job.id}/resume`, 'POST', token, form('fake.pdf', Buffer.from('not a pdf')))).status, 400); // wrong content
    assert.equal((await send(`/jobs/${job.id}/resume`, 'POST', token, form('big.pdf', Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(3 * 1024 * 1024)])))).status, 413); // too big

    const other = await signUp('Ivan');
    assert.equal((await send(`/jobs/${job.id}/resume`, 'GET', other)).status, 404); // not Ivan's job
    assert.equal((await send(`/jobs/${job.id}/resume`, 'DELETE', token)).status, 204);
    assert.equal((await send(`/jobs/${job.id}/resume`, 'GET', token)).status, 404);
  });
});

