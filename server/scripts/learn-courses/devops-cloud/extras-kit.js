// Adds the standard teaching sections (why, real-life example, diagram, real-world usage, common errors,
// best practices, interview questions, exercises, mini project, knowledge test) around a lesson's own content.
import { P, H, L, O, N, C } from '../kit.js';

export const addExtras = (lesson, x) => {
  if (!x) return lesson;
  const i = lesson.content.findIndex((b) => b.type === 'heading' && b.text === 'Your task');
  const body = i >= 0 ? lesson.content.slice(0, i) : lesson.content;
  const check = i >= 0 ? lesson.content.slice(i).filter((_, k, a) => {
    const h = a.findIndex((b) => b.type === 'heading' && b.text === 'How to check it worked');
    return h >= 0 && k >= h;
  }) : [];
  const out = [
    body[0],
    H('Why do we need it?'), P(x.why),
    H('A real-life example'), P(x.real),
    ...body.slice(1),
    ...(x.more || []),
    H('Architecture diagram'), P(x.diagramIntro || 'Here is the idea as a simple picture. You can use the same diagram in your own notes.'), C('mermaid', x.diagram),
    ...check,
    H('How companies use it'), P(x.usage),
    H('Common errors and how to fix them'), L(...x.errors.map(([e, f]) => `**${e}** ${f}`)),
    H('Best practices'), L(...x.practices),
    H('Interview questions with simple answers'), O(...x.interview.map(([q, a]) => `**${q}** ${a}`)),
    ...(x.warn ? [N('Warning: ' + x.warn)] : []),
    H('Practical exercises'), P('Try each one yourself before you look at the hint. Struggling for a few minutes is how the skill sticks.'),
    O(...x.exercises.map(([t, h]) => `${t} Hint: ${h}`)),
    H('Mini project: ' + x.mini[0]), P(x.mini[1]),
    H('Knowledge test'), P('Answer the ten questions in the quiz at the end of this lesson. You pass with 60 percent. If an answer is wrong, read the explanation, then reread the part of the lesson it points to.'),
  ];
  return { ...lesson, content: out };
};
