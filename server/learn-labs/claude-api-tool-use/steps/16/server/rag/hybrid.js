import { getStore } from './store.js';
import { bm25Search } from './bm25.js';
import { tokenize } from './keyword.js';

// Reciprocal Rank Fusion: combine several ranked lists using only the RANK of each item.
// Scores from different systems (BM25 and cosine) are not comparable, ranks are.
export function rrf(lists, { k = 60 } = {}) {
  const fused = new Map();
  for (const list of lists) {
    list.forEach((item, rank) => {
      const entry = fused.get(item.id) || { ...item, score: 0 };
      entry.score += 1 / (k + rank + 1);
      fused.set(item.id, entry);
    });
  }
  return [...fused.values()].map((x) => ({ ...x, score: Number(x.score.toFixed(5)) })).sort((a, b) => b.score - a.score);
}

// A very small "reranker": after the first search, look at the few best chunks again
// and favour the ones that contain MORE of the question's words in one place.
// Real systems use a cross-encoder model here; this shows where it fits.
export function rerank(query, items) {
  const q = [...new Set(tokenize(query))];
  return items
    .map((it) => {
      const words = new Set(tokenize(it.text));
      const covered = q.filter((t) => words.has(t)).length;
      return { ...it, coverage: q.length ? Number((covered / q.length).toFixed(2)) : 0 };
    })
    .sort((a, b) => b.coverage - a.coverage || b.score - a.score);
}

// Vector search ALWAYS returns the nearest chunks, even when nothing is near.
// Below this similarity a chunk is noise, so we drop it. Tune it on your own data.
export const MIN_SIMILARITY = 0.1;

// mode: 'keyword' | 'vector' | 'hybrid'
export function retrieve(query, { mode = 'hybrid', k = 4 } = {}) {
  const store = getStore();
  const all = [...store.items.values()];
  const keyword = bm25Search(query, all, 8);
  const vector = store.query(query, { k: 8 }).filter((h) => h.score >= MIN_SIMILARITY);
  if (mode === 'keyword') return keyword.slice(0, k);
  if (mode === 'vector') return vector.slice(0, k);
  return rerank(query, rrf([keyword, vector]).slice(0, 6)).slice(0, k);
}
