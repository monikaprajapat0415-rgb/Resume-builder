// A tiny LOCAL embedding so the lab works without any key.
// It turns text into a vector of 512 numbers by hashing words and word pairs.
// Texts that share words get similar vectors. It does NOT understand synonyms:
// "car" and "automobile" look unrelated to it. A real embedding model does.
// In a real product, replace embed() with a call to an embedding model.
import { tokenize } from './keyword.js';

export const DIMS = 1024;

function hash(str) {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}


export function embed(text) {
  const vec = new Float64Array(DIMS);
  const w = tokenize(text); // content words only: no "the" or "of"
  const features = [...w, ...w.slice(1).map((x, i) => `${w[i]}_${x}`)]; // words and word pairs
  for (const f of features) {
    const h = hash(f);
    vec[h % DIMS] += h & 0x100 ? 1 : -1; // a second bit of the hash picks the sign
  }
  for (let i = 0; i < DIMS; i++) vec[i] = Math.sign(vec[i]) * Math.log1p(Math.abs(vec[i]));
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1;
  return Array.from(vec, (x) => Math.round((x / norm) * 1e4) / 1e4); // length ~1, so cosine = dot product; 4 decimals keep files small
}

export const cosine = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
