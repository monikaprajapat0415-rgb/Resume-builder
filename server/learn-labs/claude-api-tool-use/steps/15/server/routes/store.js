import { Router } from 'express';
import { getStore } from '../rag/store.js';

const router = Router();

// GET /api/store  ->  { count, sources, items }
router.get('/store', (req, res) => {
  const items = getStore().list();
  res.json({ count: items.length, sources: [...new Set(items.map((i) => i.source))], items });
});

// POST /api/store/query  { query, source?, k? }  ->  { hits }
router.post('/store/query', (req, res) => {
  const query = String(req.body?.query || '').trim().slice(0, 300);
  if (!query) return res.status(400).json({ error: { message: 'Please type a query.' } });
  const source = req.body?.source ? String(req.body.source).slice(0, 100) : undefined;
  const k = Math.min(10, Math.max(1, Number(req.body?.k) || 4));
  res.json({ hits: getStore().query(query, { k, source }) });
});

// POST /api/store/upsert  { text, source?, id? }  ->  { id, count }
router.post('/store/upsert', (req, res) => {
  const text = String(req.body?.text || '').trim().slice(0, 4000);
  if (text.length < 10) return res.status(400).json({ error: { message: 'Write at least 10 characters.' } });
  const source = String(req.body?.source || 'my-notes.md').slice(0, 100);
  const store = getStore();
  const id = String(req.body?.id || `${source}#${Date.now().toString(36)}`).slice(0, 120);
  store.upsert({ id, source, title: source, text });
  res.json({ id, count: store.count() });
});

// DELETE /api/store/:id  ->  { removed, count }
router.delete('/store/:id', (req, res) => {
  const store = getStore();
  const removed = store.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: { message: 'No such item.' } });
  res.json({ removed: true, count: store.count() });
});

export default router;
