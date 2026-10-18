// Back-of-the-envelope maths for running a language model. These are rough estimates, not benchmarks.

export type Precision = 'fp32' | 'fp16' | 'int8' | 'int4';

// Bytes needed to store one number (one "weight") at each precision.
export const BYTES: Record<Precision, number> = { fp32: 4, fp16: 2, int8: 1, int4: 0.5 };

export const PRECISIONS: { id: Precision; label: string }[] = [
  { id: 'fp32', label: '32-bit float (full precision)' },
  { id: 'fp16', label: '16-bit float (common for serving)' },
  { id: 'int8', label: '8-bit integer (quantised)' },
  { id: 'int4', label: '4-bit integer (heavily quantised)' },
];

// Example round numbers for different kinds of hardware. They are NOT specifications of real products.
export const HARDWARE = [
  { id: 'phone', label: 'Phone (example)', memoryGB: 8, bandwidthGBs: 50 },
  { id: 'laptop', label: 'Laptop (example)', memoryGB: 16, bandwidthGBs: 100 },
  { id: 'gpu24', label: 'Gaming graphics card (example)', memoryGB: 24, bandwidthGBs: 900 },
  { id: 'gpu80', label: 'Data-centre accelerator (example)', memoryGB: 80, bandwidthGBs: 2000 },
];

// Memory for the weights alone: parameters (in billions) times bytes each. 7 billion x 2 bytes = 14 GB.
export const weightsGB = (paramsBillions: number, p: Precision) => paramsBillions * BYTES[p];

// Extra memory for the working space (activations and the conversation cache). 20% is a rough rule of thumb;
// long conversations need more.
export const OVERHEAD = 1.2;
export const neededGB = (paramsBillions: number, p: Precision) => weightsGB(paramsBillions, p) * OVERHEAD;

// When a model writes one token at a time, the chip must read (almost) every weight from memory for each token.
// So the speed limit is roughly: memory bandwidth divided by the size of the weights.
export const maxTokensPerSecond = (paramsBillions: number, p: Precision, bandwidthGBs: number) => bandwidthGBs / weightsGB(paramsBillions, p);

// Quantisation saves memory but can lose some quality. This reports how much memory it saves versus fp16.
export const savingVsFp16 = (p: Precision) => 1 - BYTES[p] / BYTES.fp16;
