import Anthropic from '@anthropic-ai/sdk';

// The model id comes from .env so you can change it without touching code.
// Check docs.anthropic.com for the current model names.
export const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

// The SDK reads ANTHROPIC_API_KEY from the environment by itself.
export const client = new Anthropic();

export const hasKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

// Join all text blocks of a reply into one string.
export const textOf = (reply) =>
  reply.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
