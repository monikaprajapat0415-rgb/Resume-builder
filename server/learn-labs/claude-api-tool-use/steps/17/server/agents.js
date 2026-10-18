import { client, MODEL } from './claude.js';

// A reusable agent loop. An agent is: a model + tools + a loop + limits.
//
//   tools     the tool definitions Claude may choose from
//   handlers  { toolName: (input) => result }, plain functions that YOUR code runs
//   maxTurns  hard limit on model calls
//   maxTokens hard limit on total tokens (input + output) for the whole run
export async function runAgent({ system, user, tools = [], handlers = {}, maxTurns = 6, maxTokens = 12000, maxReplyTokens = 700 }) {
  const messages = [{ role: 'user', content: user }];
  const trace = [];
  const usage = { input: 0, output: 0 };

  for (let turn = 1; turn <= maxTurns; turn++) {
    const started = Date.now();
    const reply = await client.messages.create({
      model: MODEL,
      max_tokens: maxReplyTokens,
      system,
      ...(tools.length ? { tools } : {}),
      messages,
    });
    usage.input += reply.usage?.input_tokens || 0;
    usage.output += reply.usage?.output_tokens || 0;
    messages.push({ role: 'assistant', content: reply.content });

    const text = reply.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (reply.stop_reason !== 'tool_use') {
      return { text, trace, turns: turn, stopReason: 'done', usage };
    }

    const results = [];
    for (const block of reply.content.filter((b) => b.type === 'tool_use')) {
      let output;
      let isError = false;
      try {
        if (!handlers[block.name]) throw new Error(`Unknown tool: ${block.name}`);
        output = await handlers[block.name](block.input || {});
      } catch (e) {
        output = { error: e.message };
        isError = true;
      }
      trace.push({ turn, tool: block.name, input: block.input, output, isError, ms: Date.now() - started });
      results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(output).slice(0, 6000), ...(isError ? { is_error: true } : {}) });
    }
    messages.push({ role: 'user', content: results });

    if (usage.input + usage.output > maxTokens) {
      return { text: 'Stopped: the token budget for this run was used up.', trace, turns: turn, stopReason: 'budget', usage };
    }
  }
  return { text: 'Stopped: the agent reached its step limit.', trace, turns: maxTurns, stopReason: 'max_turns', usage };
}
