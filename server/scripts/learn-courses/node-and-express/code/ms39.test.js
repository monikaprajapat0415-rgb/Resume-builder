import test from 'node:test';
import assert from 'node:assert/strict';
import { startService, createBalancer } from './ms39-scale.js';

test('round robin, and a sick copy is skipped', async () => {
  const [a, b, c] = await Promise.all([startService('A'), startService('B'), startService('C')]);
  const balancer = createBalancer([a, b, c]);

  const first = [await balancer.forward(), await balancer.forward(), await balancer.forward()];
  assert.deepEqual(first, ['answered by A', 'answered by B', 'answered by C']);

  b.setHealthy(false);
  const next = new Set([await balancer.forward(), await balancer.forward(), await balancer.forward(), await balancer.forward()]);
  assert.ok(!next.has('answered by B'));
  assert.equal(next.size, 2);

  for (const s of [a, b, c]) s.server.close();
});
