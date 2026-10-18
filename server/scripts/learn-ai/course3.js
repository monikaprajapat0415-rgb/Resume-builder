import { lessons as p1 } from './course3-part1.js';
import { lessons as p2 } from './course3-part2.js';
import { lessons as p3 } from './course3-part3.js';
import { lessons as p4 } from './course3-part4.js';
import { lessons as p5 } from './course3-part5.js';

export const course = {
  title: 'RAG, AI Agents & MCP',
  slug: 'rag-ai-agents-mcp',
  summary: 'Build RAG, agents and MCP into your Angular and Node AI Lab. Every lesson ends with a task and a downloadable solution.',
  description: 'An advanced AI course: RAG with embeddings and vector databases, AI agents, the Model Context Protocol (MCP), evaluation, privacy and production. Each lesson has a task and a downloadable solution.',
  level: 'Advanced',
  topic: 'AI',
  badge: 'RAG',
  tags: ['rag', 'ai agents', 'mcp', 'vector database', 'llm evaluation'],
  order: 22,
  published: true,
  metaTitle: 'RAG, AI Agents & MCP: Free Advanced AI Course',
  keywords: 'rag tutorial, ai agents course, model context protocol, vector database, llm evaluation',
};


// Honest reading time: prose at about 200 words a minute, plus a little for the code.
const minutes = (l) => {
  let words = 0, code = 0;
  for (const b of l.content) {
    if (b.type === 'code') code += b.text.split('\n').length;
    else words += ((b.text || '') + ' ' + (b.items || []).join(' ')).split(/\s+/).filter(Boolean).length;
  }
  return Math.round(words / 200 + code / 25);
};

// The solution zip is shown as a download card under the lesson (the repo zips or an admin upload).
// This course continues the Claude API lab: lesson 1 here is lab step 13.
export const lessons = [...p1, ...p2, ...p3, ...p4, ...p5].map((l, i) => ({
  ...l, lab: 'claude-api-tool-use', labStep: 13 + i, readTime: `${minutes(l)} min read`,
}));
