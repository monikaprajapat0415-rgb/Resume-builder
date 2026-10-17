import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { cleanMessages, lastIsUser } from '../messages.js';

const router = Router();

// POST /api/chat  { system?, messages: [{role, content}] }
// Claude has no memory, so the browser sends the whole conversation every time.
router.post('/chat', async (req, res) => {
  const system = String(req.body?.system || '').slice(0, 2000);
  const messages = cleanMessages(req.body?.messages);
  if (!lastIsUser(messages)) {
    return res.status(400).json({ error: { message: 'Send at least one message from the user.' } });
  }

  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    ...(system ? { system } : {}),
    messages,
  });

  res.json({ text: textOf(reply), usage: reply.usage, stopReason: reply.stop_reason });
});

export default router;
