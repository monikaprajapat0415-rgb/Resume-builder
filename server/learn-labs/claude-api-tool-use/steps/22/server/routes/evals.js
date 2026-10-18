import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { client, MODEL } from '../claude.js';
import { retrieve } from '../rag/hybrid.js';
import { answerQuestion } from '../rag/answer.js';

const router = Router();
const here = path.dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(fs.readFileSync(path.join(here, '..', 'evals', 'cases.json'), 'utf8'));
const lower = (s) => String(s).toLowerCase();

// LLM-as-a-judge: a second model call checks whether the answer is supported by the sources.
async function judge(question, answer, sources) {
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: 'You are a strict grader. Say faithful=true only if EVERY claim in the answer is supported by the sources.',
    tools: [{
      name: 'grade',
      description: 'Submit the grade.',
      input_schema: { type: 'object', properties: { faithful: { type: 'boolean' }, reason: { type: 'string' } }, required: ['faithful', 'reason'] },
    }],
    tool_choice: { type: 'tool', name: 'grade' },
    messages: [{ role: 'user', content: `Question: ${question}\n\nAnswer: ${answer}\n\nSources:\n${sources.map((s) => s.text).join('\n---\n')}` }],
  });
  return reply.content.find((b) => b.type === 'tool_use')?.input || { faithful: false, reason: 'No grade returned.' };
}

// POST /api/evals/run  { mode: 'retrieval' | 'full' }  ->  { summary, rows }
router.post('/evals/run', async (req, res) => {
  const full = req.body?.mode === 'full';
  const rows = [];

  for (const c of cases) {
    // Retrieval check (free): did the right document come back in the top 4?
    const hits = retrieve(c.question, { mode: 'hybrid', k: 4 });
    const rank = c.expectedSource ? hits.findIndex((h) => h.source === c.expectedSource) + 1 : 0;
    const row = { id: c.id, question: c.question, retrievalOk: c.expectedSource ? rank > 0 : true, rank: rank || null };

    if (full) {
      const r = await answerQuestion(c.question);
      const answer = lower(r.answer);
      const missing = (c.mustContain || []).filter((t) => !answer.includes(lower(t)));
      const forbidden = (c.mustNotContain || []).filter((t) => answer.includes(lower(t)));
      const verdict = r.sources.length ? await judge(c.question, r.answer, r.sources) : { faithful: true, reason: 'No sources, so the model must refuse.' };
      Object.assign(row, {
        answer: r.answer, missing, forbidden, faithful: verdict.faithful, reason: verdict.reason,
        invalidCitations: r.invalidCitations,
        passed: row.retrievalOk && !missing.length && !forbidden.length && verdict.faithful && !r.invalidCitations.length,
      });
    } else {
      row.passed = row.retrievalOk;
    }
    rows.push(row);
  }

  const answered = rows.filter((r) => r.rank);
  const summary = {
    mode: full ? 'full' : 'retrieval',
    total: rows.length,
    passed: rows.filter((r) => r.passed).length,
    hitRate: Number((answered.length / (cases.filter((c) => c.expectedSource).length || 1)).toFixed(2)),
    mrr: Number((answered.reduce((s, r) => s + 1 / r.rank, 0) / (answered.length || 1)).toFixed(2)),
  };
  res.json({ summary, rows });
});

export default router;
