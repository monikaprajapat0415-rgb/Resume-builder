import express from 'express';
const app = express();

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.use(express.json());

app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(3000, () => console.log('Server running'));
