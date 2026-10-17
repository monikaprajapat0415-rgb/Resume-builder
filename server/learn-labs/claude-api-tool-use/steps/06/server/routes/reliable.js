import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { MODEL, textOf } from '../claude.js';
import { withRetry, isRetryable } from '../retry.js';

const router = Router();

// This client does NOT retry by itself and gives up after 20 seconds,
// so you can see our own retry logic working.
const strict = new Anthropic({ maxRetries: 0, timeout: 20_000 });

const fake = (status) => Object.assign(new Error('simulated error'), { status });

// POST /api/reliable-ask  { question, simulate? }   simulate: 'flaky' | 'down' | 'bad'
router.post('/reliable-ask', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 2000);
  const simulate = String(req.body?.simulate || '');
  if (!question) return res.status(400).json({ error: { message: 'Please type a question.' } });

  try {
    const { value, attempts } = await withRetry(async (attempt) => {
      // Fake failures so you can test without waiting for a real outage.
      if (simulate === 'flaky' && attempt < 3) throw fake(429);
      if (simulate === 'down') throw fake(503);
      if (simulate === 'bad') throw fake(400);

      return strict.messages.create({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: 'user', content: question }],
      });
    });
    res.json({ text: textOf(value), attempts });
  } catch (e) {
    console.error('[reliable]', e?.status, e?.message);
    const retryable = isRetryable(e);
    res.status(e?.status >= 400 && e?.status < 600 ? e.status : 502).json({
      error: {
        message: retryable ? 'The AI service is busy right now. You can try again.' : 'We could not process that request.',
        retryable,
        attempts: e.attempts ?? 1,
      },
    });
  }
});

export default router;
