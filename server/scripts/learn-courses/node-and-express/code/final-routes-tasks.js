import { Router } from 'express';
import { checkTask } from '../validate.js';

export function tasksRouter(store) {
  const router = Router();

  router.get('/', async (req, res) => {
    const list = await store.list(req.user.id);
    const { done } = req.query;
    if (done === 'true') return res.json(list.filter((t) => t.done));
    if (done === 'false') return res.json(list.filter((t) => !t.done));
    res.json(list);
  });

  router.get('/:id', async (req, res) => {
    const task = await store.get(req.user.id, Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });

  router.post('/', async (req, res) => {
    const { value, error } = checkTask(req.body);
    if (error) return res.status(400).json({ error });
    const task = await store.create(req.user.id, value);
    res.status(201).location(`/api/tasks/${task.id}`).json(task);
  });

  router.patch('/:id', async (req, res) => {
    const { value, error } = checkTask(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const task = await store.update(req.user.id, Number(req.params.id), value);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });

  router.delete('/:id', async (req, res) => {
    const removed = await store.remove(req.user.id, Number(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Task not found' });
    res.status(204).end();
  });

  return router;
}
