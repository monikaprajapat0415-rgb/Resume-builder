// Run: node --test server/tests/videoController.test.mjs   (no database needed)
import test from 'node:test';
import assert from 'node:assert/strict';
import { youtubeIdFrom, normalizePath, adminCreateVideo } from '../controllers/videoController.js';

test('youtubeIdFrom reads common YouTube address shapes', () => {
  const id = 'Jqq89mRv4nI';
  for (const s of [id, `https://youtu.be/${id}`, `https://www.youtube.com/watch?v=${id}&t=5`, `youtube.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`, `https://m.youtube.com/watch?v=${id}`, `https://www.youtube-nocookie.com/embed/${id}`]) {
    assert.equal(youtubeIdFrom(s), id, s);
  }
  for (const s of ['', 'https://example.com/watch?v=Jqq89mRv4nI', 'https://youtu.be/short', 'javascript:alert(1)', 'https://evil.com/youtu.be/Jqq89mRv4nI']) {
    assert.equal(youtubeIdFrom(s), '', s);
  }
});

test('normalizePath lowercases, trims slashes, drops query and host', () => {
  assert.equal(normalizePath('/CV-Builder/'), '/cv-builder');
  assert.equal(normalizePath('cv-builder?x=1#a'), '/cv-builder');
  assert.equal(normalizePath('https://primeresumeai.com/learn/Angular/'), '/learn/angular');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath(''), '/');
});

const call = async (body) => {
  let status, json;
  const res = { status(c) { status = c; return this; }, json(j) { json = j; return this; } };
  await adminCreateVideo({ body }, res);
  return { status, json };
};

test('admin create rejects bad input before touching the database', async () => {
  const ok = { path: '/x', youtubeId: 'Jqq89mRv4nI', title: 'T', description: 'A clear description of the video.', uploadDate: '2026-11-01' };
  assert.match((await call({ ...ok, youtubeId: 'nope' })).json.message, /YouTube link/);
  assert.match((await call({ ...ok, title: ' ' })).json.message, /title/);
  assert.match((await call({ ...ok, description: 'short' })).json.message, /description/);
  assert.match((await call({ ...ok, uploadDate: 'xx' })).json.message, /date/);
  assert.match((await call({ ...ok, uploadDate: '2099-01-01' })).json.message, /future/);
});
