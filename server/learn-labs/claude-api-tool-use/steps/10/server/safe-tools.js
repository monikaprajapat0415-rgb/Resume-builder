import { z } from 'zod';

// Every tool has: a description for Claude, a JSON Schema Claude must follow,
// a zod schema WE use to check what Claude really sent, and a flag for approval.
// "ctx" is the private data of one chat session (its notes).

export const safeTools = {
  save_note: {
    needsApproval: false,
    description: 'Save a short note for the user, such as a skill to add to the resume.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short title, up to 80 characters' },
        text: { type: 'string', description: 'The note text, up to 1000 characters' },
      },
      required: ['title', 'text'],
    },
    schema: z.object({ title: z.string().min(1).max(80), text: z.string().min(1).max(1000) }),
    run({ title, text }, ctx) {
      const id = String(++ctx.counter);
      ctx.notes.set(id, { id, title, text });
      return { saved: id };
    },
  },
  list_notes: {
    needsApproval: false,
    description: 'List the notes saved so far.',
    inputSchema: { type: 'object', properties: {} },
    schema: z.object({}),
    run(_input, ctx) {
      return { notes: [...ctx.notes.values()] };
    },
  },
  delete_note: {
    needsApproval: true, // hard to undo, so a person must approve it
    description: 'Delete a saved note by its id. The user must approve this action.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'The id of the note to delete' } },
      required: ['id'],
    },
    schema: z.object({ id: z.string().min(1).max(20) }),
    run({ id }, ctx) {
      // Ownership check: ctx belongs to this session only, so one user can never reach another user's notes.
      if (!ctx.notes.delete(id)) throw new Error('There is no note with that id.');
      return { deleted: id };
    },
  },
};

export const toolDefs = Object.entries(safeTools).map(([name, t]) => ({
  name,
  description: t.description,
  input_schema: t.inputSchema,
}));
