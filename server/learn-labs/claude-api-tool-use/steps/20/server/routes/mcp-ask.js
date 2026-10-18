import { Router } from 'express';
import { askWithMcp } from '../mcp/bridge.js';

const router = Router();

// POST /api/mcp/ask  { message }  ->  { text, trace, tools }
router.post('/mcp/ask', async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 6000);
  if (!message) return res.status(400).json({ error: { message: 'Please type a message.' } });
  res.json(await askWithMcp(message, { servers: ['resume-tools'] }));
});

export default router;
