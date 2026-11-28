// Run: OPENAI_API_KEY=x node --test server/tests/trackerOff.test.mjs   (the admin switch is off)
import test from 'node:test';
import assert from 'node:assert/strict';
import ToolSettings from '../models/ToolSettings.js';
import { listCards, createCard, updateCard } from '../controllers/trackerController.js';

ToolSettings.findOne = () => ({ lean: async () => ({ trackerTool: false }) });
const run = async (fn, req) => { let status = 200, json; await fn(req, { status(c) { status = c; return this; }, json(j) { json = j; return this; } }); return { status, json }; };

test('with the admin switch off, list, create and update answer 403', async () => {
  for (const fn of [listCards, createCard, updateCard]) {
    const r = await run(fn, { userId: 'U1', params: { id: 'X' }, body: { company: 'A', role: 'B' } });
    assert.equal(r.status, 403); assert.match(r.json.message, /not available/);
  }
});
