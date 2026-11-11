// Layers: route -> controller -> service -> repository. Each layer knows only the one below it.
import express from 'express';

// Repository: the ONLY place that knows how data is stored. Swap it for a Mongoose one without touching anything else.
export function memoryTaskRepository() {
  const rows = new Map();
  let nextId = 1;
  return {
    async list(ownerId) { return [...rows.values()].filter((t) => t.ownerId === ownerId); },
    async find(id) { return rows.get(id) ?? null; },
    async insert(data) { const task = { id: nextId++, done: false, ...data }; rows.set(task.id, task); return task; },
    async update(id, changes) { Object.assign(rows.get(id), changes); return rows.get(id); },
  };
}

// Service: business rules. It gets its dependencies handed in (dependency injection), so tests can pass fakes.
export class TaskService {
  constructor({ tasks, clock = () => new Date() }) {
    this.tasks = tasks;
    this.clock = clock;
  }

  async create(ownerId, title) {
    if (!title?.trim()) throw new ValidationError('title is required');
    if ((await this.tasks.list(ownerId)).filter((t) => !t.done).length >= 3) {
      throw new RuleError('Finish a task before adding more than 3 open tasks');   // a business rule, not an HTTP rule
    }
    return this.tasks.insert({ ownerId, title: title.trim(), createdAt: this.clock().toISOString() });
  }

  async complete(ownerId, id) {
    const task = await this.tasks.find(id);
    if (!task || task.ownerId !== ownerId) throw new NotFoundError('Task not found');   // do not reveal other people's ids
    return this.tasks.update(id, { done: true });
  }
}

export class ValidationError extends Error {}
export class RuleError extends Error {}
export class NotFoundError extends Error {}

// Controller: HTTP in, HTTP out. No rules here.
export function taskController(service) {
  return {
    create: async (req, res) => res.status(201).json(await service.create(req.userId, req.body?.title)),
    complete: async (req, res) => res.json(await service.complete(req.userId, Number(req.params.id))),
  };
}

// Composition root: the one place where real objects are wired together.
export function createApp({ tasks = memoryTaskRepository() } = {}) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.userId = Number(req.get('x-user-id') ?? 1); next(); });   // stand-in for real auth
  const controller = taskController(new TaskService({ tasks }));
  app.post('/tasks', controller.create);
  app.post('/tasks/:id/complete', controller.complete);

  // Map business errors to HTTP in ONE place.
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(422).json({ error: err.message });
    if (err instanceof RuleError) return res.status(409).json({ error: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Something went wrong' });
  });
  return app;
}
