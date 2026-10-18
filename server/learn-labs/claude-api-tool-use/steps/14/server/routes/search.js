import { Router } from 'express';
import { buildIndex, vectorSearch } from '../rag/index.js';

const router = Router();
const num = (v, d, min, max) => Math.min(max, Math.max(min, Number.isFinite(Number(v)) ? Number(v) : d));

// POST /api/search  { query, size, overlap, k }  ->  { chunkCount, hits }
// No Claude call here: this lesson is about retrieval only, so it is free and fast.
router.post('/search', (req, res) => {
  const query = String(req.body?.query || '').trim().slice(0, 300);
  if (!query) return res.status(400).json({ error: { message: 'Please type something to search for.' } });
  const size = num(req.body?.size, 80, 20, 300);
  const overlap = num(req.body?.overlap, 20, 0, size - 1);
  const k = num(req.body?.k, 4, 1, 10);

  res.json({
    chunkCount: buildIndex({ size, overlap }).length,
    hits: vectorSearch(query, { size, overlap, k }),
  });
});

export default router;
