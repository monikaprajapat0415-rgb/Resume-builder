import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';

const router = Router();

// POST /api/ask  { question }  ->  { text, usage, stopReason }
router.post('/ask', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 2000);
  if (!question) {
    return res.status(400).json({ error: { message: 'Please type a question.' } });
  }

  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [{ role: 'user', content: question }],
  });

  res.json({ text: textOf(reply), usage: reply.usage, stopReason: reply.stop_reason });
});

export default router;
