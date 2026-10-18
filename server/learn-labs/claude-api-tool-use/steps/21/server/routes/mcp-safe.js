import { Router } from 'express';
import { start, decide } from '../mcp/safe-bridge.js';

const router = Router();

// POST /api/mcp/safe  { message }  ->  { status: 'done' | 'pending', text?, approval?, trace }
router.post('/mcp/safe', async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 4000);
  if (!message) return res.status(400).json({ error: { message: 'Please type a message.' } });
  res.json(await start(message));
});

// POST /api/mcp/approve  { id, approved }  ->  same shape as above
router.post('/mcp/approve', async (req, res) => {
  const id = String(req.body?.id || '');
  const out = await decide(id, req.body?.approved === true);
  if (!out) return res.status(410).json({ error: { message: 'That request expired. Please ask again.' } });
  res.json(out);
});

export default router;
