// Reads a tested code file from ./code so lesson text always shows code that really ran.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const code = (name) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/\s+$/, '');
