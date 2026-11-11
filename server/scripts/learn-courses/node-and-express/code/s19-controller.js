// The "controller" layer: turns a request into a call on the store and a response.
export function bookController(store) {
  return {
    list: (req, res) => res.json(store.list()),

    get(req, res) {
      const book = store.find(Number(req.params.id));
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    },

    create(req, res) {
      const { title, author } = req.body ?? {};
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'title is required' });
      }
      res.status(201).json(store.add({ title: title.trim(), author: author ?? 'Unknown' }));
    },

    remove(req, res) {
      if (!store.remove(Number(req.params.id))) return res.status(404).json({ error: 'Book not found' });
      res.status(204).end();
    },
  };
}
