import { tokenize } from './keyword.js';

// BM25: the standard keyword ranking used by search engines.
// It improves plain keyword matching in two ways:
//  - a word repeated many times helps less and less (saturation, k1)
//  - long chunks are not unfairly favoured (length normalisation, b)
export function bm25Search(query, chunks, k = 8, { k1 = 1.5, b = 0.75 } = {}) {
  const docs = chunks.map((c) => tokenize(`${c.title || ''} ${c.text}`));
  const avgLen = docs.reduce((s, d) => s + d.length, 0) / (docs.length || 1);
  const df = new Map();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) || 0) + 1);
  const q = [...new Set(tokenize(query))];

  return chunks
    .map((chunk, i) => {
      const tf = new Map();
      for (const t of docs[i]) tf.set(t, (tf.get(t) || 0) + 1);
      let score = 0;
      for (const t of q) {
        const f = tf.get(t) || 0;
        if (!f) continue;
        const idf = Math.log(1 + (docs.length - df.get(t) + 0.5) / (df.get(t) + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (docs[i].length / avgLen))));
      }
      return { ...chunk, score: Number(score.toFixed(4)) };
    })
    .filter((c) => c.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, k);
}
