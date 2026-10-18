import { makeRng } from './rng';

// A language model does not pick "the" word. For every possible next token it produces a score (a logit).
// Software turns the scores into probabilities and then picks one at random according to them.

export type Candidate = { token: string; logit: number };

// Toy scores for the text "I am applying for the" (invented numbers, only to show the mechanics).
export const TOY: Candidate[] = [
  { token: ' job', logit: 3.2 },
  { token: ' position', logit: 2.9 },
  { token: ' role', logit: 2.4 },
  { token: ' post', logit: 1.6 },
  { token: ' scholarship', logit: 0.4 },
  { token: ' banana', logit: -1.5 },
  { token: ' moon', logit: -2.5 },
];

// Temperature divides the scores before softmax. Low = the favourite dominates. High = flatter, more surprising.
export function probabilities(cands: Candidate[], temperature: number): number[] {
  const t = Math.max(0.05, temperature);
  const scaled = cands.map((c) => c.logit / t);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// Top-k keeps only the k most likely tokens. Top-p keeps the smallest group whose probabilities add up to p.
// Both then renormalise so the remaining probabilities add up to 1 again.
export function filterProbs(probs: number[], topK: number, topP: number): number[] {
  const order = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
  const keep = new Set<number>();
  let cumulative = 0;
  for (const [rank, { p, i }] of order.entries()) {
    if (rank >= topK) break;
    keep.add(i);
    cumulative += p;
    if (cumulative >= topP) break;
  }
  const kept = probs.map((p, i) => (keep.has(i) ? p : 0));
  const sum = kept.reduce((a, b) => a + b, 0) || 1;
  return kept.map((p) => p / sum);
}

export function sampleMany(probs: number[], times: number, seed: number): number[] {
  const rng = makeRng(seed);
  const counts = probs.map(() => 0);
  for (let n = 0; n < times; n++) {
    let r = rng();
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i]!;
      if (r <= 0 || i === probs.length - 1) { counts[i]!++; break; }
    }
  }
  return counts;
}

// A rough guess of the number of tokens. Real tokenizers differ by model and by language.
export function estimateTokens(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return { byWords: Math.round(words * 1.3), byChars: Math.round(text.length / 4) };
}
