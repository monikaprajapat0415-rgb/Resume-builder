// Project 3: a blog API. Posts, categories, comments, and roles (reader, author, admin).
import express from 'express';
import { AppError, requireAuth, requireRole, errorHandler, notFoundHandler } from './p-kit.js';

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function createApp() {
  const app = express();
  app.use(express.json());
  const auth = requireAuth();
  const categories = new Map();
  const posts = new Map();
  const comments = [];

  // Public: only published posts, with paging, category filter and search.
  app.get('/api/posts', (req, res) => {
    const { category, q } = req.query;
    let list = [...posts.values()].filter((p) => p.status === 'published');
    if (category) list = list.filter((p) => p.category === category);
    if (q) list = list.filter((p) => (p.title + p.body).toLowerCase().includes(String(q).toLowerCase()));
    res.json(list.sort((a, b) => b.id - a.id).map(({ body, ...summary }) => summary));
  });

  app.get('/api/posts/:slug', (req, res) => {
    const post = [...posts.values()].find((p) => p.slug === req.params.slug && p.status === 'published');
    if (!post) throw new AppError('Post not found', 404);
    res.json({ ...post, comments: comments.filter((c) => c.postId === post.id) });
  });

  // Authors and admins can write.
  app.post('/api/posts', auth, requireRole('author', 'admin'), (req, res) => {
    const { title, body, category = 'general' } = req.body ?? {};
    if (typeof title !== 'string' || title.trim().length < 3 || typeof body !== 'string' || !body.trim()) throw new AppError('title (3+ letters) and body are required', 422);
    categories.set(category, (categories.get(category) ?? 0) + 1);
    const post = { id: posts.size + 1, slug: slugify(title), title: title.trim(), body, category, authorId: req.user.id, status: 'draft' };
    posts.set(post.id, post);
    res.status(201).json(post);
  });

  // An author may change their own posts. An admin may change any post and publish.
  const own = (req) => {
    const post = posts.get(Number(req.params.id));
    if (!post) throw new AppError('Post not found', 404);
    if (post.authorId !== req.user.id && req.user.role !== 'admin') throw new AppError('This is not your post', 403);
    return post;
  };

  app.patch('/api/posts/:id', auth, requireRole('author', 'admin'), (req, res) => {
    const post = own(req);
    const { title, body } = req.body ?? {};
    if (typeof title === 'string') { post.title = title.trim(); post.slug = slugify(title); }
    if (typeof body === 'string') post.body = body;
    res.json(post);
  });

  app.post('/api/posts/:id/publish', auth, requireRole('admin'), (req, res) => {
    const post = posts.get(Number(req.params.id));
    if (!post) throw new AppError('Post not found', 404);
    post.status = 'published';
    res.json(post);
  });

  app.delete('/api/posts/:id', auth, requireRole('author', 'admin'), (req, res) => {
    posts.delete(own(req).id);
    res.status(204).end();
  });

  // Any logged-in user can comment on a published post.
  app.post('/api/posts/:id/comments', auth, (req, res) => {
    const post = posts.get(Number(req.params.id));
    if (!post || post.status !== 'published') throw new AppError('Post not found', 404);
    const text = String(req.body?.text ?? '').trim();
    if (!text || text.length > 1000) throw new AppError('Comment must be 1 to 1000 characters', 422);
    const comment = { id: comments.length + 1, postId: post.id, userId: req.user.id, author: req.user.name, text };
    comments.push(comment);
    res.status(201).json(comment);
  });

  app.get('/api/categories', (req, res) => res.json([...categories].map(([name, posts]) => ({ name, posts }))));

  app.use(notFoundHandler, errorHandler);
  return app;
}
