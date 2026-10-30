const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'sql-for-beginners';
export const quizzes = {
  'what-is-sql-and-a-database': [
    Q('In a relational database, what is a row?', ['One kind of fact, such as price', 'One thing described by the facts, such as one customer', 'A link to another database'], 1, 'A column is one kind of fact. A row is one thing described by those facts.'),
    Q('What does a foreign key do?', ['It says which table a row belongs to by pointing at another table\'s key', 'It makes a column impossible to change', 'It sorts the table'], 0, 'The primary key says "who am I?". The foreign key says "who do I belong to?".'),
    Q('Which SQL command reads rows that match a question?', ['INSERT', 'SELECT', 'DELETE'], 1, 'SELECT reads data. INSERT adds, UPDATE changes and DELETE removes.'),
  ],
  'set-up-sqlite-practice-database': [
    Q('Why does the course use SQLite for practice?', ['It needs no server and no password, and stores everything in one file', 'It is the only database that supports SQL', 'It is faster than every other database'], 0, 'SQLite is a tiny engine that keeps the whole database in a single file.'),
    Q('What happens when you type sqlite3 shop.db on the command line?', ['It deletes shop.db', 'It creates or opens a file called shop.db and shows a prompt', 'It installs a server'], 1),
    Q('Why run the setup script on your own practice file only?', ['Because SQL cannot run anywhere else', 'So a mistake can be fixed by deleting the file and starting again', 'Because the script is secret'], 1, 'Practise on your own shop.db, never on a company database.'),
  ],
  'select-from-where-basics': [
    Q('Which order is always correct?', ['SELECT, WHERE, FROM', 'FROM, SELECT, WHERE', 'SELECT, FROM, WHERE'], 2, 'You write SELECT, then FROM, then WHERE.'),
    Q('How do you test for a missing value?', ['WHERE city = NULL', 'WHERE city IS NULL', 'WHERE city = \'\''], 1, 'Use IS NULL and IS NOT NULL. Never = NULL.'),
    Q('In SQL, text values are written with…', ['single quotes, like \'Nairobi\'', 'no quotes at all', 'square brackets'], 0, 'Without quotes the database looks for a column with that name.'),
  ],
  'filter-with-and-or-in-between-like': [
    Q('Which statement is true?', ['AND widens the result, OR narrows it', 'AND narrows the result, OR widens it', 'They always give the same rows'], 1),
    Q('What does BETWEEN 100 AND 700 include?', ['Both 100 and 700', 'Only the values strictly between them', 'Only 100'], 0, 'BETWEEN includes both ends. The smaller number must come first.'),
    Q('Which query finds names that contain the word note?', ['WHERE name = \'%note%\'', 'WHERE name LIKE \'%note%\'', 'WHERE name IN \'note\''], 1, 'Use LIKE with % for patterns. = looks for the exact text.'),
  ],
  'order-by-limit-distinct': [
    Q('If you do not write ORDER BY, what order do you get?', ['Always oldest first', 'Always alphabetical', 'No promised order'], 2, 'You must never depend on the default order.'),
    Q('How do you sort largest first?', ['ORDER BY price DESC', 'ORDER BY price DOWN', 'SORT price DESC'], 0),
    Q('What does DISTINCT do?', ['Sorts the rows', 'Removes repeated values from the result', 'Counts the rows'], 1),
  ],
  'aggregate-functions-count-sum-avg': [
    Q('What is the difference between COUNT(*) and COUNT(column)?', ['None', 'COUNT(column) skips NULL values; COUNT(*) counts every row', 'COUNT(*) skips NULL values'], 1),
    Q('Why does SELECT name, MAX(price) FROM products not work as a beginner might expect?', ['MAX cannot be used on numbers', 'The database does not know which name goes with the one maximum without more instructions', 'Because price is text'], 1, 'Mixing an aggregate and a plain column needs GROUP BY.'),
    Q('Can you write WHERE COUNT(*) > 2?', ['Yes, always', 'No, WHERE filters rows before counting; use HAVING', 'Only in SQLite'], 1),
  ],
  'group-by-and-having': [
    Q('Which clause filters groups after they are made?', ['WHERE', 'HAVING', 'LIMIT'], 1),
    Q('A selected column that is not inside an aggregate must…', ['be left out', 'also appear in GROUP BY', 'be written in capitals'], 1, 'That is the main rule of GROUP BY.'),
    Q('When should you use WHERE together with GROUP BY?', ['To throw away rows you do not need before grouping', 'Never; it is not allowed', 'Only to sort the groups'], 0),
  ],
  'primary-foreign-keys-table-design': [
    Q('Why is data split into several tables?', ['So each fact is stored once and does not have to be fixed in many places', 'Because databases cannot hold a big table', 'To make queries slower'], 0),
    Q('A column ending in _id (such as customer_id) is probably…', ['a primary key of the same table', 'a foreign key pointing to another table', 'a text column'], 1, 'Look for _id columns when you read an unfamiliar database.'),
    Q('What is a good simple rule for designing a small database?', ['One table for each kind of thing', 'One table for everything', 'One table per day'], 0),
  ],
  'sql-joins-inner-left': [
    Q('What does INNER JOIN return?', ['Only rows that have a match on both sides', 'All rows from the left table', 'All rows from both tables'], 0),
    Q('You run customers LEFT JOIN orders and one customer has no orders. What happens to that customer?', ['They are dropped', 'They stay, and the order columns are NULL', 'The query fails'], 1, 'LEFT JOIN keeps every row from the left table and fills missing matches with NULL.'),
    Q('How do you find rows with no match in the other table?', ['LEFT JOIN, then WHERE the right-side key IS NULL', 'INNER JOIN with WHERE = 0', 'CROSS JOIN'], 0),
  ],
  'subqueries-exists-and-ctes': [
    Q('Which part of a query with a subquery runs first?', ['The outer query', 'The inner query', 'They run at the same time'], 1),
    Q('What is the NOT IN trap?', ['It is slower', 'If the list contains NULL, no rows may match', 'It only works on text'], 1, 'NOT IN with a NULL in the list can return nothing. NOT EXISTS is safer.'),
    Q('What does a CTE (WITH) give you?', ['A faster computer', 'A name for each step so a long query is easier to read', 'A new table saved on disk'], 1),
  ],
  'insert-update-delete-safely': [
    Q('What is the most dangerous mistake with UPDATE or DELETE?', ['Using capital letters', 'Leaving out the WHERE', 'Using single quotes'], 1, 'Without WHERE, every row is changed or removed.'),
    Q('What should you do before running an UPDATE or DELETE?', ['Run a SELECT with the same WHERE and look at the rows', 'Restart the computer', 'Nothing'], 0),
    Q('Why write the column list in INSERT INTO table (columns) VALUES (...)?', ['It is required by every engine', 'It does not break when someone adds a column to the table', 'It makes the insert faster'], 1),
  ],
  'create-table-data-types-constraints': [
    Q('What is a constraint?', ['A rule the database checks every time you insert or update a row', 'A kind of index', 'A comment in the code'], 0),
    Q('Which constraint stops two rows having the same email?', ['NOT NULL', 'UNIQUE', 'DEFAULT'], 1),
    Q('Which type does the lesson suggest for money in most engines?', ['DECIMAL(10,2) (or whole numbers of the smallest unit)', 'TEXT', 'BOOLEAN'], 0, 'Decimals avoid odd rounding that floating point numbers can cause.'),
  ],
  'window-functions-row-number-rank': [
    Q('How is a window function different from GROUP BY?', ['It keeps every row and adds a calculated column', 'It collapses rows into one', 'It only works on text'], 0),
    Q('What does PARTITION BY do inside OVER?', ['Restarts the calculation for each group', 'Deletes duplicate rows', 'Sorts the final result'], 0),
    Q('Can you filter on a window function directly in WHERE?', ['Yes', 'No, wrap the query in a subquery or CTE and filter outside', 'Only with HAVING'], 1),
  ],
  'indexes-and-query-performance': [
    Q('What is an index like?', ['The index at the back of a textbook that lets you jump to the right page', 'A backup copy of the table', 'A password'], 0),
    Q('Which habit can stop an ordinary index being used?', ['Putting a function on the column, like WHERE UPPER(name) = \'ASHA\'', 'Using AND', 'Naming the columns in SELECT'], 0),
    Q('Are indexes free?', ['Yes, add one to every column', 'No, they take space and make inserts and updates slower', 'Yes, they speed up everything'], 1),
  ],
  'sql-interview-questions-and-next-steps': [
    Q('What is the difference between WHERE and HAVING?', ['WHERE filters rows before grouping; HAVING filters groups after grouping', 'They are the same', 'HAVING is only for text'], 0),
    Q('What is the difference between DELETE and DROP?', ['DELETE removes chosen rows; DROP removes the whole table including its structure', 'They do the same thing', 'DROP only removes one row'], 0),
    Q('A good way to answer a query question in an interview is to…', ['say your plan, start simple, run it and mention edge cases like NULLs', 'type the full query silently', 'guess without checking'], 0),
  ],
};
