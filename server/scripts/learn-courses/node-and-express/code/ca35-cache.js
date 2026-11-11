// Cache-aside: look in the cache first; on a miss, load from the slow source and store the answer.
// The cache is behind a tiny interface, so tests use memory and production uses Redis.
export function memoryCache({ now = () => Date.now() } = {}) {
  const items = new Map();
  return {
    async get(key) {
      const item = items.get(key);
      if (!item) return null;
      if (item.expiresAt <= now()) { items.delete(key); return null; }
      return item.value;
    },
    async set(key, value, ttlSeconds) { items.set(key, { value, expiresAt: now() + ttlSeconds * 1000 }); },
    async del(key) { items.delete(key); },
  };
}

// The same interface on top of Redis. NOT run in this course (it needs a Redis server): npm install ioredis
export function redisCache(redis) {
  return {
    async get(key) { const text = await redis.get(key); return text ? JSON.parse(text) : null; },
    async set(key, value, ttlSeconds) { await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds); },
    async del(key) { await redis.del(key); },
  };
}

export function cachedProductService({ cache, loadFromDb, ttlSeconds = 60 }) {
  const stats = { hits: 0, misses: 0 };
  return {
    stats,
    async get(id) {
      const key = `product:${id}`;
      const cached = await cache.get(key);
      if (cached) { stats.hits += 1; return cached; }
      stats.misses += 1;
      const product = await loadFromDb(id);
      if (product) await cache.set(key, product, ttlSeconds);
      return product;
    },
    // When data changes, remove the old copy. This is the hard part of caching.
    async invalidate(id) { await cache.del(`product:${id}`); },
  };
}
