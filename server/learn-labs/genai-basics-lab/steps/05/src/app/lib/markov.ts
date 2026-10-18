import { makeRng } from './rng';

// A Markov chain is the simplest text generator: it only remembers the last few words.
// "order" is how many words it remembers. Order 1 = the last word. Order 2 = the last two words.
export type Chain = { order: number; next: Map<string, string[]>; starts: string[] };

const tokens = (text: string) => text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);

export function buildChain(text: string, order: number): Chain {
  const words = tokens(text);
  const next = new Map<string, string[]>();
  const starts: string[] = [];
  for (let i = 0; i + order < words.length; i++) {
    const key = words.slice(i, i + order).join(' ');
    if (i === 0 || /[.!?]$/.test(words[i - 1]!)) starts.push(key); // a good place to begin: the start of a sentence
    next.set(key, [...(next.get(key) ?? []), words[i + order]!]);
  }
  return { order, next, starts };
}

// Pick a start, then repeat: look at the last words, choose one of the words that followed them in the text.
export function generate(chain: Chain, count: number, seed: number): string {
  const rng = makeRng(seed);
  if (!chain.starts.length) return '';
  let current = chain.starts[Math.floor(rng() * chain.starts.length)]!.split(' ');
  const out = [...current];
  while (out.length < count) {
    const options = chain.next.get(current.join(' '));
    if (!options?.length) {
      current = chain.starts[Math.floor(rng() * chain.starts.length)]!.split(' '); // dead end: start a new sentence
      out.push(...current);
    } else {
      const word = options[Math.floor(rng() * options.length)]!;
      out.push(word);
      current = [...current.slice(1), word];
    }
  }
  return out.slice(0, count).join(' ');
}

// How much of the output is copied straight from the source? (runs of 4 words that appear in it)
export function copiedShare(source: string, output: string) {
  const src = tokens(source).join(' ');
  const out = tokens(output);
  if (out.length < 4) return 0;
  let hit = 0;
  for (let i = 0; i + 4 <= out.length; i++) if (src.includes(out.slice(i, i + 4).join(' '))) hit++;
  return hit / (out.length - 3);
}
