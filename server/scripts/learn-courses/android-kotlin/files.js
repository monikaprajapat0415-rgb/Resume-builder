// Reads real source files from ./code so the lesson text always shows exactly the code in the project.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { P, C } from '../kit.js';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const read = (rel) => fs.readFileSync(path.join(dir, rel), 'utf8').replace(/\s+$/, '');

// A Kotlin file of a project: a label with its path in the Android Studio project, then the code.
export const kt = (proj, name, pkg) => [P(`**\`app/src/main/java/com/example/${pkg}/${name}\`**`), C('kotlin', read(`${proj}/${name}`))];
// Any other file (manifest, gradle lines, tests): label text is given.
export const file = (rel, label, lang = 'kotlin') => [P(`**\`${label}\`**`), C(lang, read(rel))];
// A small stand-alone Kotlin sample from code/basics.
export const sample = (name) => C('kotlin', read(`basics/${name}`));
