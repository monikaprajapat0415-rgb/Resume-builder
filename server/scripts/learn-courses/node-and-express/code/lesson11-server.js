import express from 'express';
import { createStore } from './store.js';
import { checkTask } from './validate.js';

const port = Number(process.env.PORT) || 3000;
const store = createStore(process.env.DATA_FILE || './data/tasks.json');

const app = express();
app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  res.json(await store.list());
});

app.post('/api/tasks', async (req, res) => {
  const { value, error } = checkTask(req.body);
  if (error) return res.status(400).json({ error });
  res.status(201).json(await store.create(value));
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { value, error } = checkTask(req.body, { partial: true });
  if (error) return res.status(400).json({ error });
  const task = await store.update(Number(req.params.id), value);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const removed = await store.remove(Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

app.listen(port, () => console.log(`Server running on port ${port}`));
