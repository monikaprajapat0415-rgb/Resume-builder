// Supertest + node:test (built in, nothing extra to install except supertest).
import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';

function createApp({ weather }) {
  const app = express();
  app.get('/api/advice', async (req, res) => {
    const { tempC } = await weather.get(req.query.city);
    res.json({ advice: tempC > 30 ? 'Drink water' : 'Enjoy the day' });
  });
  return app;
}

test('a mocked dependency lets us test hot and mild days', async () => {
  const weather = { get: mock.fn(async () => ({ tempC: 38 })) };
  const app = createApp({ weather });

  assert.equal((await request(app).get('/api/advice?city=Pune')).body.advice, 'Drink water');
  assert.equal(weather.get.mock.callCount(), 1);
  assert.deepEqual(weather.get.mock.calls[0].arguments, ['Pune']);

  weather.get.mock.mockImplementation(async () => ({ tempC: 22 }));
  assert.equal((await request(app).get('/api/advice?city=Pune')).body.advice, 'Enjoy the day');
});
