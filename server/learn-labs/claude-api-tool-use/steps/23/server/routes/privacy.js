import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { redact, restore } from '../privacy.js';

const router = Router();

const clean = (v) => String(v || '').trim().slice(0, 8000);

// POST /api/privacy/preview  { text }  ->  { redacted, found }   (no AI call, free)
router.post('/privacy/preview', (req, res) => {
  const text = clean(req.body?.text);
  if (!text) return res.status(400).json({ error: { message: 'Please paste some text.' } });
  const { text: redacted, found } = redact(text);
  res.json({ redacted, found });
});

// POST /api/privacy/summarise  { text }  ->  { summary, sentToModel, found }
router.post('/privacy/summarise', async (req, res) => {
  const text = clean(req.body?.text);
  if (!text) return res.status(400).json({ error: { message: 'Please paste some text.' } });

  const { text: safe, found, map } = redact(text);
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: 'Summarise the resume text in 3 short bullet points. Keep placeholders like [EMAIL_1] exactly as written.',
    messages: [{ role: 'user', content: `<resume>\n${safe}\n</resume>` }],
  });

  // The model never saw the real values. We put them back for the user only.
  res.json({ summary: restore(textOf(reply), map), sentToModel: safe, found });
});

export default router;
