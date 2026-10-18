import { client, MODEL, textOf } from '../claude.js';
import { retrieve } from './hybrid.js';

const SYSTEM = `You answer questions for a resume website using ONLY the numbered sources provided.
After every sentence that uses a source, add its number in square brackets, like [1] or [2][3].
If the sources do not contain the answer, reply exactly: "I don't have that in my notes."
Never invent a source number. Keep the answer short and in plain English.`;

// The whole RAG pipeline as one function, so routes and tests can share it.
export async function answerQuestion(question, mode = 'hybrid') {
  const sources = retrieve(question, { mode, k: 4 });
  if (!sources.length) return { answer: "I don't have that in my notes.", citations: [], invalidCitations: [], sources: [], mode };

  const context = sources.map((s, i) => `<source n="${i + 1}" file="${s.source}">\n${s.text}\n</source>`).join('\n');
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: SYSTEM,
    messages: [{ role: 'user', content: `<sources>\n${context}\n</sources>\n\nQuestion: ${question}` }],
  });
  const answer = textOf(reply);
  const cited = [...new Set([...answer.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))];
  return {
    answer,
    citations: cited.filter((n) => n >= 1 && n <= sources.length),
    invalidCitations: cited.filter((n) => n < 1 || n > sources.length),
    sources,
    mode,
  };
}
