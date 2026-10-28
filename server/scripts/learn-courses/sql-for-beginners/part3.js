import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S5 = 'Changing Data';
const S6 = 'Going Further';

export const lessons = [
  // ---------------------------------------------------------------- 11
  les(S5, 'insert-update-delete-safely', 'INSERT, UPDATE and DELETE: Change Data Safely', 'SQL INSERT, UPDATE and DELETE Safely',
    'Add, change and remove rows with INSERT, UPDATE and DELETE. Learn the safe habits that protect real data: SELECT first, always WHERE, and transactions.', [
    P("Until now you only read data. Real work also means changing it: adding a new customer, fixing a wrong price, removing a test row. These statements are powerful. A single careless `UPDATE` without a condition can change every row in a table, and in a live system that can mean a very bad day. This lesson teaches the three statements and, more importantly, the habits that keep you safe."),
    N("Practice on your own `shop.db` only. If you break it, delete the file and run the setup script again. Never practise change statements on a company database."),
    H("INSERT: add a new row"),
    C('sql', `INSERT INTO customers (name, city, joined)
VALUES ('Ivy Dube', 'Durban', '2024-07-01');`),
    P("You name the table, then the columns in brackets, then the values in the same order. You do not give `id`: because it is an integer primary key, SQLite picks the next free number, which is 9. Check the result."),
    C('sql', `SELECT id, name FROM customers WHERE id >= 8;`),
    C('text', `id | name
8  | Hari Singh
9  | Ivy Dube`),
    P("Always write the column list. `INSERT INTO customers VALUES (...)` without names depends on the exact column order of the table, and it breaks the day someone adds a column. To add several rows at once, list several value groups separated by commas, as the setup script does."),
    P("Columns you leave out get their default value, which is NULL unless the table says otherwise. A column marked `NOT NULL` with no default must be given a value, or the insert fails."),
    H("UPDATE: change existing rows"),
    C('sql', `UPDATE customers
SET city = 'Pune'
WHERE id = 8;`),
    P("`SET` says what to change. `WHERE` says which rows. Hari had no city, and now has Pune. You can set several columns by separating them with commas, and use the old value in a calculation:"),
    C('sql', `UPDATE products
SET price = price + 10
WHERE category = 'Stationery';`),
    P("This raises the price of the three Stationery products by 10. The database tells you how many rows changed. If you expected 3 and it says 8, something is wrong, and you should stop and check."),
    N("The most dangerous mistake in SQL: an `UPDATE` or `DELETE` without a `WHERE`. It affects every row. Always type the `WHERE` first."),
    H("DELETE: remove rows"),
    C('sql', `DELETE FROM customers WHERE id = 9;`),
    P("This removes Ivy. Again, `WHERE` decides which rows go. `DELETE FROM customers;` with no `WHERE` empties the whole table. In many companies, rows are not really deleted. Instead a column such as `active` or `deleted_at` is set, which is called a **soft delete**, so the data can be recovered and old reports still add up."),
    H("The three safety habits"),
    O("**SELECT first.** Before an `UPDATE` or `DELETE`, run a `SELECT` with the same `WHERE` and look at the rows. If the list is what you expect, change `SELECT *` to `DELETE` and keep the same `WHERE`.", "**Check the row count.** After the statement, read how many rows were affected. A surprise number means stop.", "**Use a transaction** when the change matters. It lets you undo."),
    C('sql', `-- Step 1: look at what would change
SELECT * FROM products WHERE category = 'Stationery';

-- Step 2: change it
UPDATE products SET price = price + 10 WHERE category = 'Stationery';`),
    H("Transactions: a safety net"),
    P("A **transaction** groups statements into one all-or-nothing unit. You start with `BEGIN`, make changes, and finish with `COMMIT` to keep them or `ROLLBACK` to undo them all. Nobody else sees half-done work, and if something fails in the middle, you can go back."),
    C('sql', `BEGIN;
UPDATE products SET price = 0;      -- oops, forgot the WHERE
SELECT SUM(price) FROM products;    -- 0, that is wrong
ROLLBACK;                           -- undo everything
SELECT SUM(price) FROM products;    -- 5110 again`),
    P("After `ROLLBACK` the prices are back. Real systems use transactions all the time, for example when moving money: take it from one account and add it to another. Both steps must happen, or neither. In MySQL and PostgreSQL the start is `BEGIN` or `START TRANSACTION`. Some tools auto-commit each statement unless you start a transaction yourself, so check your tool's setting."),
    H("What foreign keys do when you change data"),
    P("Remember the foreign keys from lesson 8? When they are enforced, the database protects the links. In SQLite, turn them on first with `PRAGMA foreign_keys = ON;`."),
    C('sql', `PRAGMA foreign_keys = ON;

DELETE FROM customers WHERE id = 1;
-- Error: FOREIGN KEY constraint failed (Asha still has orders)

INSERT INTO orders (customer_id, order_date, status)
VALUES (99, '2024-09-01', 'pending');
-- Error: FOREIGN KEY constraint failed (there is no customer 99)`),
    P("These errors are good news. The database is stopping you from creating orphan data. You can design a foreign key with `ON DELETE CASCADE`, which deletes the child rows automatically, or `ON DELETE SET NULL`. Use cascade carefully, because it can delete much more than you planned."),
    H("Other useful things"),
    L("`INSERT ... SELECT` copies rows from one table into another.", "`UPDATE` can use a subquery in `SET` or `WHERE` to decide the new value or rows.", "`REPLACE` or `INSERT ... ON CONFLICT` (an upsert) inserts a row, or updates it if it already exists. The syntax differs between engines.", "`TRUNCATE TABLE` empties a table quickly in MySQL, PostgreSQL and SQL Server. SQLite uses `DELETE FROM table`."),
    H("Common mistakes"),
    L("No `WHERE` on `UPDATE` or `DELETE`.", "A `WHERE` that matches more rows than you thought, for example `city = 'Nairobi'` also matching rows you did not mean to change.", "Putting text without quotes, or a number in quotes where a number is needed.", "Forgetting to `COMMIT` and then wondering why other people cannot see your change, or the opposite: committing by habit before checking."),
    ...task("Insert a new product called `Eraser` in the `Stationery` category with price 20, and select it back.", "Raise the price of the `Mouse` by 50, but first run the matching SELECT.", "Start a transaction, delete the order item with id 15, check the row count in `order_items`, then roll back and check again.", "Turn on foreign keys and try to delete customer 1. Read the error message."),
    ...check("After the insert the products table has 9 rows.", "After the rollback the `order_items` table has 15 rows again.", "The foreign key error appears when you delete a customer who has orders."),
  ], A('The safe way to change data', [
    n('sel', 'SELECT first', 'check the rows', 0, 0, 'check'), n('tx', 'BEGIN', 'start a transaction', 1, 0, 'tool'),
    n('chg', 'UPDATE / DELETE', 'with a WHERE', 2, 0, 'app'), n('ok', 'COMMIT', 'keep the change', 3, 0, 'out'), n('undo', 'ROLLBACK', 'undo it', 3, 1, 'data'),
  ], [
    { say: 'Before you change anything, run a SELECT with the same WHERE and look at the rows.', on: ['sel'] },
    { say: 'Start a transaction so the change can be undone.', flow: ['sel>tx:rows look right'] },
    { say: 'Run the UPDATE or DELETE with a WHERE and read how many rows changed.', flow: ['tx>chg:run it'] },
    { say: 'If the numbers are as expected, COMMIT keeps the change.', flow: ['chg>ok:correct'] },
    { say: 'If something looks wrong, ROLLBACK puts everything back as it was.', flow: ['chg>undo:wrong'] },
  ]), [
    faq('What happens if I forget WHERE in an UPDATE?', 'Every row in the table is changed. Always write the WHERE first and check with a SELECT. Use a transaction so you can ROLLBACK.'),
    faq('What is a soft delete?', 'Instead of removing the row, you mark it, for example with an active column set to 0. The data stays available for old reports and for recovery.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S5, 'create-table-data-types-constraints', 'CREATE TABLE, Data Types and Constraints', 'SQL CREATE TABLE and Constraints',
    'Design your own tables: data types, PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, CHECK and FOREIGN KEY, plus ALTER TABLE and DROP TABLE.', [
    P("You can now read the setup script from lesson 2 line by line. In this lesson you learn how to create tables yourself, with rules that stop bad data from entering. Good tables make later queries simple. Bad tables, with no rules, fill up with blanks, duplicates and nonsense that someone must clean up later."),
    H("CREATE TABLE"),
    C('sql', `CREATE TABLE reviews (
  id          INTEGER PRIMARY KEY,
  product_id  INTEGER NOT NULL,
  reviewer    TEXT    NOT NULL,
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_on  DATE    DEFAULT CURRENT_DATE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);`),
    P("Each line inside the brackets is a column, written as a name, a data type, then any rules. Table-level rules such as `FOREIGN KEY` come after the columns. Columns are separated by commas, and there is no comma after the last line."),
    H("Data types"),
    P("A data type says what kind of value a column holds. The names change a little between engines, but the ideas are the same."),
    L("**Whole numbers**: `INTEGER` (also `INT`, `BIGINT`). Use for ids, counts and quantities.", "**Decimal numbers**: `DECIMAL(10,2)` or `NUMERIC` in most engines. Use for money, because it does not round oddly. `REAL` or `FLOAT` are approximate and not good for money.", "**Text**: `TEXT`, or `VARCHAR(100)` with a length limit in MySQL, PostgreSQL and SQL Server.", "**Dates and times**: `DATE`, `TIME`, `TIMESTAMP` or `DATETIME`. SQLite has no special date type, and stores dates as text like `2024-06-02`, which is why the format matters.", "**True or false**: `BOOLEAN` in PostgreSQL, `TINYINT(1)` in MySQL, and 0 or 1 in SQLite."),
    P("The shop uses a whole number for price to keep examples easy. A real shop with paise, cents or pence would store `DECIMAL(10,2)`, or store the smallest unit as an integer, for example 12050 for 120.50."),
    H("Constraints: rules for the data"),
    P("A **constraint** is a rule the database checks every time you insert or update a row. If the rule is broken, the statement fails and nothing is stored. Here are the five you will use all the time."),
    L("`PRIMARY KEY`: unique and never empty. Identifies the row.", "`NOT NULL`: the column must have a value.", "`UNIQUE`: no two rows may have the same value in this column, such as an email address.", "`DEFAULT x`: the value to use when none is given, such as `'active'` or today's date.", "`CHECK (rule)`: any condition the value must satisfy, such as `age >= 18`."),
    P("See them work on a small test table."),
    C('sql', `CREATE TABLE members (
  id     INTEGER PRIMARY KEY,
  email  TEXT NOT NULL UNIQUE,
  age    INTEGER CHECK (age >= 18),
  status TEXT DEFAULT 'active'
);

INSERT INTO members (email, age) VALUES ('a@example.com', 20);
SELECT * FROM members;`),
    C('text', `id | email         | age | status
1  | a@example.com | 20  | active`),
    P("The status was not given, so the default `active` was used. Now try three bad inserts:"),
    C('sql', `INSERT INTO members (email, age) VALUES ('a@example.com', 30);
-- UNIQUE constraint failed: members.email

INSERT INTO members (email, age) VALUES (NULL, 30);
-- NOT NULL constraint failed: members.email

INSERT INTO members (email, age) VALUES ('b@example.com', 10);
-- CHECK constraint failed: age >= 18`),
    P("Each message names the rule that was broken. This is the database protecting its own data, so that you do not have to rely on every program and every person to remember the rules."),
    H("Foreign keys and what they allow"),
    P("The `FOREIGN KEY (product_id) REFERENCES products(id)` in the first example says that every review must point to a real product. You can add actions for what happens when the parent row is deleted:"),
    C('sql', `FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`),
    P("With `CASCADE`, deleting a product also deletes its reviews. With the default, the delete is refused while reviews exist. Choose on purpose, and think about what you would want if a person deleted by mistake."),
    H("ALTER TABLE: change a table later"),
    C('sql', `ALTER TABLE customers ADD COLUMN phone TEXT;
ALTER TABLE customers RENAME COLUMN phone TO mobile;`),
    P("Adding a column to a table with data is easy; existing rows get NULL, or the default. Changing or dropping columns is more limited in SQLite than in other engines. In a live company database, ask before altering a table. A change on a big table can lock it for a while, and other programs may depend on the old shape."),
    H("DROP TABLE: remove a table completely"),
    C('sql', `DROP TABLE IF EXISTS members;`),
    P("`DROP TABLE` deletes the table and all its rows, and there is no undo outside a transaction or a backup. `IF EXISTS` avoids an error when the table is not there. Make a habit of reading the table name twice."),
    H("A simple design checklist"),
    O("One table for each kind of thing. Name it clearly.", "Give it a primary key.", "Mark columns `NOT NULL` when a value is truly always needed.", "Add `UNIQUE` for values that must not repeat, such as email or a product code.", "Add foreign keys for links to other tables.", "Choose data types that fit: numbers as numbers, dates as dates, money as decimals or whole smallest units."),
    N("Privacy note: store only what you need. Personal data such as phone numbers, addresses and ID numbers has legal duties attached in many countries, and should be protected and kept only as long as needed."),
    ...task("Create a table called `suppliers` with an `id` primary key, a required `name`, a unique `email` and a `country` that defaults to `'India'`.", "Add a column `supplier_id` to `products` with `ALTER TABLE` and give it a value for one product.", "Try to break each rule on `suppliers` (a duplicate email, a missing name) and read the messages.", "Drop the `suppliers` table when you finish."),
    ...check("The country column shows `India` when you insert a supplier without one.", "The duplicate email insert fails with a UNIQUE error.", "After the drop, `SELECT * FROM suppliers;` says there is no such table."),
  ], A('Rules stop bad data', [
    n('ins', 'INSERT', 'a new row', 0, 0, 'user'), n('rules', 'Constraints', 'NOT NULL, UNIQUE, CHECK', 1, 0, 'check'),
    n('tbl', 'Table', 'good rows only', 2, 0, 'store'), n('err', 'Error', 'the row is refused', 2, 1, 'data'),
  ], [
    { say: 'A program or person tries to insert a row into the table.', on: ['ins'] },
    { say: 'Before storing it, the database checks every rule you declared on the table.', flow: ['ins>rules:check'] },
    { say: 'If all rules pass, the row is saved.', flow: ['rules>tbl:passes'] },
    { say: 'If one rule fails, the statement is refused with a message that names the rule, and nothing is stored.', flow: ['rules>err:fails'] },
  ]), [
    faq('Should I store money as DECIMAL or FLOAT?', 'Use DECIMAL or NUMERIC, or whole smallest units such as paise or cents. FLOAT is approximate and can give tiny rounding errors.'),
    faq('What does UNIQUE do?', 'UNIQUE stops two rows having the same value in a column, such as an email address. The database refuses the second insert.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S6, 'window-functions-row-number-rank', 'Window Functions: ROW_NUMBER, RANK and Running Totals', 'SQL Window Functions for Beginners',
    'Rank rows, find the latest row per customer and calculate running totals with window functions, without collapsing rows like GROUP BY does.', [
    P("`GROUP BY` is powerful, but it has a cost: it collapses many rows into one. Sometimes you want a calculation over a group of rows and still keep every row. For example: show every product with its rank inside its category. Or show every order with a running total. **Window functions** do this, and they are a favourite topic in analyst interviews."),
    N("Window functions work in PostgreSQL, MySQL 8 and later, SQL Server, Oracle and SQLite 3.25 and later. Very old MySQL (5.x) does not have them."),
    H("The shape: OVER"),
    P("A window function is any function followed by `OVER (...)`. The brackets say which rows to look at (`PARTITION BY`) and in what order (`ORDER BY`). The rows are not collapsed, so each row keeps its own line, and the function adds one extra column."),
    C('text', `function() OVER (PARTITION BY group_column ORDER BY sort_column)`),
    P("`PARTITION BY` is like `GROUP BY` for the window: the calculation restarts for each group. If you leave it out, the whole result is one group."),
    H("ROW_NUMBER: number the rows"),
    P("Number every customer's orders by date, starting at 1 for each customer."),
    C('sql', `SELECT id, customer_id, order_date,
  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS nth
FROM orders
ORDER BY customer_id, order_date;`),
    C('text', `id | customer_id | order_date | nth
1  | 1           | 2024-06-02 | 1
2  | 1           | 2024-06-20 | 2
9  | 1           | 2024-08-02 | 3
3  | 2           | 2024-06-21 | 1
7  | 2           | 2024-07-15 | 2
4  | 3           | 2024-07-01 | 1
...`),
    P("Customer 1 has orders numbered 1, 2, 3 and customer 2 starts again at 1. Every order is still there, which is the difference from `GROUP BY`."),
    H("The latest row for each customer"),
    P("A very common request is “the most recent order for each customer”. Number the rows from newest to oldest, then keep number 1. Because you cannot filter on a window function in the same `WHERE`, put the numbering in a subquery or CTE first."),
    C('sql', `SELECT customer_id, id, order_date
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders
)
WHERE rn = 1
ORDER BY customer_id;`),
    C('text', `customer_id | id | order_date
1           | 9  | 2024-08-02
2           | 7  | 2024-07-15
3           | 4  | 2024-07-01
4           | 5  | 2024-07-04
5           | 6  | 2024-07-09
6           | 8  | 2024-07-18
7           | 10 | 2024-08-05`),
    P("This “latest per group” pattern, also written “top 1 per group”, is one of the most useful patterns in SQL. Change `rn = 1` to `rn <= 3` to get the top three per group."),
    H("RANK and DENSE_RANK"),
    P("`RANK` gives the same number to ties, then skips. `DENSE_RANK` gives the same number to ties and does not skip. Compare them with an example where two prices tie (the shop data has no ties, so here are the idea and the shape)."),
    C('text', `price | ROW_NUMBER | RANK | DENSE_RANK
900   | 1          | 1    | 1
800   | 2          | 2    | 2
800   | 3          | 2    | 2
700   | 4          | 4    | 3`),
    P("`ROW_NUMBER` never repeats. `RANK` repeats for ties, then jumps (1, 2, 2, 4). `DENSE_RANK` repeats for ties and carries on without a gap (1, 2, 2, 3). Pick the one that matches the question you were asked: “top 3 products” with ties is a question you should clarify first."),
    P("Here is `RANK` in the shop data. It ranks products by price inside each category."),
    C('sql', `SELECT name, category, price,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rnk
FROM products
ORDER BY category, rnk;`),
    C('text', `name         | category   | price | rnk
Backpack     | Bags       | 1400  | 1
Desk lamp    | Home       | 650   | 1
Water bottle | Home       | 300   | 2
Laptop stand | Office     | 1800  | 1
Mouse        | Office     | 700   | 2
Notebook     | Stationery | 120   | 1
Pen pack     | Stationery | 80    | 2
Sticky notes | Stationery | 60    | 3`),
    P("Keep only `rnk = 1` and you have the dearest product in each category, using the same subquery pattern as before."),
    H("Running totals with SUM OVER"),
    P("Any aggregate can be a window function. With `ORDER BY` inside `OVER`, `SUM` becomes a running total, adding each row to the ones before it. Here a small example with the order ids, to keep the numbers easy to check by eye."),
    C('sql', `SELECT order_date, id,
  SUM(id) OVER (ORDER BY order_date, id) AS running
FROM orders
WHERE id <= 4;`),
    C('text', `order_date | id | running
2024-06-02 | 1  | 1
2024-06-20 | 2  | 3
2024-06-21 | 3  | 6
2024-07-01 | 4  | 10`),
    P("A real report would use order value instead of id, for a running sales total by day. With no `ORDER BY` inside `OVER`, the function covers the whole group, so `COUNT(*) OVER ()` puts the same total on every row. That is useful for percentages: each row's value divided by the total, without a separate query."),
    H("LAG and LEAD: look at the previous or next row"),
    C('sql', `SELECT name, price,
  LAG(price) OVER (ORDER BY id) AS previous_price
FROM products
LIMIT 3;`),
    C('text', `name      | price | previous_price
Notebook  | 120   | NULL
Pen pack  | 80    | 120
Desk lamp | 650   | 80`),
    P("`LAG` reads a value from the row before; `LEAD` from the row after. They are used for “change compared with last month”, and the first row has NULL because nothing comes before it."),
    H("Window functions versus GROUP BY"),
    L("`GROUP BY` returns one row for each group. Detail rows disappear.", "A window function keeps every row and adds a calculated column.", "Use `GROUP BY` for summaries. Use window functions for ranks, running totals, comparisons with the previous row and “top N per group”."),
    H("Common mistakes"),
    L("Trying to filter on a window function in `WHERE`. Wrap it in a subquery or CTE and filter outside.", "Forgetting the `ORDER BY` inside `OVER` for `ROW_NUMBER`, `RANK` and running totals, which makes the numbering meaningless.", "Using `ROW_NUMBER` when ties matter. Decide whether ties share a rank."),
    ...task("Show every product with its position by price across all products (1 is the dearest), using `RANK() OVER (ORDER BY price DESC)`.", "For each customer, show only their first order using `ROW_NUMBER` and a subquery. Customer 1's first order is 1.", "Write the query that shows the cheapest product in each category.", "Show each order with the count of all orders on the same row using `COUNT(*) OVER ()`."),
    ...check("The dearest product has rank 1 (Laptop stand) and the cheapest has rank 8.", "The first-order query returns 7 rows, one for each customer who has ordered.", "Every row in the last query shows 10."),
  ], A('Window functions keep every row', [
    n('rows', 'All rows', 'orders table', 0, 0, 'store'), n('part', 'PARTITION BY', 'a window per customer', 1, 0, 'tool'),
    n('ord', 'ORDER BY', 'sort inside window', 2, 0, 'check'), n('res', 'Rows + new column', 'nth, rank, total', 3, 0, 'out'),
  ], [
    { say: 'You start with all the rows, and a window function will not remove any of them.', on: ['rows'] },
    { say: 'PARTITION BY splits the rows into windows, for example one per customer.', flow: ['rows>part:split'] },
    { say: 'ORDER BY puts the rows inside each window in order, such as oldest to newest.', flow: ['part>ord:sort'] },
    { say: 'The function adds a new column to every row, such as number 1, 2, 3 or a running total.', flow: ['ord>res:new column'] },
  ]), [
    faq('What is the difference between RANK and DENSE_RANK?', 'Both give tied rows the same rank. RANK then skips numbers (1, 2, 2, 4), while DENSE_RANK does not skip (1, 2, 2, 3).'),
    faq('How do I get the latest row per group?', 'Use ROW_NUMBER() OVER (PARTITION BY group ORDER BY date DESC) in a subquery or CTE, then keep rows where the number is 1.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S6, 'indexes-and-query-performance', 'Indexes and Faster Queries: EXPLAIN for Beginners', 'SQL Indexes and Query Performance',
    'Learn what an index is, how it speeds up WHERE and JOIN, how to read a query plan with EXPLAIN, and habits that keep queries fast.', [
    P("On a table with eight rows, every query is instant. On a table with ten million rows, the same query can take minutes if it is written or indexed badly. You do not need to be a database expert to write fast queries, but you should understand one idea: the index. This lesson explains it with a simple picture, and shows how to check whether a query uses one."),
    H("What is an index?"),
    P("Think about a textbook. If you want the page about “joins”, you can read every page from the start, or you can look in the index at the back, which lists topics in order with page numbers, and jump straight there. A database index is the same. It is a separate sorted structure that remembers where rows are, so the database can jump to the matching rows instead of reading the whole table."),
    P("Reading the whole table is called a **full table scan**. Using an index to jump is an **index search** or seek. On big tables, the difference can be a thousand times."),
    H("See the plan: EXPLAIN"),
    P("You can ask the database how it will run a query, without running it. In SQLite the command is `EXPLAIN QUERY PLAN`. PostgreSQL and MySQL use `EXPLAIN`, and SQL Server shows an execution plan in its tools."),
    C('sql', `EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 1;`),
    C('text', `SCAN orders`),
    P("`SCAN orders` means the database will look at every row of `orders` to find the ones for customer 1. With ten rows, who cares. With ten million, this is the problem."),
    H("Create an index"),
    C('sql', `CREATE INDEX idx_orders_customer_id ON orders (customer_id);

EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 1;`),
    C('text', `SEARCH orders USING INDEX idx_orders_customer_id (customer_id=?)`),
    P("Now the plan says `SEARCH ... USING INDEX`. The database jumps straight to the right rows. The words you see differ in other engines (PostgreSQL says “Index Scan” or “Seq Scan”, MySQL shows `type: ref` or `ALL`), but the idea is the same: look for the words that mean “whole table” and the words that mean “used an index”."),
    H("What to index"),
    L("**Columns in `WHERE`** that you filter on often, especially on big tables.", "**Foreign key columns** you join on, such as `orders.customer_id` and `order_items.order_id`. Joins on unindexed columns are a classic cause of slow reports. Primary keys are indexed automatically. Some engines, such as PostgreSQL, do not index foreign keys for you.", "**Columns in `ORDER BY`** for big sorted lists.", "A **unique index** (`CREATE UNIQUE INDEX`) also enforces that values do not repeat. A `UNIQUE` constraint creates one."),
    P("You can index several columns together, for example `(customer_id, order_date)`. Order matters: it helps queries that filter on `customer_id`, or on both, but not on `order_date` alone."),
    H("Indexes are not free"),
    P("Every index takes disk space, and every `INSERT`, `UPDATE` and `DELETE` must also update it. Too many indexes slow writes down. So you do not index every column. You index the ones your real queries use on large tables. On small tables, an index can even be slower than a scan, and the database may ignore it."),
    H("Habits that stop an index being used"),
    L("**A function on the column**: `WHERE UPPER(name) = 'ASHA'` or `WHERE SUBSTR(order_date, 1, 7) = '2024-06'` cannot use a normal index on that column, because the database would need to compute the function for every row. Rewrite as a range: `order_date >= '2024-06-01' AND order_date < '2024-07-01'`.", "**A leading wildcard**: `LIKE '%son'` cannot use an ordinary index. `LIKE 'Ash%'` can.", "**A type mismatch**: comparing a number column with text can stop the index from working in some engines.", "**`SELECT *` on wide tables** moves more data than you need. Name the columns.", "**No limit** when you only need a few rows. Add `LIMIT`."),
    H("Other habits for faster queries"),
    L("Filter early: put selective `WHERE` conditions in so that fewer rows enter the joins.", "Join on keys, which are usually indexed.", "Avoid running the same query in a loop from a program for each row, which is a very common cause of slow pages. Ask for all the rows in one query with a join or `IN`.", "Do not guess. Test with `EXPLAIN` and measure with real data volumes. A query tested on ten rows tells you nothing about ten million."),
    H("When a report is still slow"),
    P("In a real job you will sometimes hit a slow query, even with indexes. Do not panic. Check the plan, check whether the columns used for joins and filters have indexes, check whether you are returning more rows or columns than needed, and ask a more experienced colleague or the database administrator. Do not add indexes to a live production database without agreement, since it can affect everyone using it."),
    N("A good sentence for an interview: “I would look at the query plan, check for full scans on large tables, and see whether the filter and join columns are indexed, while remembering that indexes slow down writes.”"),
    ...task("Run `EXPLAIN QUERY PLAN` on `SELECT * FROM order_items WHERE order_id = 5;` and note the plan.", "Create an index on `order_items (order_id)` and run it again. What changed in the words?", "Rewrite `WHERE SUBSTR(order_date, 1, 7) = '2024-07'` so it can use an index on `order_date`.", "Drop your index with `DROP INDEX idx_name;` and explain one downside of having too many indexes."),
    ...check("Before the index the plan says `SCAN order_items`; after it says `SEARCH ... USING INDEX`.", "The date rewrite uses a range: `order_date >= '2024-07-01' AND order_date < '2024-08-01'`.", "You can explain that indexes use space and slow writes."),
  ], A('Scan every row, or jump with an index', [
    n('q', 'Query', 'WHERE customer_id = 1', 0, 0, 'user'), n('scan', 'Full scan', 'read every row', 1, 0, 'data'),
    n('idx', 'Index', 'sorted lookup', 1, 1, 'tool'), n('tbl', 'orders table', 'millions of rows', 2, 0, 'store'), n('res', 'Matching rows', '', 3, 0, 'out'),
  ], [
    { say: 'A query asks for the orders of one customer.', on: ['q'] },
    { say: 'With no index, the database must read every row of the table to find them.', flow: ['q>scan:no index', 'scan>tbl:every row'] },
    { say: 'With an index on customer_id, the database looks in a small sorted list first.', flow: ['q>idx:use index'] },
    { say: 'The index points straight to the matching rows, so most of the table is never read.', flow: ['idx>tbl:jump to rows'] },
    { say: 'Both ways give the same rows, but the index is much faster on big tables.', flow: ['tbl>res:rows'] },
  ]), [
    faq('Should I add an index to every column?', 'No. Indexes take space and slow down inserts, updates and deletes. Index the columns your real queries filter, join and sort on, mainly on large tables.'),
    faq('Why is my WHERE not using the index?', 'A function on the column, a leading wildcard in LIKE, or a type mismatch can stop an index being used. Rewrite the condition and check the plan with EXPLAIN.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S6, 'sql-interview-questions-and-next-steps', 'SQL Interview Questions and What to Learn Next', 'SQL Interview Questions for Freshers',
    'Practise the SQL questions that interviewers ask most often, with answers and short explanations, and plan what to learn next after this course.', [
    P("You have now covered the core of SQL: reading data, summarising it, joining tables, changing data, designing tables and speeding up queries. This last lesson turns that knowledge into interview practice. The questions below are the types that commonly appear in fresher and junior analyst, developer and tester interviews. Interviewers differ, so use these as practice and do not expect an exact match. Answer the SQL ones on the shop database."),
    H("Concept questions, with short answers"),
    P("**What is the difference between WHERE and HAVING?** `WHERE` filters rows before grouping and cannot use aggregates. `HAVING` filters groups after grouping and is used with aggregates like `COUNT(*)`."),
    P("**What is the difference between INNER JOIN and LEFT JOIN?** An inner join returns only rows that match in both tables. A left join returns all rows from the left table, with NULLs on the right when nothing matches."),
    P("**What is a primary key? A foreign key?** A primary key uniquely identifies a row and cannot be NULL. A foreign key is a column that references the primary key of another table and keeps the data linked and consistent."),
    P("**What is the difference between DELETE, TRUNCATE and DROP?** `DELETE` removes chosen rows (with `WHERE`) and can be rolled back in a transaction. `TRUNCATE` removes all rows quickly, and `DROP` removes the whole table, including its structure."),
    P("**What is NULL, and how do you test for it?** NULL means a missing or unknown value. It is not zero and not empty text. Use `IS NULL` and `IS NOT NULL`, because `= NULL` never matches."),
    P("**What is the difference between UNION and UNION ALL?** Both stack the results of two queries with the same columns. `UNION` removes duplicate rows, which costs time. `UNION ALL` keeps everything and is faster."),
    P("**What is an index and what is the downside?** A sorted structure that speeds up lookups. It uses space and slows down writes."),
    P("**What is normalisation?** Organising data so each fact is stored once, by splitting it into related tables, to avoid repeated data and inconsistencies."),
    H("Query questions on the shop database"),
    P("Try each one yourself before reading the answer. Write it, run it and check the output."),
    P("**1. Find the second most expensive product.**"),
    C('sql', `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 1 OFFSET 1;`),
    C('text', `Backpack | 1400`),
    P("`OFFSET 1` skips the dearest product. A good follow-up answer: with ties you may prefer `DENSE_RANK`, so mention it."),
    P("**2. Find customers who have never placed an order.**"),
    C('sql', `SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL;`),
    C('text', `Hari Singh`),
    P("**3. Find the most expensive product in each category.**"),
    C('sql', `SELECT p.category, p.name, p.price
FROM products AS p
WHERE p.price = (
  SELECT MAX(p2.price) FROM products AS p2 WHERE p2.category = p.category
)
ORDER BY p.category;`),
    C('text', `Bags       | Backpack     | 1400
Home       | Desk lamp    | 650
Office     | Laptop stand | 1800
Stationery | Notebook     | 120`),
    P("The same answer can be given with `RANK()` or `ROW_NUMBER()`. Interviewers like to hear that you know two ways."),
    P("**4. Find customers with more than one order.**"),
    C('sql', `SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1
ORDER BY customer_id;`),
    C('text', `1 | 3
2 | 2`),
    P("**5. What percentage of the total price does each of the top 3 products represent?**"),
    C('sql', `SELECT name, price,
  ROUND(price * 100.0 / (SELECT SUM(price) FROM products), 1) AS pct
FROM products
ORDER BY price DESC
LIMIT 3;`),
    C('text', `Laptop stand | 1800 | 35.2
Backpack     | 1400 | 27.4
Mouse        | 700  | 13.7`),
    P("Note the `100.0`. Using `100` with whole numbers could give a rounded-down whole number result in some engines."),
    P("**6. Show the value of each order.** This needs three tables."),
    C('sql', `SELECT o.id, SUM(p.price * oi.quantity) AS total
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.id
JOIN products AS p ON p.id = oi.product_id
GROUP BY o.id
ORDER BY o.id;`),
    C('text', `1 | 520    6 | 700
2 | 1400   7 | 840
3 | 2500   8 | 650
4 | 1300   9 | 2100
5 | 1200  10 | 320`),
    P("**7. Find the latest order for each customer.** Use `ROW_NUMBER()` with `PARTITION BY customer_id ORDER BY order_date DESC` and keep `rn = 1`, as in lesson 13."),
    H("How to answer in an interview"),
    O("**Repeat the question** in your own words and ask about unclear parts: What counts as an active customer? What should happen with ties? Are NULLs possible?", "**Say your plan** before typing: “I will join orders to customers, group by customer and count.”", "**Start simple**, run it, then add conditions. Build the query in small steps and check each step.", "**Check your result** against what you expect. Count a few rows by hand.", "**Mention the edge cases** you thought about, such as NULLs, ties and customers with no orders.", "**If you do not know, say so** and explain how you would find out. Honesty and clear thinking are valued more than memorised phrases."),
    H("What to learn next"),
    L("**Practise every week.** Rewrite the lesson tasks from memory, then invent your own questions about the shop.", "**Learn one real engine.** Install PostgreSQL or MySQL and run the setup script there. You will see the small differences, such as `LIMIT`, date functions and text joining.", "**Date and time functions** for reports: month, year, difference between dates.", "**Views and stored procedures** for saving queries and repeated logic.", "**Connect SQL to a language.** Python with pandas for analysis, or Node.js and Express for apps. This site's Node.js and Python courses are good next steps.", "**A BI tool** such as a free dashboard tool, if you are moving toward analyst work.", "**Build a small project**: a library, a gym or a clinic database with five tables, a setup script and ten reports. Put it on GitHub. It shows real skill better than a certificate."),
    P("SQL rewards practice more than reading. A reasonable plan is half an hour a day for a month. By then the structure of `SELECT`, `JOIN` and `GROUP BY` will feel natural. If you are preparing for interviews more broadly, our interview questions pages and resume tools can help you present this skill honestly: list what you have really built, with small examples, rather than a long list of keywords."),
    ...task("Answer all seven query questions above without looking, then compare with the answers.", "Write three new questions of your own about the shop data and answer them.", "Explain WHERE versus HAVING and INNER versus LEFT JOIN out loud, as if to an interviewer."),
    ...check("Your answers match the outputs shown.", "You can explain each answer in one or two sentences.", "You have a plan for what to practise next week."),
  ], A('From practice to confidence', [
    n('learn', 'Learn the parts', 'SELECT, JOIN, GROUP BY', 0, 0, 'app'), n('prac', 'Practise often', 'small daily tasks', 1, 0, 'user'),
    n('proj', 'Small project', 'your own database', 2, 0, 'tool'), n('int', 'Interview ready', 'explain your thinking', 3, 0, 'out'),
  ], [
    { say: 'You have learned the core parts of SQL: reading, joining, grouping and changing data.', on: ['learn'] },
    { say: 'Daily practice on a small database turns each part into a habit.', flow: ['learn>prac:practise'] },
    { say: 'A small project of your own, such as a library database, proves the skill.', flow: ['prac>proj:build'] },
    { say: 'In an interview, you repeat the question, plan, build in small steps and check your answer.', flow: ['proj>int:explain'] },
  ]), [
    faq('How long does it take to learn SQL?', 'Many beginners can write useful queries in a few weeks of regular practice. Becoming comfortable with joins, grouping and window functions takes longer and comes from practice on real questions.'),
    faq('Which SQL database should I learn first?', 'Start with the SQL itself on SQLite, as in this course. Then try PostgreSQL or MySQL, because most jobs use one of them, and learn their small differences.'),
  ]),
];
