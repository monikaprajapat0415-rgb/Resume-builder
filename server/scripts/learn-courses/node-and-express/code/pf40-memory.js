// A memory leak you can see, and the fix. Run with:  node --expose-gc pf40-memory.js
const heapMb = () => { global.gc(); return Math.round(process.memoryUsage().heapUsed / 1024 / 1024); };

// LEAK: this cache only ever grows, because nothing removes old entries.
const leaky = new Map();
function handleRequestLeaky(id) { leaky.set(id, Array.from({ length: 1000 }, (_, k) => k + id)); }

// FIX: a cache with a size limit that drops the oldest entry (a simple LRU idea).
const bounded = new Map();
function handleRequestBounded(id, limit = 100) {
  bounded.set(id, Array.from({ length: 1000 }, (_, k) => k + id));
  if (bounded.size > limit) bounded.delete(bounded.keys().next().value);
}

const before = heapMb();
for (let i = 0; i < 20_000; i++) handleRequestLeaky(i);
const afterLeak = heapMb();
leaky.clear();
const afterClear = heapMb();
for (let i = 0; i < 20_000; i++) handleRequestBounded(i);
const afterBounded = heapMb();

console.log('Leaky cache grew the heap by more than 50 MB:', afterLeak - before > 50);
console.log('Bounded cache stays small (under 20 MB more):', afterBounded - afterClear < 20);
console.log('Bounded size:', bounded.size);
