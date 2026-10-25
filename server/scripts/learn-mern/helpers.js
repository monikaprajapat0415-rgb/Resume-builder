// Helpers for writing the MERN course as data. Code blocks are read from the real files of the downloadable lab
// (server/learn-labs/mern-lab), so the lesson text and the zip can never disagree.
import { P, H, L, O, N, C, F, lesson } from '../learn-ai/helpers.js';

export { P, H, L, O, N, C, lesson };

export const LAB = 'mern-lab';
const pad = (n) => String(n).padStart(2, '0');

// Show a file exactly as the lab step `n` wrote it.   S(17, 'server/controllers/jobs.js')
export const S = (n, rel) => F(LAB, `steps/${pad(n)}/${rel}`);

// A "Your task" block: a heading and numbered steps.
export const task = (...steps) => [H('Your task'), O(...steps)];
// A "Check yourself" block: what you should see when it works.
export const check = (...items) => [H('How to check it worked'), L(...items)];
