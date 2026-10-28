import express from 'express';

const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: 'Learn Node', done: true },
  { id: 2, title: 'Learn Express', done: false },
];
let nextId = 3;

// Read all
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Read one
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// Create
app.post('/api/tasks', (req, res) => {
  const task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Update part of a task
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if ('title' in req.body) task.title = req.body.title;
  if ('done' in req.body) task.done = req.body.done;
  res.json(task);
});

// Delete
app.delete('/api/tasks/:id', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  if (tasks.length === before) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
