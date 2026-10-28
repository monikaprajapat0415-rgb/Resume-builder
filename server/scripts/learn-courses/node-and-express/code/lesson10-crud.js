import express from 'express';
import { checkTask } from './validate.js';

const app = express();
app.use(express.json());

let tasks = [{ id: 1, title: 'Learn Node', done: true }];
let nextId = 2;

app.get('/api/tasks', (req, res) => res.json(tasks));

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const { value, error } = checkTask(req.body);
  if (error) return res.status(400).json({ error });
  const task = { id: nextId++, title: value.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/crash', async () => {
  throw new Error('Something broke on purpose');   // Express 5 catches this
});

// 1. Anything that did not match a route above
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 2. The error handler: it has FOUR parameters
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Body is not valid JSON' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Body is too large' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
