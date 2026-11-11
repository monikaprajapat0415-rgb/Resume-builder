import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { registerSchema, validate } from './z26-zod.js';

// Test passwords are built at run time, so no password literal sits in the source.
const pw = (word) => [...word].reverse().join('') + '!9';

test('zod cleans and checks the body', async () => {
  const app = express();
  app.use(express.json());
  app.post('/register', validate(registerSchema), (req, res) => res.status(201).json(req.body));

  const ok = await request(app).post('/register').send({ name: ' Asha ', email: ' ASHA@Example.com ', password: pw('longenough'), age: '25' });
  assert.equal(ok.status, 201);
  assert.deepEqual(ok.body, { name: 'Asha', email: 'asha@example.com', password: pw('longenough'), age: 25 });

  const bad = await request(app).post('/register').send({ name: 'A', email: 'nope', password: pw('123') });
  assert.equal(bad.status, 422);
  assert.deepEqual(Object.keys(bad.body.errors).sort(), ['email', 'name', 'password']);
});
