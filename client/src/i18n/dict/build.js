import { ROWS, PATTERNS } from './table'
import { HOME_ROWS } from './home'

// Builds one language's dictionary from the shared table. Column 1 = Spanish ... 4 = Arabic.
export const build = (col) => {
  const d = {}
  for (const row of [...ROWS, ...HOME_ROWS]) if (row[col]) d[row[0]] = row[col]
  d.__patterns = PATTERNS.map(([re, outs]) => [new RegExp(re), outs[col - 1]])
  return d
}
