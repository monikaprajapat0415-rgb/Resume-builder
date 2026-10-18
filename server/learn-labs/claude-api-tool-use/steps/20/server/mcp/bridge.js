import { client as claude, MODEL, textOf } from '../claude.js';
import { withClient, listServers } from './client.js';

// Claude's tool format is almost the same as MCP's. Only the names differ.
// We prefix each name with the server, so two servers can both have a tool called "search".
const toClaudeTool = (server, t) => ({
  name: `${server}__${t.name}`,
  description: t.description || t.title || t.name,
  input_schema: t.inputSchema,
});

const textFromResult = (result) =>
  (result.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n') || JSON.stringify(result);

// Ask Claude a question and let it use every tool from the MCP servers on the allow-list.
export async function askWithMcp(message, { servers: allowed, maxTurns = 5 } = {}) {
  const available = (await listServers()).filter((s) => !allowed || allowed.includes(s.name));
  const tools = available.flatMap((s) => s.tools.map((t) => toClaudeTool(s.name, t)));

  const messages = [{ role: 'user', content: message }];
  const trace = [];
  for (let turn = 1; turn <= maxTurns; turn++) {
    const reply = await claude.messages.create({ model: MODEL, max_tokens: 700, tools, messages });
    messages.push({ role: 'assistant', content: reply.content });
    if (reply.stop_reason !== 'tool_use') return { text: textOf(reply), trace, tools: tools.map((t) => t.name) };

    const results = [];
    for (const block of reply.content.filter((b) => b.type === 'tool_use')) {
      const [server, ...rest] = block.name.split('__');
      const tool = rest.join('__');
      let content;
      let isError = false;
      try {
        if (!tools.some((t) => t.name === block.name)) throw new Error('That tool is not allowed.');
        const r = await withClient(server, (c) => c.callTool({ name: tool, arguments: block.input }));
        content = textFromResult(r);
        isError = Boolean(r.isError);
      } catch (e) {
        content = `Error: ${e.message}`;
        isError = true;
      }
      trace.push({ tool: block.name, input: block.input, output: content, isError });
      results.push({ type: 'tool_result', tool_use_id: block.id, content: content.slice(0, 6000), ...(isError ? { is_error: true } : {}) });
    }
    messages.push({ role: 'user', content: results });
  }
  return { text: 'Stopped: too many steps.', trace, tools: tools.map((t) => t.name) };
}
