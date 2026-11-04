import * as SQLite from "expo-sqlite";

export type Note = { id: number; title: string; body: string; updatedAt: number };

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("notes.db");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          updatedAt INTEGER NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function listNotes(query: string): Promise<Note[]> {
  const db = await getDb();
  const like = `%${query}%`;
  return db.getAllAsync<Note>(
    "SELECT * FROM notes WHERE title LIKE ? OR body LIKE ? ORDER BY updatedAt DESC",
    [like, like]
  );
}

export async function saveNote(note: { id?: number; title: string; body: string }): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  if (note.id) {
    await db.runAsync("UPDATE notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?", [note.title, note.body, now, note.id]);
  } else {
    await db.runAsync("INSERT INTO notes (title, body, updatedAt) VALUES (?, ?, ?)", [note.title, note.body, now]);
  }
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
}
