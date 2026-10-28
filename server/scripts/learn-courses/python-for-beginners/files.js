// Code files and their real output live in ./code (run when the course was written), so lessons never drift from the code.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
const read = (name) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/\s+$/, '');
export const code = (name) => read(name);
export const out = (name) => read(name.replace(/\.py$/, '') + '.out');
