// Reads tested code and captured output from ./code so lesson text always shows files that really ran.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'code');
export const code = (name) => fs.readFileSync(path.join(dir, name), 'utf8').replace(/\s+$/, '');
export const out = (name) => code(name + '.out');

// Shared honesty notes (what was run here and what was not).
export const RAN = 'The script in this lesson was run on Linux in the course lab (bash 5, Python 3.13). The output shown is real. Your numbers (memory, disk, dates) will be different.';
export const NOTRUN = 'This lesson shows configuration that was written carefully but NOT run on a live server for this course. Test it on a practice machine first, and read your own system’s documentation, because paths and versions differ.';
