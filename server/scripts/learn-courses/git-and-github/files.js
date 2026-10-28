// Real git sessions (recorded when the course was written) live in ./code as .out files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const out = (name) => fs.readFileSync(path.join(dir, name + '.out'), 'utf8').replace(/\s+$/, '');
