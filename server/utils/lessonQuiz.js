// Lesson quiz: a few multiple-choice questions shown at the end of a lesson (practice only, checked in the browser).
//
// [{ q: 'Which command saves a snapshot?', options: ['git add', 'git commit', 'git push'], answer: 1, explain: 'commit records the staged changes.' }, ...]
// answer is the zero-based index of the right option.

const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const fail = (msg) => { throw new Error(`Quiz: ${msg}`); };

// Returns the cleaned quiz, undefined for "no quiz", or throws an Error with a plain message the admin can act on.
export const cleanQuiz = (input) => {
    if (input === null || input === undefined || input === '') return undefined;
    if (!Array.isArray(input)) fail('must be a list of questions.');
    if (input.length === 0) return undefined;
    if (input.length > 10) fail('use 10 questions or fewer.');
    return input.map((item, i) => {
        const n = i + 1;
        const q = str(item?.q, 300);
        if (!q) fail(`question ${n} needs text (q).`);
        const options = (Array.isArray(item?.options) ? item.options : []).map((o) => str(o, 200)).filter(Boolean);
        if (options.length < 2 || options.length > 5) fail(`question ${n} needs 2 to 5 options.`);
        if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) fail(`question ${n} has two options that are the same.`);
        const answer = Number(item?.answer);
        if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) fail(`question ${n}: answer must be the position of the right option, starting at 0.`);
        return { q, options, answer, explain: str(item?.explain, 500) };
    });
};
