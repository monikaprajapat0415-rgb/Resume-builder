// The "model" layer: knows how books are stored, nothing about HTTP.
export function createBookStore() {
  const books = new Map();
  let nextId = 1;

  return {
    list: () => [...books.values()],
    find: (id) => books.get(id) ?? null,
    add(data) {
      const book = { id: nextId++, ...data };
      books.set(book.id, book);
      return book;
    },
    remove: (id) => books.delete(id),
  };
}
