// Reads real Swift files from ./code so the lesson text always shows exactly the code in the project.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { P, C } from '../kit.js';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const read = (rel) => fs.readFileSync(path.join(dir, rel), 'utf8').replace(/\s+$/, '');

// One Swift file of a project: a label with the file name, then the code.
export const sw = (proj, name, label) => [P(`**\`${label || name}\`**`), C('swift', read(`${proj}/${name}`))];
// Any other file (plist notes, config): label text is given.
export const other = (rel, label, lang = 'text') => [P(`**\`${label}\`**`), C(lang, read(rel))];
