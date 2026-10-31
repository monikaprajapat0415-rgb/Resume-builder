// Shared helpers for the interview question files.
// A(category, level, question, answer, tips, tag): level is fresher (basic), both (intermediate) or experienced (advanced).
export const mk = (tag) => (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips, tags: [tag] });
// Link each question to the course (and, per category, a lesson) that teaches it.
export const withLearn = (list, course, byCategory = {}) => list.map((q) => ({ ...q, learnCourse: course, learnLesson: byCategory[q.category] || '' }));
