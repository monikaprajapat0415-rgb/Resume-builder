import express from 'express';
const app = express();

const tasks = [
  { id: 1, title: 'Learn Node', done: true },
  { id: 2, title: 'Learn Express', done: false },
  { id: 3, title: 'Build an API', done: false },
];

app.get('/api/tasks', (req, res) => {
  const { done } = req.query;               // /api/tasks?done=true
  let list = tasks;
  if (done === 'true') list = tasks.filter((t) => t.done);
  if (done === 'false') list = tasks.filter((t) => !t.done);
  res.json(list);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.listen(3000, () => console.log('Server running'));
