import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './p03-blog.js';
import { signToken } from './p-kit.js';

const as = (id, role, name = `user${id}`) => ({ Authorization: `Bearer ${signToken({ id, role, name })}` });

test('project 3: blog roles, publishing and comments', async () => {
  const app = createApp();
  const author = as(2, 'author', 'Meera');
  const admin = as(1, 'admin');
  const reader = as(3, 'reader', 'Ravi');

  assert.equal((await request(app).post('/api/posts').send({ title: 'Hi there', body: 'x' })).status, 401);
  assert.equal((await request(app).post('/api/posts').set(reader).send({ title: 'Hi there', body: 'x' })).status, 403);

  const created = await request(app).post('/api/posts').set(author).send({ title: 'Learn Express Fast!', body: 'Routes and middleware', category: 'node' });
  assert.equal(created.body.slug, 'learn-express-fast');
  assert.equal(created.body.status, 'draft');

  assert.equal((await request(app).get('/api/posts')).body.length, 0);                         // drafts are hidden
  assert.equal((await request(app).post('/api/posts/1/publish').set(author)).status, 403);     // authors cannot publish
  assert.equal((await request(app).post('/api/posts/1/publish').set(admin)).status, 200);

  assert.equal((await request(app).get('/api/posts?category=node')).body[0].title, 'Learn Express Fast!');
  assert.equal((await request(app).get('/api/posts?q=middleware')).body.length, 1);
  assert.equal((await request(app).get('/api/posts/learn-express-fast')).status, 200);

  assert.equal((await request(app).post('/api/posts/1/comments').set(reader).send({ text: 'Great post' })).status, 201);
  assert.equal((await request(app).post('/api/posts/1/comments').send({ text: 'anon' })).status, 401);
  const detail = await request(app).get('/api/posts/learn-express-fast');
  assert.equal(detail.body.comments[0].author, 'Ravi');

  // Another author cannot edit or delete Meera's post. The admin can.
  assert.equal((await request(app).patch('/api/posts/1').set(as(9, 'author')).send({ title: 'Hijack' })).status, 403);
  assert.equal((await request(app).delete('/api/posts/1').set(admin)).status, 204);
  assert.deepEqual((await request(app).get('/api/categories')).body, [{ name: 'node', posts: 1 }]);
});
