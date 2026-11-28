// Run: OPENAI_API_KEY=x node --test server/tests/trackerController.test.mjs   (no database: the models are stubbed)
import test from 'node:test';
import assert from 'node:assert/strict';
import JobApplication from '../models/JobApplication.js';
import ToolSettings from '../models/ToolSettings.js';
import { cleanCard, cleanUrl, listCards, createCard, updateCard, deleteCard } from '../controllers/trackerController.js';

ToolSettings.findOne = () => ({ lean: async () => ({ trackerTool: true, trackerMaxPerUser: 10 }) });
const run = async (fn, req) => { let status = 200, json; await fn(req, { status(c) { status = c; return this; }, json(j) { json = j; return this; } }); return { status, json }; };

test('cleanUrl accepts web addresses only', () => {
  assert.equal(cleanUrl(''), '');
  assert.equal(cleanUrl('example.com/jobs/1'), 'https://example.com/jobs/1');
  assert.equal(cleanUrl('http://example.com/a'), 'http://example.com/a');
  for (const bad of ['javascript:alert(1)', 'data:text/html,hi', 'ftp://example.com', 'not a url', 'https://localhost']) assert.equal(cleanUrl(bad), null, bad);
});

test('cleanCard validates and trims', () => {
  const ok = cleanCard({ company: '  Acme   Ltd ', role: 'Analyst', status: 'interview', followUpOn: '2026-12-01', appliedOn: '', notes: 'a\r\nb' });
  assert.equal(ok.company, 'Acme Ltd'); assert.equal(ok.status, 'interview'); assert.equal(ok.appliedOn, null); assert.equal(ok.notes, 'a\nb');
  assert.ok(ok.followUpOn instanceof Date);
  assert.throws(() => cleanCard({ company: '', role: 'x' }), /company/);
  assert.throws(() => cleanCard({ company: 'a', role: '' }), /job title/);
  assert.throws(() => cleanCard({ company: 'a', role: 'b', status: 'hired' }), /column/);
  assert.throws(() => cleanCard({ company: 'a', role: 'b', followUpOn: 'soon' }), /dates/);
  assert.throws(() => cleanCard({ company: 'a', role: 'b', jobUrl: 'javascript:1' }), /web address/);
  assert.deepEqual(cleanCard({ status: 'offer' }, true), { status: 'offer' });   // partial update keeps the other fields untouched
});

test('every query is scoped to the signed-in user and the limit is enforced', async () => {
  const seen = {};
  JobApplication.find = (q) => { seen.find = q; return { sort: () => ({ limit: () => ({ lean: async () => [] }) }) }; };
  JobApplication.countDocuments = async (q) => { seen.count = q; return seen.n ?? 3; };
  JobApplication.create = async (d) => { seen.create = d; return d; };
  JobApplication.findOneAndUpdate = async (f, u) => { seen.update = f; return { ...f, ...u.$set }; };
  JobApplication.findOneAndDelete = async (f) => { seen.del = f; return { ...f }; };

  assert.equal((await run(listCards, { userId: 'U1' })).json.limit, 10);
  assert.deepEqual(seen.find, { userId: 'U1' });

  const made = await run(createCard, { userId: 'U1', body: { company: 'A', role: 'B', userId: 'EVIL' } });
  assert.equal(made.status, 201); assert.equal(seen.create.userId, 'U1', 'a body userId can never win');

  seen.n = 10;
  const full = await run(createCard, { userId: 'U1', body: { company: 'A', role: 'B' } });
  assert.equal(full.status, 409); assert.match(full.json.message, /up to 10/);

  await run(updateCard, { userId: 'U1', params: { id: 'X' }, body: { status: 'offer' } });
  assert.deepEqual(seen.update, { _id: 'X', userId: 'U1' });
  await run(deleteCard, { userId: 'U1', params: { id: 'X' } });
  assert.deepEqual(seen.del, { _id: 'X', userId: 'U1' });

  JobApplication.findOneAndUpdate = async () => null;
  assert.equal((await run(updateCard, { userId: 'U2', params: { id: 'X' }, body: { status: 'offer' } })).status, 404);
});
