import { makeRng } from './rng';

// A tiny neural network: layers of simple units. Each unit adds up its inputs times weights,
// adds a bias, and squashes the result between 0 and 1 (the sigmoid function).
export type Net = { sizes: number[]; w: number[][][]; b: number[][] }; // w[layer][unit][input]

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export function createNet(hidden: number, seed: number): Net {
  const rng = makeRng(seed);
  const sizes = hidden > 0 ? [2, hidden, 1] : [2, 1]; // hidden = 0 means no hidden layer at all
  const w: number[][][] = [];
  const b: number[][] = [];
  for (let l = 1; l < sizes.length; l++) {
    w.push(Array.from({ length: sizes[l]! }, () => Array.from({ length: sizes[l - 1]! }, () => (rng() - 0.5) * 2)));
    b.push(Array.from({ length: sizes[l]! }, () => (rng() - 0.5) * 2));
  }
  return { sizes, w, b };
}

export function forward(net: Net, input: number[]): number[][] {
  const acts = [input];
  for (let l = 0; l < net.w.length; l++) {
    const prev = acts[l]!;
    acts.push(net.w[l]!.map((weights, u) => sigmoid(weights.reduce((s, wt, i) => s + wt * prev[i]!, net.b[l]![u]!))));
  }
  return acts;
}

export const predict = (net: Net, input: number[]) => forward(net, input).at(-1)![0]!;

export type Sample = { input: number[]; target: number };

// Training = repeat: make a guess, measure the error, nudge every weight a little to reduce the error.
// The nudging rule is called backpropagation.
export function train(net: Net, data: Sample[], epochs: number, rate: number) {
  const history: number[] = [];
  for (let e = 0; e < epochs; e++) {
    let loss = 0;
    for (const { input, target } of data) {
      const acts = forward(net, input);
      const out = acts.at(-1)![0]!;
      loss += (out - target) ** 2;
      // delta = how much each unit contributed to the error
      let delta = [(out - target) * out * (1 - out)];
      for (let l = net.w.length - 1; l >= 0; l--) {
        const prev = acts[l]!;
        const nextDelta = prev.map((a, i) => a * (1 - a) * delta.reduce((s, d, u) => s + d * net.w[l]![u]![i]!, 0));
        for (let u = 0; u < delta.length; u++) {
          for (let i = 0; i < prev.length; i++) net.w[l]![u]![i]! -= rate * delta[u]! * prev[i]!;
          net.b[l]![u]! -= rate * delta[u]!;
        }
        delta = nextDelta;
      }
    }
    if (e % Math.max(1, Math.floor(epochs / 50)) === 0 || e === epochs - 1) history.push(loss / data.length);
  }
  return history;
}

export const XOR: Sample[] = [
  { input: [0, 0], target: 0 },
  { input: [0, 1], target: 1 },
  { input: [1, 0], target: 1 },
  { input: [1, 1], target: 0 },
];
