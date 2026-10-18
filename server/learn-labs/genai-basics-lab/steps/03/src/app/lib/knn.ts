import { makeRng, shuffle } from './rng';

// A candidate described by two numbers, and whether the recruiter shortlisted them.
export type Person = { years: number; skills: number; shortlisted: boolean };

// Make an imaginary but sensible dataset: more experience and more matching skills usually means shortlisted,
// but with some randomness, because real hiring is never perfectly predictable.
export function makeData(count: number, seed: number, noise = 0.25): Person[] {
  const rng = makeRng(seed);
  return Array.from({ length: count }, () => {
    const years = Math.round(rng() * 150) / 10; // 0 to 15 years
    const skills = Math.round(rng() * 10); // 0 to 10 matching skills
    const score = 0.5 * (years / 15) + 0.5 * (skills / 10) + (rng() - 0.5) * noise * 2;
    return { years, skills, shortlisted: score > 0.5 };
  });
}

// Training data teaches the model. Test data is kept hidden and used only to check it.
export function split(data: Person[], testShare: number, seed: number) {
  const mixed = shuffle(data, makeRng(seed));
  const testSize = Math.max(1, Math.round(mixed.length * testShare));
  return { test: mixed.slice(0, testSize), train: mixed.slice(testSize) };
}

const distance = (a: Person, b: Person) => Math.hypot((a.years - b.years) / 15, (a.skills - b.skills) / 10);

// k-nearest neighbours: look at the k most similar people in the training data and let them vote.
export function predict(train: Person[], who: Pick<Person, 'years' | 'skills'>, k: number): boolean {
  const near = train
    .map((p) => ({ p, d: distance(p, who as Person) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, Math.max(1, k));
  const yes = near.filter((n) => n.p.shortlisted).length;
  return yes * 2 > near.length;
}

export function evaluate(train: Person[], test: Person[], k: number) {
  const matrix = { tp: 0, fp: 0, tn: 0, fn: 0 };
  for (const p of test) {
    const guess = predict(train, p, k);
    if (guess && p.shortlisted) matrix.tp++;
    else if (guess && !p.shortlisted) matrix.fp++;
    else if (!guess && !p.shortlisted) matrix.tn++;
    else matrix.fn++;
  }
  const total = test.length || 1;
  const accuracy = (matrix.tp + matrix.tn) / total;
  const precision = matrix.tp / ((matrix.tp + matrix.fp) || 1);
  const recall = matrix.tp / ((matrix.tp + matrix.fn) || 1);
  return { matrix, accuracy, precision, recall };
}
