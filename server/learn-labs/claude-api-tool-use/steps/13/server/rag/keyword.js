// Keyword retrieval: the simplest useful search.
// Score = how many rare words the question and the chunk share.

const STOP = new Set('a an the and or of to in on at for with from by is are was were be been it this that these those i you we they my your our their me do does did how what when where why which can should would will not no yes as if but so than then there here about into over'.split(' '));

// A very light "stemmer": pages -> page, formatting -> formatt, skills -> skill.
// It is crude on purpose. It only needs to make the same word look the same.
const stem = (w) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w);

export const tokenize = (text) =>
  (String(text).toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) || [])
    .map((w) => w.replace(/[.-]+$/, ''))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);

export function keywordSearch(question, chunks, k = 3) {
  const q = [...new Set(tokenize(question))];
  const docFreq = new Map();
  const tokenized = chunks.map((c) => new Set(tokenize(c.text + ' ' + c.title)));
  for (const set of tokenized) for (const t of set) docFreq.set(t, (docFreq.get(t) || 0) + 1);

  return chunks
    .map((chunk, i) => {
      let score = 0;
      for (const t of q) {
        if (tokenized[i].has(t)) score += Math.log(1 + chunks.length / (docFreq.get(t) || 1));
      }
      return { ...chunk, score: Number(score.toFixed(3)) };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
