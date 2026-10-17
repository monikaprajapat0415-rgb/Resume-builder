import { lessons as p1 } from './course2-part1.js';
import { lessons as p2 } from './course2-part2.js';
import { lessons as p3 } from './course2-part3.js';
import { lessons as p4 } from './course2-part4.js';

export const course = {
  title: 'Claude API & Tool Use with Angular and Node.js',
  slug: 'claude-api-tool-use',
  summary: 'Build a real Angular and Node.js AI app with Claude. Every lesson ends with a task and a downloadable solution.',
  description: 'Build an Angular AI app with the Claude API: chat, streaming, caching, PDFs, tool use and prompts. Each lesson has a task and a downloadable solution.',
  level: 'Intermediate',
  topic: 'AI',
  badge: 'CL',
  tags: ['claude api', 'anthropic', 'tool use', 'angular', 'node.js'],
  order: 21,
  published: true,
  metaTitle: 'Claude API with Angular & Node.js: Free Course',
  keywords: 'claude api tutorial, claude api angular, anthropic api node.js, claude tool use, ai app with angular',
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

export const lessons = [...p1, ...p2, ...p3, ...p4].map((l) => ({ ...l, readTime: `${minutes(l)} min read` }));
