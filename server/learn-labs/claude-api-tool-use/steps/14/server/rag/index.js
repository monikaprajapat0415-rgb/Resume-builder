import { loadDocs } from './load.js';
import { chunkWords } from './chunk.js';
import { embed, cosine } from './embed.js';

const cache = new Map(); // "size:overlap" -> chunks with vectors

// Chunk every document and embed every chunk. Cached per setting.
export function buildIndex({ size = 80, overlap = 20 } = {}) {
  const key = `${size}:${overlap}`;
  if (cache.has(key)) return cache.get(key);
  const chunks = [];
  for (const doc of loadDocs()) {
    chunkWords(doc.text, { size, overlap }).forEach((text, i) => {
      chunks.push({ id: `${doc.source}#${i + 1}`, source: doc.source, title: doc.title, text, vector: embed(`${doc.title}. ${text}`) });
    });
  }
  cache.set(key, chunks);
  return chunks;
}

// Vector search: embed the question, rank chunks by cosine similarity.
export function vectorSearch(query, { size = 80, overlap = 20, k = 4 } = {}) {
  const q = embed(query);
  return buildIndex({ size, overlap })
    .map(({ vector, ...c }) => ({ ...c, score: Number(cosine(q, vector).toFixed(4)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
