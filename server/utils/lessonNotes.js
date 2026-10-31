// Lesson notes: a short "handwritten" cheat-sheet card at the end of a lesson.
//   ['Git is on your computer; GitHub is a website for sharing projects.', 'git status is always safe to run.']
// Plain text lines. Wrap a word in `backticks` for code. 3 to 10 lines of up to 220 characters each.

const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// Returns the cleaned list, undefined for "no notes", or throws an Error with a plain message the admin can act on.
export const cleanNotes = (input) => {
    if (input === null || input === undefined || input === '') return undefined;
    const list = typeof input === 'string' ? input.split(/\r?\n/) : input;
    if (!Array.isArray(list)) throw new Error('Notes: must be a list of lines.');
    const out = list.map((x) => str(x, 220)).filter(Boolean);
    if (out.length === 0) return undefined;
    if (out.length > 10) throw new Error('Notes: use 10 lines or fewer.');
    return out;
};
