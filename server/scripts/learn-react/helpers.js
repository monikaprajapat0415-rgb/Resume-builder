// Helpers for the React course text. Code in lessons is written inline: it is short enough to copy into a Vite project.
import { P, H, L, O, N, C, lesson } from '../learn-ai/helpers.js';
export { P, H, L, O, N, C, lesson };
export const task = (...steps) => [H('Your task'), O(...steps)];
export const check = (...items) => [H('How to check it worked'), L(...items)];
// Count prose words (code excluded) so we can keep every lesson above 1,000 words.
export const proseWords = (l) => l.content.filter((b) => b.type !== 'code').map((b) => (b.text || '') + ' ' + (b.items || []).join(' ')).join(' ').split(/\s+/).filter(Boolean).length;
