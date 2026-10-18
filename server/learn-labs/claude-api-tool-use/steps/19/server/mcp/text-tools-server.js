// A very small MCP server. It speaks the MCP protocol over stdin/stdout (the "stdio" transport).
// A host (our Node app) starts this file as a child process and talks to it.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'text-tools', version: '1.0.0' });

// A tool = a name, a description the model reads, an input schema and a handler.
server.registerTool(
  'count_words',
  {
    title: 'Count words',
    description: 'Count the words and characters in a piece of text.',
    inputSchema: { text: z.string().max(20000).describe('The text to count') },
  },
  async ({ text }) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { content: [{ type: 'text', text: JSON.stringify({ words, characters: text.length }) }] };
  },
);

// IMPORTANT: never use console.log in a stdio server. stdout carries the protocol itself.
// Write logs to stderr instead.
console.error('[text-tools] ready');
await server.connect(new StdioServerTransport());
