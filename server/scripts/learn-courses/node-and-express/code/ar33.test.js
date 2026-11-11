import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp, TaskService, memoryTaskRepository, RuleError } from './ar33-layers.js';

test('service rules can be tested with no HTTP at all', async () => {
  const service = new TaskService({ tasks: memoryTaskRepository(), clock: () => new Date('2026-01-01T00:00:00Z') });
  const first = await service.create(1, '  Write notes ');
  assert.equal(first.title, 'Write notes');
  assert.equal(first.createdAt, '2026-01-01T00:00:00.000Z');
  await service.create(1, 'Two');
  await service.create(1, 'Three');
  await assert.rejects(service.create(1, 'Four'), RuleError);
  await service.complete(1, first.id);
  await service.create(1, 'Four now fits');
});

test('through HTTP: status codes come from the error mapper', async () => {
  const app = createApp();
  assert.equal((await request(app).post('/tasks').send({})).status, 422);
  const task = await request(app).post('/tasks').send({ title: 'A' });
  assert.equal(task.status, 201);
  assert.equal((await request(app).post(`/tasks/${task.body.id}/complete`).set('x-user-id', '2')).status, 404);   // not your task
  assert.equal((await request(app).post(`/tasks/${task.body.id}/complete`)).body.done, true);
});
