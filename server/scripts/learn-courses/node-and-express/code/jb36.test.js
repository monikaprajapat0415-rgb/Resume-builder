import test from 'node:test';
import assert from 'node:assert/strict';
import { createQueue, every } from './jb36-jobs.js';

test('jobs run, retry and end in the failed list', async () => {
  const seen = [];
  const attempts = new Map();
  const queue = createQueue({
    maxAttempts: 3,
    handler: async (data) => {
      seen.push(data.name);
      const count = (attempts.get(data.name) ?? 0) + 1;
      attempts.set(data.name, count);
      if (data.name === 'flaky' && count < 3) throw new Error('temporary');
      if (data.name === 'broken') throw new Error('always fails');
    },
  });
  queue.add({ name: 'ok' });
  queue.add({ name: 'flaky' });
  queue.add({ name: 'broken' });
  await queue.idle();

  assert.equal(queue.results.done, 2);                    // ok + flaky (on its 3rd try)
  assert.equal(attempts.get('broken'), 3);
  assert.deepEqual(queue.results.failed.map((f) => f.data.name), ['broken']);
});

test('every() repeats and stops', async () => {
  let ticks = 0;
  const stop = every(10, () => { ticks += 1; });
  await new Promise((r) => setTimeout(r, 55));
  stop();
  const after = ticks;
  await new Promise((r) => setTimeout(r, 30));
  assert.ok(after >= 3);
  assert.equal(ticks, after);
});
