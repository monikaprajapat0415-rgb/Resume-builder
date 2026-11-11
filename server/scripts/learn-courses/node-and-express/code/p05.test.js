import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './p05-employees.js';
import { signToken } from './p-kit.js';

const as = (id, role) => ({ Authorization: `Bearer ${signToken({ id, role, name: `u${id}` })}` });

test('project 5: departments, visibility and attendance', async () => {
  let clock = new Date('2026-11-10T09:00:00Z');
  const app = createApp({ now: () => clock });
  const hr = as(1, 'hr');

  assert.equal((await request(app).post('/api/departments').set(as(5, 'employee')).send({ name: 'Eng' })).status, 403);
  await request(app).post('/api/departments').set(hr).send({ name: 'Engineering' });
  await request(app).post('/api/departments').set(hr).send({ name: 'Sales' });
  assert.equal((await request(app).post('/api/departments').set(hr).send({ name: 'engineering' })).status, 409);

  await request(app).post('/api/employees').set(hr).send({ name: 'Asha', departmentId: 1, userId: 10 });
  await request(app).post('/api/employees').set(hr).send({ name: 'Ravi', departmentId: 1, userId: 11 });
  await request(app).post('/api/employees').set(hr).send({ name: 'Meera', departmentId: 2, userId: 12 });
  assert.equal((await request(app).post('/api/employees').set(hr).send({ name: 'X', departmentId: 99 })).status, 422);

  assert.equal((await request(app).get('/api/employees').set(hr)).body.length, 3);
  assert.deepEqual((await request(app).get('/api/employees').set(as(10, 'manager'))).body.map((e) => e.name), ['Asha', 'Ravi']);
  assert.deepEqual((await request(app).get('/api/employees').set(as(12, 'employee'))).body.map((e) => e.name), ['Meera']);

  const asha = as(10, 'employee');
  assert.equal((await request(app).post('/api/attendance/check-out').set(asha)).status, 409);
  assert.equal((await request(app).post('/api/attendance/check-in').set(asha)).status, 201);
  assert.equal((await request(app).post('/api/attendance/check-in').set(asha)).status, 409);
  clock = new Date('2026-11-10T17:30:00Z');
  const out = await request(app).post('/api/attendance/check-out').set(asha);
  assert.equal(out.body.hours, 8.5);

  assert.equal((await request(app).get('/api/attendance?date=2026-11-10').set(hr)).body.length, 1);
  assert.equal((await request(app).get('/api/attendance').set(asha)).status, 403);

  await request(app).delete('/api/employees/1').set(hr);
  clock = new Date('2026-11-11T09:00:00Z');
  assert.equal((await request(app).post('/api/attendance/check-in').set(asha)).status, 403);      // no longer active
});
