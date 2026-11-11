// Project 1: a CRUD API for users, with validation, paging and clear status codes.
import express from 'express';
import { AppError, errorHandler, notFoundHandler } from './p-kit.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(body, { partial = false } = {}) {
  const out = {};
  if (!partial || 'name' in body) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) throw new AppError('name needs at least 2 letters', 422);
    out.name = body.name.trim();
  }
  if (!partial || 'email' in body) {
    if (typeof body.email !== 'string' || !EMAIL.test(body.email.trim())) throw new AppError('email is not valid', 422);
    out.email = body.email.trim().toLowerCase();
  }
  if ('age' in body) {
    if (!Number.isInteger(body.age) || body.age < 0 || body.age > 120) throw new AppError('age must be a whole number from 0 to 120', 422);
    out.age = body.age;
  }
  return out;
}

export function createApp() {
  const app = express();
  app.use(express.json());
  const users = new Map();
  let nextId = 1;
  const emailTaken = (email, exceptId) => [...users.values()].some((u) => u.email === email && u.id !== exceptId);

  app.post('/api/users', (req, res) => {
    const data = clean(req.body ?? {});
    if (emailTaken(data.email)) throw new AppError('That email is already used', 409);
    const user = { id: nextId++, createdAt: new Date().toISOString(), ...data };
    users.set(user.id, user);
    res.status(201).location(`/api/users/${user.id}`).json(user);
  });

  app.get('/api/users', (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
    const q = String(req.query.q ?? '').toLowerCase();
    const all = [...users.values()].filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.includes(q));
    res.json({ data: all.slice((page - 1) * limit, page * limit), meta: { page, limit, total: all.length } });
  });

  const find = (id) => users.get(Number(id)) ?? (() => { throw new AppError('User not found', 404); })();

  app.get('/api/users/:id', (req, res) => res.json(find(req.params.id)));

  // PUT replaces the user, PATCH changes only the fields you send.
  app.put('/api/users/:id', (req, res) => {
    const user = find(req.params.id);
    const data = clean(req.body ?? {});
    if (emailTaken(data.email, user.id)) throw new AppError('That email is already used', 409);
    delete user.age;                                 // PUT replaces: a field you leave out is removed
    res.json(Object.assign(user, data));
  });

  app.patch('/api/users/:id', (req, res) => {
    const user = find(req.params.id);
    const data = clean(req.body ?? {}, { partial: true });
    if (data.email && emailTaken(data.email, user.id)) throw new AppError('That email is already used', 409);
    res.json(Object.assign(user, data));
  });

  app.delete('/api/users/:id', (req, res) => {
    users.delete(find(req.params.id).id);
    res.status(204).end();
  });

  app.use(notFoundHandler, errorHandler);
  return app;
}
