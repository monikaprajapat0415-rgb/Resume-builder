import { ROWS, PATTERNS } from './table'

// Builds one language's dictionary from the shared table. Column 1 = Spanish ... 4 = Arabic.
export const build = (col) => {
  const d = {}
  for (const row of ROWS) if (row[col]) d[row[0]] = row[col]
  d.__patterns = PATTERNS.map(([re, outs]) => [new RegExp(re), outs[col - 1]])
  return d
}
