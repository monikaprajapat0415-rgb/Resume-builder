import { withLearn } from './lib.mjs';
import { s1 } from './sql-1.mjs';
import { s2 } from './sql-2.mjs';

const LESSONS = {
  'SQL and database basics': 'what-is-sql-and-a-database',
  'SQL SELECT, filtering and sorting': 'select-from-where-basics',
  'SQL aggregates and GROUP BY': 'group-by-and-having',
  'SQL keys and table design': 'primary-foreign-keys-table-design',
  'SQL joins': 'sql-joins-inner-left',
  'SQL subqueries, CTEs and set operations': 'subqueries-exists-and-ctes',
  'SQL changing data safely': 'insert-update-delete-safely',
  'SQL window functions': 'window-functions-row-number-rank',
  'SQL indexes, transactions and performance': 'indexes-and-query-performance',
};
export const sqlQuestions = withLearn([...s1, ...s2], 'sql-for-beginners', LESSONS);
