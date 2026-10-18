import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { paragraphChunks } from '../rag/load.js';
import { keywordSearch } from '../rag/keyword.js';

const router = Router();
const chunks = paragraphChunks(); // read once when the server starts

const SYSTEM = `You answer questions for a resume website using ONLY the context the user provides.
If the context does not contain the answer, say exactly: "I don't have that in my notes."
Keep answers short and in plain English. Do not use outside knowledge.`;

// POST /api/rag  { question }  ->  { answer, sources, usedModel }
router.post('/rag', async (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 500);
  if (!question) return res.status(400).json({ error: { message: 'Please type a question.' } });

  // 1. Retrieve: find the 3 best chunks.
  const sources = keywordSearch(question, chunks, 3);

  // No match at all: do not even call the model, it would only guess.
  if (!sources.length) {
    return res.json({ answer: "I don't have that in my notes.", sources: [], usedModel: false });
  }

  // 2. Augment: put the chunks into the prompt, inside tags so the model can tell data from instructions.
  const context = sources.map((s, i) => `<chunk id="${i + 1}" source="${s.source}">\n${s.text}\n</chunk>`).join('\n');

  // 3. Generate: ask the model to answer from that context only.
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: SYSTEM,
    messages: [{ role: 'user', content: `<context>\n${context}\n</context>\n\nQuestion: ${question}` }],
  });

  res.json({ answer: textOf(reply), sources, usedModel: true });
});

export default router;
