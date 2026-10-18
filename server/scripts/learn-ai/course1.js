import { lessons as p1 } from './course1-part1.js';
import { lessons as p2 } from './course1-part2.js';
import { lessons as p3 } from './course1-part3.js';

export const course = {
  title: 'Generative AI & LLM Fundamentals',
  slug: 'generative-ai-llm-fundamentals',
  summary: 'Understand how AI, machine learning and large language models work, then learn prompt engineering. Every lesson ends with a hands-on task and a downloadable solution.',
  description: 'A free beginner course on generative AI: machine learning basics, how LLMs work, tokens, context windows, hallucinations and prompt engineering. Each lesson has a hands-on task and a downloadable solution.',
  level: 'Beginner',
  topic: 'AI',
  badge: 'AI',
  tags: ['generative ai', 'llm', 'prompt engineering', 'machine learning'],
  order: 20,
  published: true,
  metaTitle: 'Generative AI & LLM Fundamentals: Free Course',
  keywords: 'generative ai course, llm fundamentals, learn prompt engineering, ai for beginners, how llms work',
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

// Each lesson has one browser-only exercise in the GenAI Basics Lab; the zip shows as a download card.
export const lessons = [...p1, ...p2, ...p3].map((l, i) => ({
  ...l, lab: 'genai-basics-lab', labStep: i + 1, readTime: `${minutes(l)} min read`,
}));
