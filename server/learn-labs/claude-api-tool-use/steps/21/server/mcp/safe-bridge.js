import crypto from 'node:crypto';
import { client as claude, MODEL, textOf } from '../claude.js';
import { withClient, listServers } from './client.js';
import { ruleFor, wrapUntrusted, SAFE_SYSTEM } from './policy.js';

const pending = new Map(); // id -> { state, expires }
const TTL = 10 * 60 * 1000;

const textFromResult = (r) => (r.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n') || JSON.stringify(r);

// Only tools whose rule is not "deny" are even shown to the model.
async function offeredTools() {
  const all = (await listServers()).flatMap((s) => s.tools.map((t) => ({ server: s.name, ...t })));
  return all
    .filter((t) => ruleFor(`${t.server}__${t.name}`) !== 'deny')
    .map((t) => ({ name: `${t.server}__${t.name}`, description: t.description || t.name, input_schema: t.inputSchema }));
}

// Run the loop until Claude is done or a tool needs the user's approval.
async function loop(state) {
  const tools = await offeredTools();
  while (state.turns < 6) {
    state.turns++;
    const reply = await claude.messages.create({ model: MODEL, max_tokens: 600, system: SAFE_SYSTEM, tools, messages: state.messages });
    state.messages.push({ role: 'assistant', content: reply.content });
    if (reply.stop_reason !== 'tool_use') return { status: 'done', text: textOf(reply), trace: state.trace };

    const results = [];
    const calls = reply.content.filter((b) => b.type === 'tool_use');
    for (const [i, block] of calls.entries()) {
      const rule = ruleFor(block.name);
      if (rule === 'approve') {
        // Stop here. Save everything so the loop can continue after the user decides.
        // Every tool_use needs a tool_result, so calls after this one get a "skipped" result.
        const skipped = calls.slice(i + 1).map((b) => ({ type: 'tool_result', tool_use_id: b.id, content: 'Skipped: waiting for the user to approve an earlier action. Ask again if still needed.', is_error: true }));
        const id = crypto.randomUUID();
        state.waiting = { block, done: results, skipped };
        pending.set(id, { state, expires: Date.now() + TTL });
        if (pending.size > 50) pending.delete(pending.keys().next().value);
        return { status: 'pending', approval: { id, tool: block.name, input: block.input }, trace: state.trace };
      }
      results.push(await execute(state, block, rule));
    }
    state.messages.push({ role: 'user', content: results });
  }
  return { status: 'done', text: 'Stopped: too many steps.', trace: state.trace };
}

async function execute(state, block, rule) {
  let content;
  let isError = false;
  let flagged = false;
  if (rule === 'deny') {
    content = 'Error: this tool is not permitted.';
    isError = true;
  } else {
    try {
      const [server, ...rest] = block.name.split('__');
      const r = await withClient(server, (c) => c.callTool({ name: rest.join('__'), arguments: block.input }));
      const wrapped = wrapUntrusted(textFromResult(r));
      content = wrapped.wrapped;
      flagged = wrapped.flagged;
      isError = Boolean(r.isError);
    } catch (e) {
      content = `Error: ${e.message}`;
      isError = true;
    }
  }
  state.trace.push({ tool: block.name, input: block.input, rule, isError, flagged, output: content.slice(0, 600) });
  return { type: 'tool_result', tool_use_id: block.id, content, ...(isError ? { is_error: true } : {}) };
}

export const start = (message) => loop({ messages: [{ role: 'user', content: message }], trace: [], turns: 0 });

export async function decide(id, approved) {
  const entry = pending.get(id);
  pending.delete(id);
  if (!entry || entry.expires < Date.now()) return null; // unknown or expired: nothing runs
  const { state } = entry;
  const { block, done, skipped } = state.waiting;
  state.waiting = null;
  const result = approved
    ? await execute(state, block, 'allow')
    : (state.trace.push({ tool: block.name, input: block.input, rule: 'approve', isError: true, flagged: false, output: 'The user declined.' }),
      { type: 'tool_result', tool_use_id: block.id, content: 'The user declined this action.', is_error: true });
  state.messages.push({ role: 'user', content: [...done, result, ...skipped] });
  return loop(state);
}
