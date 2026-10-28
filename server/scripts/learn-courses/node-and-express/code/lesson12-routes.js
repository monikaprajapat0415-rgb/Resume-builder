import { Router } from 'express';
import mongoose from 'mongoose';
import { Task } from './models.js';
import { checkTask } from './validate.js';

export const tasksRouter = Router();

// A bad id would make Mongoose throw a CastError, so check it first
const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Task not found' });
  next();
};

tasksRouter.get('/', async (req, res) => {
  const filter = {};
  if (req.query.done === 'true') filter.done = true;
  if (req.query.done === 'false') filter.done = false;
  res.json(await Task.find(filter).sort({ createdAt: -1 }).limit(100));
});

tasksRouter.get('/:id', validId, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

tasksRouter.post('/', async (req, res) => {
  const { value, error } = checkTask(req.body);
  if (error) return res.status(400).json({ error });
  res.status(201).json(await Task.create(value));
});

tasksRouter.patch('/:id', validId, async (req, res) => {
  const { value, error } = checkTask(req.body, { partial: true });
  if (error) return res.status(400).json({ error });
  const task = await Task.findByIdAndUpdate(req.params.id, value, { returnDocument: 'after', runValidators: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

tasksRouter.delete('/:id', validId, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});
