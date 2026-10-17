import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { client, MODEL, textOf } from '../claude.js';
import { safeTools, toolDefs } from '../safe-tools.js';

const router = Router();
const MAX_TURNS = 6;
const SYSTEM = 'You help users improve their resume. You can save, list and delete short notes with the tools. Only delete a note when the user clearly asks.';

// In-memory sessions. A real product would use a database and expire old data.
const sessions = new Map();

function getSession(id) {
  const now = Date.now();
  for (const [key, s] of sessions) if (now - s.touched > 30 * 60 * 1000) sessions.delete(key);
  if (id && sessions.has(id)) {
    const s = sessions.get(id);
    s.touched = now;
    return s;
  }
  const s = { id: randomUUID(), messages: [], notes: new Map(), counter: 0, awaiting: null, touched: now };
  if (sessions.size < 200) sessions.set(s.id, s);
  return s;
}

const errorResult = (id, message) => ({ type: 'tool_result', tool_use_id: id, is_error: true, content: message });

function execute(block, tool, input, session) {
  try {
    const output = tool.run(input, session);
    return { type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(output) };
  } catch (e) {
    return errorResult(block.id, e.message);
  }
}

// Run the conversation until Claude is done OR needs the user to approve something.
async function drive(session) {
  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const reply = await client.messages.create({
      model: MODEL, max_tokens: 800, system: SYSTEM, tools: toolDefs, messages: session.messages,
    });
    session.messages.push({ role: 'assistant', content: reply.content });
    if (reply.stop_reason !== 'tool_use') return { status: 'done', text: textOf(reply) };

    const results = [];
    const waiting = [];
    for (const block of reply.content.filter((b) => b.type === 'tool_use')) {
      const tool = safeTools[block.name];
      if (!tool) { results.push(errorResult(block.id, 'Unknown tool.')); continue; }

      // Never trust the arguments. Check them with zod and tell Claude what was wrong.
      const parsed = tool.schema.safeParse(block.input);
      if (!parsed.success) {
        const why = parsed.error.issues.map((i) => `${i.path.join('.') || 'input'}: ${i.message}`).join('; ');
        results.push(errorResult(block.id, `Invalid input. ${why}`));
        continue;
      }
      if (tool.needsApproval) { waiting.push({ block, input: parsed.data }); continue; }
      results.push(execute(block, tool, parsed.data, session));
    }

    if (waiting.length) {
      session.awaiting = { results, waiting };
      return { status: 'needs_approval', actions: waiting.map((w) => ({ name: w.block.name, input: w.input })) };
    }
    session.messages.push({ role: 'user', content: results });
  }
  return { status: 'done', text: 'Stopped: too many steps. Please try a simpler request.' };
}

const view = (session, outcome) => ({ sessionId: session.id, notes: [...session.notes.values()], ...outcome });

// POST /api/safe-agent  { sessionId?, message }
router.post('/safe-agent', async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 2000);
  if (!message) return res.status(400).json({ error: { message: 'Please type a message.' } });

  const session = getSession(req.body?.sessionId);
  if (session.awaiting) return res.status(409).json({ error: { message: 'Please approve or deny the pending action first.' } });

  session.messages.push({ role: 'user', content: message });
  res.json(view(session, await drive(session)));
});

// POST /api/safe-agent/decision  { sessionId, approve }
router.post('/safe-agent/decision', async (req, res) => {
  const session = sessions.get(String(req.body?.sessionId || ''));
  if (!session?.awaiting) return res.status(404).json({ error: { message: 'Nothing is waiting for approval.' } });

  const { results, waiting } = session.awaiting;
  session.awaiting = null;
  for (const w of waiting) {
    if (req.body?.approve === true) results.push(execute(w.block, safeTools[w.block.name], w.input, session));
    else results.push(errorResult(w.block.id, 'The user declined this action.'));
  }
  session.messages.push({ role: 'user', content: results });
  res.json(view(session, await drive(session)));
});

export default router;
