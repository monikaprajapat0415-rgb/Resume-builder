// The small amount of maths that appears again and again in AI.

export const parseVector = (text: string): number[] =>
  text.split(/[,\s]+/).filter(Boolean).map(Number).filter((n) => Number.isFinite(n));

export const dot = (a: number[], b: number[]) => a.reduce((sum, x, i) => sum + x * (b[i] ?? 0), 0);

export const norm = (a: number[]) => Math.sqrt(dot(a, a)); // the length of the vector

// 1 = same direction, 0 = unrelated (at right angles), -1 = opposite.
export function cosine(a: number[], b: number[]) {
  const d = norm(a) * norm(b);
  return d === 0 ? 0 : dot(a, b) / d;
}

export const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function stdDev(xs: number[]) {
  const m = mean(xs);
  return xs.length ? Math.sqrt(mean(xs.map((x) => (x - m) ** 2))) : 0; // how spread out the numbers are
}

// Turns any list of scores into probabilities that add up to 1.
export function softmax(xs: number[]) {
  if (!xs.length) return [];
  const max = Math.max(...xs); // subtracting the max keeps the numbers from getting too big
  const exps = xs.map((x) => Math.exp(x - max));
  const sum = exps.reduce((s, x) => s + x, 0);
  return exps.map((e) => e / sum);
}

// One step of "learning": move a number a little downhill on y = (x - target)^2.
export function gradientSteps(start: number, target: number, rate: number, steps: number) {
  const path = [start];
  let x = start;
  for (let i = 0; i < steps; i++) {
    x -= rate * 2 * (x - target); // 2 * (x - target) is the slope of the curve at x
    path.push(x);
  }
  return path;
}
