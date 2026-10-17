import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { labJobs } from '../lab-jobs.js';
import { rateLimit } from '../rate-limit.js';

const router = Router();

const PROMPT_A = 'Summarise this job post for a candidate:\n\n{{job}}';

const DEFAULT_B = `<instructions>
Summarise the job post for a candidate who reads on a phone.
Write exactly 3 bullet points. Start each line with "- ".
Each bullet is at most 20 words, in plain English.
Mention pay only if the post states it. Never invent details.
</instructions>

<job_post>
{{job}}
</job_post>`;

// The checks are plain code. They are cheap, fast and always give the same answer.
function check(output) {
  const lines = output.split('\n').map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith('- '));
  const longest = Math.max(0, ...bullets.map((l) => l.slice(2).split(/\s+/).length));
  return {
    threeBullets: bullets.length === 3 && lines.length === 3,
    shortLines: bullets.length > 0 && longest <= 20,
  };
}

async function run(template, job) {
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: template.replace('{{job}}', job) }],
  });
  const text = textOf(reply).trim();
  return { text, checks: check(text), tokens: reply.usage.output_tokens };
}

// GET /api/prompt-lab/default  -> the starting version of prompt B
router.get('/prompt-lab/default', (req, res) => res.json({ promptA: PROMPT_A, promptB: DEFAULT_B }));

// POST /api/prompt-lab  { promptB }  -> runs prompt A and prompt B on every test job
router.post('/prompt-lab', rateLimit({ max: 5, windowMs: 60_000 }), async (req, res) => {
  const promptB = String(req.body?.promptB || DEFAULT_B).slice(0, 3000);
  if (!promptB.includes('{{job}}')) {
    return res.status(400).json({ error: { message: 'Your prompt must contain {{job}} where the job post goes.' } });
  }

  const rows = await Promise.all(
    labJobs.map(async (job) => {
      const [a, b] = await Promise.all([run(PROMPT_A, job.text), run(promptB, job.text)]);
      return { id: job.id, a, b };
    }),
  );
  const passed = (key) => rows.filter((r) => r[key].checks.threeBullets && r[key].checks.shortLines).length;
  res.json({ rows, summary: { total: rows.length, passedA: passed('a'), passedB: passed('b') } });
});

export default router;
