import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(here, '..');

// The host decides which servers exist. Users and the model cannot add new ones.
export const servers = () => JSON.parse(fs.readFileSync(path.join(here, 'servers.json'), 'utf8'));

// Start a server, connect, run `fn(client)`, then always shut the server down.
// (Starting a process per call is simple and fine for a lab. A production host keeps connections open.)
export async function withClient(name, fn) {
  const cfg = servers()[name];
  if (!cfg) {
    const err = new Error(`Unknown MCP server: ${name}`);
    err.status = 404;
    err.userMessage = 'That MCP server is not configured.';
    throw err;
  }
  const transport = new StdioClientTransport({ command: cfg.command, args: cfg.args, cwd: serverDir, stderr: 'ignore' });
  const client = new Client({ name: 'ai-lab', version: '1.0.0' });
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

export async function listServers() {
  const out = [];
  for (const name of Object.keys(servers())) {
    const tools = await withClient(name, async (c) => (await c.listTools()).tools);
    out.push({ name, tools: tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })) });
  }
  return out;
}

export const callTool = (server, tool, args) => withClient(server, (c) => c.callTool({ name: tool, arguments: args }));
