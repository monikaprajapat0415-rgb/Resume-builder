import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'resume-tools', version: '1.0.0' });

const STOP = new Set('the a an and or of to in for with on at by is are be as we you our your will can from this that it their they them have has not but if'.split(' '));
const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }] });

// Tool 1: keywords from a job post.
server.registerTool(
  'job_keywords',
  {
    title: 'Job keywords',
    description: 'Find the most frequent skills and keywords in a job description. Use it when the user pastes a job post and wants keywords for a resume.',
    inputSchema: {
      job_text: z.string().min(20).max(20000).describe('The full job description'),
      max_keywords: z.number().int().min(1).max(20).default(8).describe('How many keywords to return'),
    },
  },
  async ({ job_text, max_keywords }) => {
    const counts = new Map();
    for (const w of job_text.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || []) if (!STOP.has(w)) counts.set(w, (counts.get(w) || 0) + 1);
    const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, max_keywords);
    return text({ keywords: top.map(([word, times]) => ({ word, times })) });
  },
);

// Tool 2: check bullet points. Errors the model can fix are returned with isError: true,
// not thrown, so the model reads them and tries again.
server.registerTool(
  'check_bullets',
  {
    title: 'Check resume bullets',
    description: 'Check resume bullet points. Reports bullets that are too long, do not start with an action verb or contain no number.',
    inputSchema: { bullets: z.array(z.string().max(400)).min(1).max(20) },
  },
  async ({ bullets }) => {
    const verbs = /^(managed|built|led|created|reduced|increased|improved|developed|handled|delivered|trained|designed|launched|organised|organized|operated|repaired|installed|sold|served|wrote|planned|supported|maintained|cut|saved|grew|drove)\b/i;
    const report = bullets.map((b, i) => ({
      bullet: i + 1,
      tooLong: b.split(/\s+/).length > 28,
      startsWithActionVerb: verbs.test(b.trim()),
      hasNumber: /\d/.test(b),
    }));
    return text({ report, allGood: report.every((r) => !r.tooLong && r.startsWithActionVerb && r.hasNumber) });
  },
);

// A resource = read-only data the host can load as context (no model decision involved).
server.registerResource(
  'resume-rules',
  'resume://rules',
  { title: 'Resume rules', description: 'Short house rules for good resume bullets', mimeType: 'text/plain' },
  async (uri) => ({ contents: [{ uri: uri.href, text: 'Start with an action verb. Keep each bullet under 28 words. Include one number. Be honest.' }] }),
);

console.error('[resume-tools] ready');
await server.connect(new StdioServerTransport());
