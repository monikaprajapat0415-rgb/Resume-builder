import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
