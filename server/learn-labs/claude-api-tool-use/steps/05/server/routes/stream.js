import { Router } from 'express';
import { client, MODEL } from '../claude.js';
import { cleanMessages, lastIsUser } from '../messages.js';

const router = Router();

// POST /api/chat/stream  -> Server-Sent Events: "text" chunks, then "done" (or "error")
router.post('/chat/stream', async (req, res) => {
  const system = String(req.body?.system || '').slice(0, 2000);
  const messages = cleanMessages(req.body?.messages);
  if (!lastIsUser(messages)) {
    return res.status(400).json({ error: { message: 'Send at least one message from the user.' } });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // tells nginx not to hold the text back
  res.flushHeaders();

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 600,
    ...(system ? { system } : {}),
    messages,
  });

  // If the user closes the page or presses Stop, stop paying for tokens nobody reads.
  let aborted = false;
  res.on('close', () => {
    if (!res.writableEnded) {
      aborted = true;
      stream.abort();
    }
  });

  stream.on('text', (chunk) => send('text', chunk));

  try {
    const final = await stream.finalMessage();
    send('done', { usage: final.usage, stopReason: final.stop_reason });
  } catch (e) {
    if (!aborted) {
      console.error('[stream]', e?.message);
      send('error', { message: 'The reply was interrupted. Please try again.' });
    }
  } finally {
    res.end();
  }
});

export default router;
