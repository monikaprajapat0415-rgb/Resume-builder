import { Router } from 'express';
import { answerQuestion } from '../rag/answer.js';
import { retrieve } from '../rag/hybrid.js';
import { cacheGet, cacheSet, cacheKey, rateLimit, record, metrics } from '../ops.js';

const router = Router();

// POST /api/ops/ask  { question }
// Cached, rate limited, timed, measured, and it degrades gracefully when the AI is unavailable.
router.post('/ops/ask', rateLimit({ limit: 10 }), async (req, res) => {
  const started = Date.now();
  const question = String(req.body?.question || '').trim().slice(0, 500);
  if (!question) return res.status(400).json({ error: { message: 'Please type a question.' } });

  const key = cacheKey('ask', question);
  const cached = cacheGet(key);
  if (cached) {
    record({ route: 'ask', ms: Date.now() - started, cached: true });
    return res.json({ ...cached, cached: true });
  }

  try {
    const result = await answerQuestion(question, 'hybrid', { timeoutMs: 15000 });
    cacheSet(key, result);
    record({ route: 'ask', ms: Date.now() - started, usage: result.usage });
    return res.json({ ...result, cached: false });
  } catch (e) {
    // Fallback: the AI failed or timed out, so show the best passages instead of an error page.
    record({ route: 'ask', ms: Date.now() - started, fallback: true, error: true });
    console.error('[ops] AI failed:', e?.status || '', e?.message);
    const sources = retrieve(question, { mode: 'hybrid', k: 3 });
    return res.json({
      answer: 'The AI assistant is busy right now. These are the most relevant notes:',
      sources, citations: [], invalidCitations: [], fallback: true, cached: false, usage: { input: 0, output: 0 },
    });
  }
});

// GET /api/ops/metrics
router.get('/ops/metrics', (req, res) => res.json(metrics()));

export default router;
