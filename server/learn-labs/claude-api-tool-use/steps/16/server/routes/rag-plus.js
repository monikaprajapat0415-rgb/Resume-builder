import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { retrieve } from '../rag/hybrid.js';

const router = Router();

const SYSTEM = `You answer questions for a resume website using ONLY the numbered sources provided.
After every sentence that uses a source, add its number in square brackets, like [1] or [2][3].
If the sources do not contain the answer, reply exactly: "I don't have that in my notes."
Never invent a source number. Keep the answer short and in plain English.`;

// POST /api/rag-plus  { question, mode }  ->  { answer, citations, sources, mode }
router.post('/rag-plus', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 500);
  if (!question) return res.status(400).json({ error: { message: 'Please type a question.' } });
  const mode = ['keyword', 'vector', 'hybrid'].includes(req.body?.mode) ? req.body.mode : 'hybrid';

  const sources = retrieve(question, { mode, k: 4 });
  if (!sources.length) return res.json({ answer: "I don't have that in my notes.", citations: [], sources: [], mode });

  const context = sources.map((s, i) => `<source n="${i + 1}" file="${s.source}">\n${s.text}\n</source>`).join('\n');
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: SYSTEM,
    messages: [{ role: 'user', content: `<sources>\n${context}\n</sources>\n\nQuestion: ${question}` }],
  });
  const answer = textOf(reply);

  // Check the citations: keep only numbers that really exist. A made-up [9] is dropped and reported.
  const cited = [...new Set([...answer.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))];
  const citations = cited.filter((n) => n >= 1 && n <= sources.length);
  const invalid = cited.filter((n) => n < 1 || n > sources.length);

  res.json({ answer, citations, invalidCitations: invalid, sources, mode });
});

export default router;
