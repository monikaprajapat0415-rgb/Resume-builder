import express from 'express';

const categories = ['books', 'games', 'tools'];
export const products = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `Item ${String(i + 1).padStart(2, '0')}`,
  price: 100 + ((i * 37) % 400),
  category: categories[i % 3],
}));

const clamp = (value, min, max, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? fallback : Math.min(Math.max(number, min), max);
};

export function createApp() {
  const app = express();
  app.use(express.json());

  // Version 1: list with paging, filtering, sorting and search.
  app.get('/api/v1/products', (req, res) => {
    const page = clamp(req.query.page, 1, 1_000_000, 1);
    const limit = clamp(req.query.limit, 1, 50, 10);        // never let a client ask for everything
    const { category, minPrice, maxPrice, q } = req.query;
    const sortField = ['price', 'name', 'id'].includes(req.query.sort) ? req.query.sort : 'id';
    const direction = req.query.order === 'desc' ? -1 : 1;

    let items = products;
    if (category) items = items.filter((p) => p.category === category);
    if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(String(q).toLowerCase()));

    items = [...items].sort((a, b) => (a[sortField] > b[sortField] ? 1 : a[sortField] < b[sortField] ? -1 : 0) * direction);

    const total = items.length;
    const data = items.slice((page - 1) * limit, page * limit);
    res.json({ data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });

  // Version 2 changes the shape of the answer, so it lives at a new address.
  app.get('/api/v2/products', (req, res) => {
    res.set('Deprecation', 'false');
    res.json({ items: products.slice(0, 5).map((p) => ({ id: p.id, title: p.name, priceInr: p.price })) });
  });

  // Create returns 201 and a Location header. Duplicates return 409.
  app.post('/api/v1/products', (req, res) => {
    const { name, price, category } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim() || typeof price !== 'number' || price < 0) {
      return res.status(422).json({ error: 'name and a non-negative price are required' });
    }
    if (products.some((p) => p.name.toLowerCase() === name.trim().toLowerCase())) {
      return res.status(409).json({ error: 'A product with this name already exists' });
    }
    const product = { id: products.length + 1, name: name.trim(), price, category: category ?? 'tools' };
    products.push(product);
    res.status(201).location(`/api/v1/products/${product.id}`).json(product);
  });

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
  return app;
}
