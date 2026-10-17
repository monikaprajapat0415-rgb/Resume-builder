import { Router } from 'express';
import { client, MODEL } from '../claude.js';

const router = Router();

// POST /api/count  { text }  ->  { inputTokens }   (does not generate anything, so no output cost)
router.post('/count', async (req, res) => {
  const text = String(req.body?.text || '').slice(0, 20000);
  if (!text.trim()) return res.status(400).json({ error: { message: 'Please type some text.' } });

  const result = await client.messages.countTokens({
    model: MODEL,
    messages: [{ role: 'user', content: text }],
  });
  res.json({ inputTokens: result.input_tokens });
});

// GET /api/pricing  ->  the prices YOU put in .env (we never hard-code prices)
const num = (v) => (v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);

router.get('/pricing', (req, res) => {
  res.json({
    inputPerMillion: num(process.env.PRICE_INPUT_PER_MTOK),
    outputPerMillion: num(process.env.PRICE_OUTPUT_PER_MTOK),
    currency: process.env.PRICE_CURRENCY || 'USD',
  });
});

export default router;
