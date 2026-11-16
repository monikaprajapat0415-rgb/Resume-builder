// Reads tested code and captured output from ./code so lesson text always shows files that really ran.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const code = (name) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/\s+$/, '');
export const out = (name) => code(name + '.out');

// Shared honesty note (what was run here and what was not).
export const RAN = 'The code in this lesson was built and run with Next.js 16.4.6, React 19.3 and Node 22 in the course lab (next build, then next start). The output shown is real. Your version numbers will be newer, so read the official docs when something differs.';
