import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDocs } from './load.js';
import { chunkWords } from './chunk.js';
import { embed, cosine } from './embed.js';

// A vector store has four jobs: upsert, remove, query and count.
// Keep them behind one small interface and you can swap the engine later
// (pgvector, Qdrant, Pinecone, Chroma) without touching the routes.

export class MemoryStore {
  constructor() {
    this.items = new Map(); // id -> { id, source, title, text, vector }
  }

  upsert(item) {
    this.items.set(item.id, { ...item, vector: item.vector || embed(`${item.title || ''}. ${item.text}`) });
    return item.id;
  }

  remove(id) {
    return this.items.delete(id);
  }

  count() {
    return this.items.size;
  }

  list() {
    return [...this.items.values()].map(({ vector, ...rest }) => rest);
  }

  // Nearest neighbours by cosine similarity. `source` is a metadata filter.
  query(text, { k = 4, source } = {}) {
    const q = embed(text);
    return [...this.items.values()]
      .filter((it) => !source || it.source === source)
      .map(({ vector, ...rest }) => ({ ...rest, score: Number(cosine(q, vector).toFixed(4)) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

// Same store, but saved to a JSON file so data survives a restart.
export class FileStore extends MemoryStore {
  constructor(file) {
    super();
    this.file = file;
    if (fs.existsSync(file)) {
      for (const it of JSON.parse(fs.readFileSync(file, 'utf8'))) this.items.set(it.id, it);
    }
  }

  save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify([...this.items.values()]));
  }

  upsert(item) {
    const id = super.upsert(item);
    this.save();
    return id;
  }

  remove(id) {
    const done = super.remove(id);
    if (done) this.save();
    return done;
  }
}

const here = path.dirname(fileURLToPath(import.meta.url));
let store;

// One shared store for the whole server.
// On every start the documents in server/rag/docs are re-chunked and re-embedded, so editing a
// document and restarting always works. Notes you added yourself (other sources) are kept.
export function getStore() {
  if (store) return store;
  store = new FileStore(process.env.VECTOR_FILE || path.join(here, '..', 'runtime', 'vectors.json'));
  const docs = loadDocs();
  const docSources = new Set(docs.map((d) => d.source));
  for (const [id, item] of [...store.items]) if (docSources.has(item.source)) store.items.delete(id);
  for (const doc of docs) {
    chunkWords(doc.text, { size: 80, overlap: 20 }).forEach((text, i) => {
      const id = `${doc.source}#${i + 1}`;
      store.items.set(id, { id, source: doc.source, title: doc.title, text, vector: embed(`${doc.title}. ${text}`) });
    });
  }
  store.save();
  return store;
}
