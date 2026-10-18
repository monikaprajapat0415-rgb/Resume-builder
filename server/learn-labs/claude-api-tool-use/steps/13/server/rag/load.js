import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DOCS_DIR = path.join(here, 'docs');

// Read every .md file in server/rag/docs. Returns [{ source, title, text }].
export function loadDocs() {
  return fs.readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8').trim();
      const title = (raw.match(/^#\s+(.+)$/m) || [])[1] || file;
      return { source: file, title, text: raw.replace(/^#\s+.+\n+/, '') };
    });
}

// Naive chunking for lesson 13: one paragraph = one chunk.
// Lesson 14 replaces this with better chunking.
export function paragraphChunks() {
  const chunks = [];
  for (const doc of loadDocs()) {
    doc.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).forEach((text, i) => {
      chunks.push({ id: `${doc.source}#${i + 1}`, source: doc.source, title: doc.title, text });
    });
  }
  return chunks;
}
