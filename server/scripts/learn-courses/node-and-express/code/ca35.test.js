import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryCache, cachedProductService } from './ca35-cache.js';

test('hit, miss, expiry and invalidation', async () => {
  let time = 0;
  let dbCalls = 0;
  const service = cachedProductService({
    cache: memoryCache({ now: () => time }),
    loadFromDb: async (id) => { dbCalls += 1; return { id, name: 'Lamp' }; },
    ttlSeconds: 60,
  });

  await service.get(1);
  await service.get(1);
  assert.deepEqual(service.stats, { hits: 1, misses: 1 });
  assert.equal(dbCalls, 1);

  time = 61_000;                          // the entry has expired
  await service.get(1);
  assert.equal(dbCalls, 2);

  await service.invalidate(1);
  await service.get(1);
  assert.equal(dbCalls, 3);
});
