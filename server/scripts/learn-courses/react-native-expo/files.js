// Reads real source files from ./code so lessons show exactly the tested-for-syntax project files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { P, C } from '../kit.js';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const read = (rel) => fs.readFileSync(path.join(dir, rel), 'utf8').replace(/\s+$/, '');
const langOf = (f) => (f.endsWith('.tsx') ? 'tsx' : f.endsWith('.ts') ? 'ts' : 'text');

// A project file: label = where to save it in the Expo project, rel = file inside ./code
export const src = (rel, label) => [P(`**\`${label}\`**`), C(langOf(rel), read(rel))];
export const cfg = (rel, label) => [P(`**${label}**`), C('text', read(rel))];
export const sample = (rel) => C('ts', read(rel));
