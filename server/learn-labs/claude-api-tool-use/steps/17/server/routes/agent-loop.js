import { Router } from 'express';
import { runAgent } from '../agents.js';
import { retrieve } from '../rag/hybrid.js';

const router = Router();

// Long-term memory: facts the agent chose to remember, kept per browser session.
// (In production this would live in a database, not in server memory.)
const memory = new Map(); // sessionId -> { facts: { key: value } }

const tools = [
  {
    name: 'search_docs',
    description: 'Search the help-center documents about resumes, ATS, cover letters, interviews, job search and privacy. Returns the best matching passages. Call it before answering any question about those topics.',
    input_schema: { type: 'object', properties: { query: { type: 'string', description: 'A short search query' } }, required: ['query'] },
  },
  {
    name: 'remember',
    description: 'Save one short fact about the user (for example their job title or city) so it can be used in later conversations.',
    input_schema: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' } }, required: ['key', 'value'] },
  },
];

// POST /api/agent-loop  { goal, sessionId }  ->  { text, trace, turns, stopReason, usage, facts }
router.post('/agent-loop', async (req, res) => {
  const goal = String(req.body?.goal || '').trim().slice(0, 1500);
  if (!goal) return res.status(400).json({ error: { message: 'Please describe a goal.' } });
  const sessionId = String(req.body?.sessionId || 'default').slice(0, 60);
  const mem = memory.get(sessionId) || { facts: {} };
  memory.set(sessionId, mem);

  const known = Object.entries(mem.facts).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '(nothing yet)';
  const system = `You are a careful career assistant. Work toward the user's goal step by step.
Use search_docs to look things up before you answer. Use remember when the user tells you a lasting fact about themselves.
When you have enough information, reply with a short final answer and stop calling tools.

Facts you already know about this user:
${known}`;

  const handlers = {
    search_docs: ({ query }) => ({ passages: retrieve(String(query), { mode: 'hybrid', k: 3 }).map((p) => ({ source: p.source, text: p.text })) }),
    remember: ({ key, value }) => {
      if (Object.keys(mem.facts).length >= 20) throw new Error('Memory is full.');
      mem.facts[String(key).slice(0, 40)] = String(value).slice(0, 200);
      return { saved: true };
    },
  };

  const result = await runAgent({ system, user: goal, tools, handlers, maxTurns: 6 });
  res.json({ ...result, facts: mem.facts });
});

// DELETE /api/agent-loop/memory  { sessionId }  -> forget everything
router.delete('/agent-loop/memory', (req, res) => {
  memory.delete(String(req.body?.sessionId || 'default').slice(0, 60));
  res.json({ cleared: true });
});

export default router;
