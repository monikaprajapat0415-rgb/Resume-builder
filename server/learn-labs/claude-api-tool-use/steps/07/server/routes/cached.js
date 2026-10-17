import { Router } from 'express';
import fs from 'node:fs';
import { client, MODEL, textOf } from '../claude.js';

const router = Router();

// The long, never-changing rules. Caching works best on big, stable text.
const RULES = fs.readFileSync(new URL('../data/resume-rules.txt', import.meta.url), 'utf8');

// POST /api/cached  { resume }
router.post('/cached', async (req, res) => {
  const resume = String(req.body?.resume || '').trim().slice(0, 12000);
  if (!resume) return res.status(400).json({ error: { message: 'Please paste a resume.' } });

  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    // Stable text FIRST, marked for caching. The changing resume goes in the user message.
    system: [{ type: 'text', text: RULES, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `<resume>\n${resume}\n</resume>\nReview this resume.` }],
  });

  const u = reply.usage;
  res.json({
    text: textOf(reply),
    usage: {
      input: u.input_tokens,
      output: u.output_tokens,
      cacheWrite: u.cache_creation_input_tokens ?? 0, // tokens saved into the cache
      cacheRead: u.cache_read_input_tokens ?? 0,      // tokens read back from the cache
    },
  });
});

export default router;
