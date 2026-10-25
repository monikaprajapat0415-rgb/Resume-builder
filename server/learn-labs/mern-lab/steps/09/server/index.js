// Lesson 9: the first Express server.
import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 5000;

// A route = an HTTP method + a path + a function that answers.
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Route parameters and query strings
app.get('/api/hello/:name', (req, res) => {
  const shout = req.query.shout === 'true';
  const text = `Hello, ${req.params.name}!`;
  res.json({ message: shout ? text.toUpperCase() : text });
});

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
