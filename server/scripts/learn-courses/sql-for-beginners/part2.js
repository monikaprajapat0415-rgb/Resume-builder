import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S3 = 'Summaries and Groups';
const S4 = 'Several Tables';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S3, 'aggregate-functions-count-sum-avg', 'Aggregate Functions: COUNT, SUM, AVG, MIN, MAX', 'SQL COUNT, SUM, AVG, MIN and MAX',
    'Turn many rows into one answer with COUNT, SUM, AVG, MIN and MAX. Learn how NULL changes the result and what COUNT(*) really counts.', [
    P("So far every query returned one result row for each matching row in the table. Business questions are often different. How many orders do we have? What is the total quantity sold? What is the average price? These questions squeeze many rows into one answer. SQL does this with **aggregate functions**."),
    H("COUNT: how many rows?"),
    C('sql', `SELECT COUNT(*) AS customers FROM customers;`),
    C('text', `customers
8`),
    P("`COUNT(*)` counts rows. You can add a `WHERE` to count only some of them. The `WHERE` runs first, and the count is done on the rows that remain."),
    C('sql', `SELECT COUNT(*) AS delivered_orders
FROM orders
WHERE status = 'delivered';`),
    C('text', `delivered_orders
6`),
    H("SUM, AVG, MIN and MAX"),
    P("These four work on a number column."),
    C('sql', `SELECT
  COUNT(*)   AS products,
  SUM(price) AS total,
  AVG(price) AS average,
  MIN(price) AS cheapest,
  MAX(price) AS dearest
FROM products;`),
    C('text', `products | total | average | cheapest | dearest
8        | 5110  | 638.75  | 60       | 1800`),
    L("`SUM(x)` adds up all the values.", "`AVG(x)` is the sum divided by the number of values. Use `ROUND(AVG(x), 2)` for a tidy number.", "`MIN(x)` and `MAX(x)` give the smallest and largest. They also work on text (alphabetical order) and dates (earliest and latest)."),
    P("Because there is a single row of output, all five answers appear together. You can mix several aggregates in one query, as above. What you cannot do yet is mix an aggregate with a normal column, such as `SELECT name, MAX(price)`. The database would not know which name to show with the average. The next lesson shows how `GROUP BY` solves this."),
    H("How NULL behaves"),
    P("Aggregate functions skip NULL values. This surprises many people and is a favourite interview question. Look at the customers table, where Hari has no city."),
    C('sql', `SELECT
  COUNT(*)             AS all_rows,
  COUNT(city)          AS with_city,
  COUNT(DISTINCT city) AS different_cities
FROM customers;`),
    C('text', `all_rows | with_city | different_cities
8        | 7         | 6`),
    P("`COUNT(*)` counts every row, so it is 8. `COUNT(city)` counts only the rows where `city` is not NULL, so it is 7. `COUNT(DISTINCT city)` counts different values: Nairobi appears twice, so seven cities give six different ones. The rule: `COUNT(*)` counts rows, and `COUNT(column)` counts non-NULL values in that column."),
    P("The same skipping applies to `AVG`, `SUM`, `MIN` and `MAX`. The average of three values 10, 20 and NULL is 15, not 10, because the NULL is ignored and the divide is by 2. If you want NULL treated as zero, say so with `AVG(COALESCE(x, 0))`."),
    N("If no rows match, `COUNT` returns 0, but `SUM`, `AVG`, `MIN` and `MAX` return NULL. For example `SELECT AVG(price) FROM products WHERE category = 'Nothing'` gives NULL. Use `COALESCE(SUM(x), 0)` when you want a zero."),
    H("Calculations inside an aggregate"),
    P("You can put a calculation inside the brackets. To find the total number of items ever ordered, add the quantity column. To find money, multiply price by quantity for each row first. The money needs the `products` table, which you will join in lesson 9. For now, one table at a time:"),
    C('sql', `SELECT SUM(quantity) AS items_sold FROM order_items;`),
    C('text', `items_sold
37`),
    H("Counting with a condition"),
    P("A powerful trick is to put a `CASE` inside an aggregate. This lets you count different groups in a single pass, in one row, like a small summary table."),
    C('sql', `SELECT
  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
  SUM(CASE WHEN status = 'shipped'   THEN 1 ELSE 0 END) AS shipped,
  SUM(CASE WHEN status NOT IN ('delivered', 'shipped') THEN 1 ELSE 0 END) AS other
FROM orders;`),
    C('text', `delivered | shipped | other
6         | 2       | 2`),
    P("Each order adds 1 to one of the three columns and 0 to the others. This pattern, sometimes called a conditional count or pivot, is used constantly in reports."),
    H("Which date is the latest?"),
    P("`MIN` and `MAX` work on dates stored as `YYYY-MM-DD`. The first and last order are easy to find."),
    C('sql', `SELECT MIN(order_date) AS first_order, MAX(order_date) AS last_order FROM orders;`),
    C('text', `first_order | last_order
2024-06-02  | 2024-08-05`),
    H("Common mistakes"),
    L("Putting an aggregate in `WHERE`, such as `WHERE COUNT(*) > 2`. `WHERE` filters rows before counting. Use `HAVING` for conditions on aggregates (next lesson).", "Mixing an aggregate and a plain column without `GROUP BY`.", "Forgetting that `COUNT(column)` skips NULL while `COUNT(*)` does not.", "Dividing two whole numbers in some engines and getting a whole number back. In SQLite and SQL Server, `7 / 2` is `3`. Write `7 / 2.0` or use `CAST` to get 3.5."),
    ...task("Count how many products there are in total, and how many cost more than 500.", "Find the cheapest and the most expensive product price in the Stationery category.", "Count how many different customers have placed an order (use `COUNT(DISTINCT customer_id)` on `orders`). The answer is 7.", "Find the average price rounded to one decimal place."),
    ...check("There are 8 products and 4 cost more than 500.", "The Stationery prices run from 60 to 120.", "The rounded average price is 638.8."),
  ], A('Many rows become one answer', [
    n('rows', 'Many rows', '8 product rows', 0, 0, 'store'), n('fn', 'Aggregate', 'COUNT, SUM, AVG', 1, 0, 'tool'),
    n('skip', 'NULLs skipped', 'COUNT(city) = 7', 1, 1, 'check'), n('one', 'One row', '5110, 638.75', 2, 0, 'out'),
  ], [
    { say: 'You start with many rows, such as the eight rows in the products table.', on: ['rows'] },
    { say: 'An aggregate function reads all the rows and works out one summary value.', flow: ['rows>fn:every row'] },
    { say: 'Missing values (NULL) are skipped, which is why COUNT(city) can be smaller than COUNT(*).', flow: ['rows>skip:NULL rows'] },
    { say: 'The answer is a single row, such as the total 5110 or the average 638.75.', flow: ['fn>one:one result'] },
  ]), [
    faq('What is the difference between COUNT(*) and COUNT(column)?', 'COUNT(*) counts all rows. COUNT(column) counts only the rows where that column is not NULL.'),
    faq('Why does my average ignore some rows?', 'AVG skips NULL values. If you want them counted as zero, use AVG(COALESCE(column, 0)).'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S3, 'group-by-and-having', 'GROUP BY and HAVING: Summaries for Each Group', 'SQL GROUP BY and HAVING Explained',
    'Get one summary row for each category, city or customer with GROUP BY, filter groups with HAVING, and understand WHERE versus HAVING.', [
    P("An aggregate on the whole table gives one number. Most real questions want one number for each group: orders per customer, sales per month, products per category. `GROUP BY` does this. It splits the rows into groups and runs the aggregate on each group separately. Learning `GROUP BY` is a big step. It is the tool behind most reports."),
    H("Your first GROUP BY"),
    P("How many products are in each category?"),
    C('sql', `SELECT category, COUNT(*) AS products
FROM products
GROUP BY category
ORDER BY category;`),
    C('text', `category   | products
Bags       | 1
Home       | 2
Office     | 2
Stationery | 3`),
    P("The database puts all products with the same category together. It counts each pile and shows one row for each. The column after `SELECT` that is not inside an aggregate, here `category`, must also appear in `GROUP BY`. That is the main rule."),
    H("Several aggregates per group"),
    C('sql', `SELECT
  category,
  COUNT(*)   AS products,
  MIN(price) AS cheapest,
  MAX(price) AS dearest
FROM products
GROUP BY category
ORDER BY category;`),
    C('text', `category   | products | cheapest | dearest
Bags       | 1        | 1400     | 1400
Home       | 2        | 300      | 650
Office     | 2        | 700      | 1800
Stationery | 3        | 60       | 120`),
    P("You can add as many aggregates as you like. Each of them is worked out inside every group."),
    H("Group by more than one column"),
    P("List several columns, separated by commas, to make groups from each combination. For example, the number of orders for every customer in each status:"),
    C('sql', `SELECT customer_id, status, COUNT(*) AS orders
FROM orders
GROUP BY customer_id, status
ORDER BY customer_id, status;`),
    P("Each different pair of customer and status becomes its own group. Customer 1 has two delivered orders and one shipped order, so customer 1 gives two rows."),
    H("Groups made from NULL"),
    P("All NULL values are put in one group together. Look at orders per city for customers."),
    C('sql', `SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY customers DESC, city;`),
    C('text', `city      | customers
Nairobi   | 2
NULL      | 1
Bengaluru | 1
Chennai   | 1
Lagos     | 1
London    | 1
Toronto   | 1`),
    P("Nairobi has two customers. The row with NULL is Hari, who has no city. If you do not want that row, add `WHERE city IS NOT NULL` before the `GROUP BY`."),
    H("HAVING: filter the groups"),
    P("Suppose you only want categories with at least two products. You might try `WHERE COUNT(*) >= 2`, but that fails. `WHERE` works on single rows before any groups exist. To filter groups after counting, use `HAVING`."),
    C('sql', `SELECT category, COUNT(*) AS products
FROM products
GROUP BY category
HAVING COUNT(*) >= 2;`),
    C('text', `category   | products
Home       | 2
Office     | 2
Stationery | 3`),
    P("Bags has only one product, so its group is removed."),
    H("WHERE versus HAVING"),
    P("This is one of the most common SQL interview questions, so learn it well."),
    L("`WHERE` filters **rows** before grouping. It cannot use aggregates.", "`HAVING` filters **groups** after grouping. It is where you use aggregates like `COUNT(*)` or `SUM(x)`.", "You can use both in one query. Use `WHERE` first to throw away rows you do not need, because that is faster, then `HAVING` for the group test."),
    P("Here both are used together. Count each customer's orders that were not cancelled, and keep only customers with two or more."),
    C('sql', `SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE status <> 'cancelled'
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY customer_id;`),
    C('text', `customer_id | orders
1           | 3
2           | 2`),
    H("The full order of a query"),
    P("Now that you know most parts, here is the full written order, which is also the order you must write them in. The database works in a different logical order, shown on the right."),
    C('text', `Write it like this     The database thinks like this
SELECT                 5. choose columns
FROM                   1. find the table
WHERE                  2. keep rows
GROUP BY               3. make groups
HAVING                 4. keep groups
ORDER BY               6. sort
LIMIT                  7. cut`),
    P("If you ever wonder why something does not work, check this order. For example, `WHERE` runs before `SELECT`, so a new alias from `SELECT` is not known inside `WHERE`. In many engines `ORDER BY` runs after `SELECT`, so it can use the alias."),
    H("Common mistakes"),
    L("A selected column that is not in `GROUP BY` and not inside an aggregate. Some engines such as SQLite and older MySQL allow it and pick an arbitrary row's value, which gives wrong answers quietly. PostgreSQL and SQL Server give an error. Treat it as an error.", "Using `WHERE` where `HAVING` is needed.", "Counting groups when you meant to count rows, or the reverse. Always ask: what is one row of the answer? Here it is one category, or one customer."),
    ...task("Count the customers in each city, leaving out customers with no city.", "Show the number of orders in each status, most common first.", "Show each order's id and the total quantity of items in it from `order_items`, and keep only orders with more than 6 items. Orders 5 and 7 should appear.", "Count orders per month with `SUBSTR(order_date, 1, 7)` as the month."),
    ...check("Nairobi has 2 customers and the others 1.", "Delivered is the most common status with 6 orders.", "The monthly counts are 3 (2024-06), 5 (2024-07) and 2 (2024-08)."),
  ], A('Rows become groups, groups become rows', [
    n('rows', 'All rows', 'products table', 0, 0, 'store'), n('grp', 'GROUP BY', 'category piles', 1, 0, 'tool'),
    n('agg', 'Aggregate', 'COUNT each pile', 2, 0, 'app'), n('hav', 'HAVING', 'keep some groups', 2, 1, 'check'), n('out', 'One row per group', '', 3, 0, 'out'),
  ], [
    { say: 'You begin with all rows, after any WHERE has removed unwanted ones.', on: ['rows'] },
    { say: 'GROUP BY puts rows with the same category into the same pile.', flow: ['rows>grp:make piles'] },
    { say: 'The aggregate, such as COUNT(*), is worked out for every pile separately.', flow: ['grp>agg:each pile'] },
    { say: 'HAVING can drop groups, for example piles with fewer than two products.', flow: ['agg>hav:test groups'] },
    { say: 'You get one result row for each group that is left.', flow: ['hav>out:groups kept'] },
  ]), [
    faq('What is the difference between WHERE and HAVING?', 'WHERE filters single rows before grouping. HAVING filters groups after the aggregate is calculated, so it can use COUNT, SUM and similar functions.'),
    faq('Why does my query say a column must appear in GROUP BY?', 'Every selected column must either be in the GROUP BY list or inside an aggregate function. Otherwise the database does not know which value to show for the group.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S4, 'primary-foreign-keys-table-design', 'Keys and Table Design: Why Data Is Split Into Tables', 'SQL Keys and Table Design for Beginners',
    'Understand primary keys, foreign keys and one-to-many relationships, and why good designs split data into several tables. Prepares you for JOIN.', [
    P("Before you learn `JOIN`, you need to understand why the data is in several tables at all. Beginners often ask: why not keep everything in one big table, like a spreadsheet? The answer is the heart of database design, and it explains the shape of every database you will meet at work."),
    H("The one-big-table problem"),
    P("Imagine a single sheet that records every order line with all the details copied in:"),
    C('text', `order | customer     | city      | product   | price | qty
1     | Asha Rao     | Bengaluru | Notebook  | 120   | 3
1     | Asha Rao     | Bengaluru | Pen pack  | 80    | 2
2     | Asha Rao     | Bengaluru | Backpack  | 1400  | 1
3     | Ben Carter   | London    | Laptop... | 1800  | 1`),
    P("Asha's name and city are written again on every row. This causes three problems that database people give names to."),
    L("**Waste and mistakes.** If Asha moves to Pune you must change every row she appears in. Miss one and the data now disagrees with itself.", "**Cannot add partial facts.** You cannot record a new product until someone orders it, or a new customer until she buys something, because every row needs an order.", "**Lost facts on delete.** If you delete the only order of a customer, you also lose the fact that she exists."),
    P("The cure is to store each fact once, in the table where it belongs. People call this process **normalisation**. You do not need the formal rules to design a good small database. One idea covers most of it: **one table for each kind of thing**."),
    H("One table for each kind of thing"),
    P("In the shop there are four kinds of things: customers, products, orders and order lines. Each gets a table. Facts about a customer, such as name and city, live in `customers` once. Facts about a product, such as its name and price, live in `products` once."),
    C('text', `customers: id, name, city, joined
products:  id, name, category, price
orders:    id, customer_id, order_date, status
order_items: id, order_id, product_id, quantity`),
    H("Primary key: every row has its own identity"),
    P("A **primary key** is a column, or a small group of columns, whose value is different on every row and is never NULL. Most tables use a column called `id`. In SQLite, `INTEGER PRIMARY KEY` makes the database fill the numbers for you. In MySQL the same idea is written `AUTO_INCREMENT`, in PostgreSQL `GENERATED ... AS IDENTITY` or `SERIAL`."),
    P("A good primary key is stable. Do not use a person's name or phone number, since these can change or repeat. A simple number that has no meaning outside the database is safest."),
    H("Foreign key: a link to another table"),
    P("A **foreign key** is a column that holds the primary key value of a row in another table. In `orders`, the column `customer_id` holds the `id` of a customer. It means: this order belongs to that customer."),
    C('text', `orders
id | customer_id | order_date | status
1  | 1           | 2024-06-02 | delivered     <- customer 1 is Asha Rao
2  | 1           | 2024-06-20 | delivered
3  | 2           | 2024-06-21 | delivered     <- customer 2 is Ben Carter`),
    P("When foreign keys are declared and the database enforces them, it will refuse to insert an order for a customer id that does not exist, and it will refuse to delete a customer that still has orders. In SQLite you must turn this on with `PRAGMA foreign_keys = ON;` for each connection. MySQL (InnoDB) and PostgreSQL enforce them by default. This protects you from **orphan rows**, orders that point to nobody."),
    H("Relationships: one-to-many and many-to-many"),
    P("A **one-to-many** relationship is the most common. One customer has many orders, but each order belongs to one customer. The foreign key goes on the “many” side: `orders.customer_id`."),
    P("A **many-to-many** relationship is where each side can have many of the other. An order can contain many products, and a product can be in many orders. A single column cannot hold that, so you add a third table in the middle, called a **junction table** (or bridge table). Here it is `order_items`. Each row says: this order has this product, this many times."),
    C('text', `orders  <--  order_items  -->  products
(one)        (many rows)         (one)

order_items: order_id -> orders.id
             product_id -> products.id
             quantity`),
    P("Reading it from the middle: each `order_items` row points to one order and one product. That is two foreign keys. This pattern appears in nearly every shop, booking, school and library system you will see."),
    H("How to read a database you have not seen before"),
    P("When you start a new job, you will often get a database with dozens of tables and no guide. These habits help."),
    O("List the tables and the columns of each (your tool has a schema view, or in SQLite type `.schema`).", "Find the primary key of each table, usually `id`.", "Find the columns that end with `_id`. They are probably foreign keys. Note which table each points to.", "Draw boxes and arrows on paper. One arrow from each foreign key to the table it references.", "Run `SELECT * FROM table LIMIT 5` on each table to see real examples."),
    P("Ten minutes of this gives you a map. Without it, joins become guesswork."),
    H("Naming habits that help"),
    L("Use one clear style. This course uses lower case with underscores: `order_items`, `customer_id`.", "Name foreign keys after what they point to: `customer_id` points to `customers.id`.", "Keep table names plural or singular, but be consistent. Many teams use plural.", "Avoid spaces and special characters in names. They force you to quote everything."),
    N("Design is a judgement. Splitting data into more tables saves space and mistakes, but each query needs more joins. For reports that read huge amounts of data, teams sometimes copy data on purpose (denormalise) to make reading faster. Learn the rules first, break them later with a reason."),
    ...task("Draw the four tables of the shop database as boxes. Write the primary key in each and draw an arrow for each of the three foreign keys.", "Run `SELECT * FROM orders WHERE customer_id = 1;` and write down which customer it is by looking in `customers`.", "Think of a library: books, members and loans. Decide which table holds the foreign keys, and say whether the relationship between members and books is one-to-many or many-to-many."),
    ...check("You found three foreign keys: `orders.customer_id`, `order_items.order_id` and `order_items.product_id`.", "You can explain why `order_items` exists: orders and products are many-to-many.", "For the library, loans is the junction table with a member id and a book id."),
  ], A('Tables linked by keys', [
    n('cust', 'customers', 'id (primary key)', 0, 0, 'store'), n('ord', 'orders', 'customer_id (foreign)', 1, 0, 'store'),
    n('items', 'order_items', 'order_id, product_id', 2, 0, 'store'), n('prod', 'products', 'id (primary key)', 3, 0, 'store'),
  ], [
    { say: 'Each customer is stored once in the customers table with its own id.', on: ['cust'] },
    { say: 'An order stores only the customer id, which points back to the customer.', flow: ['ord>cust:customer_id'] },
    { say: 'Order items connect an order to the things in it.', flow: ['items>ord:order_id'] },
    { say: 'Each item also points to a product, so a product is stored once and used in many orders.', flow: ['items>prod:product_id'] },
    { say: 'Because every fact lives in one place, a change such as a new city is made once.', on: ['cust', 'ord', 'items', 'prod'] },
  ]), [
    faq('What is the difference between a primary key and a foreign key?', 'A primary key uniquely identifies a row in its own table. A foreign key is a column that stores the primary key of a row in another table, creating a link.'),
    faq('Why do we need a junction table?', 'When two kinds of things can each have many of the other, such as orders and products, a middle table with two foreign keys stores each pairing.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S4, 'sql-joins-inner-left', 'SQL JOINs: INNER JOIN and LEFT JOIN Explained', 'SQL INNER JOIN and LEFT JOIN Explained',
    'Combine tables with INNER JOIN and LEFT JOIN. Find customers with no orders, build order totals across three tables, and avoid common join mistakes.', [
    P("A `JOIN` combines rows from two tables into one result by matching a column in one with a column in the other. It is the single most important SQL skill after `SELECT`, and it is the most common interview topic. Take it slowly, and use the pictures in your head: two piles of cards, matched by an id."),
    H("The problem: names live in another table"),
    P("Look at `orders`. It shows `customer_id` 1, 1, 2. That is not very friendly. You want the customer's name. The name is in `customers`. A join connects the two."),
    H("INNER JOIN"),
    C('sql', `SELECT o.id, c.name, o.order_date, o.status
FROM orders AS o
INNER JOIN customers AS c ON c.id = o.customer_id
ORDER BY o.id;`),
    C('text', `id | name         | order_date | status
1  | Asha Rao     | 2024-06-02 | delivered
2  | Asha Rao     | 2024-06-20 | delivered
3  | Ben Carter   | 2024-06-21 | delivered
4  | Chidi Okafor | 2024-07-01 | cancelled
5  | Divya Nair   | 2024-07-04 | delivered
6  | Emma Wilson  | 2024-07-09 | shipped
7  | Ben Carter   | 2024-07-15 | delivered
8  | Farid Hassan | 2024-07-18 | delivered
9  | Asha Rao     | 2024-08-02 | shipped
10 | Grace Mwangi | 2024-08-05 | pending`),
    P("Read it in parts."),
    L("`FROM orders AS o` starts with the orders table and gives it the short name `o`. A short name is called a table alias.", "`INNER JOIN customers AS c` brings in the customers table, short name `c`.", "`ON c.id = o.customer_id` is the matching rule: a customer row and an order row are joined when the customer's `id` equals the order's `customer_id`.", "In the `SELECT`, `o.id` and `c.name` say which table each column comes from. When two tables have a column with the same name, such as `id`, you must say which one you mean."),
    P("`INNER JOIN` keeps only rows that have a match on both sides. Ten orders matched ten customers, so ten rows come back. Hari Singh has no orders, so Hari does not appear at all. You can write just `JOIN` instead of `INNER JOIN`. It means the same."),
    H("LEFT JOIN: keep everything from the left table"),
    P("What if you want all customers, including those with no orders? `LEFT JOIN` keeps every row from the first (left) table. When there is no match on the right side, the right columns are filled with NULL."),
    C('sql', `SELECT c.name, COUNT(o.id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id
ORDER BY orders DESC, c.name;`),
    C('text', `name         | orders
Asha Rao     | 3
Ben Carter   | 2
Chidi Okafor | 1
Divya Nair   | 1
Emma Wilson  | 1
Farid Hassan | 1
Grace Mwangi | 1
Hari Singh   | 0`),
    P("Hari appears with 0 orders. With an inner join Hari would be missing. Notice that we counted `o.id`, not `*`. For Hari the order columns are NULL, and `COUNT(o.id)` skips NULL, so the count is 0. `COUNT(*)` would say 1, which is wrong."),
    H("Find rows with no match"),
    P("A very common request: which customers have never ordered? Do a `LEFT JOIN`, then keep only rows where the right side is NULL."),
    C('sql', `SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL;`),
    C('text', `name
Hari Singh`),
    P("This works because only unmatched customers have a NULL `o.id`. The same pattern finds products that nobody has ordered, employees with no manager assigned, and so on. In our data every product has been ordered at least once, so that query returns nothing."),
    H("Joining three tables"),
    P("You can keep joining. To see the lines of an order with product names and the money for each line, join `order_items` to `products`."),
    C('sql', `SELECT oi.order_id, p.name, oi.quantity, p.price * oi.quantity AS line_total
FROM order_items AS oi
JOIN products AS p ON p.id = oi.product_id
WHERE oi.order_id IN (1, 3)
ORDER BY oi.id;`),
    C('text', `order_id | name         | quantity | line_total
1        | Notebook     | 3        | 360
1        | Pen pack     | 2        | 160
3        | Laptop stand | 1        | 1800
3        | Mouse        | 1        | 700`),
    P("Now go further and combine joins with grouping to answer a real business question: how much has each customer spent, ignoring cancelled orders?"),
    C('sql', `SELECT c.name, SUM(p.price * oi.quantity) AS spent
FROM customers AS c
JOIN orders AS o       ON o.customer_id = c.id
JOIN order_items AS oi ON oi.order_id = o.id
JOIN products AS p     ON p.id = oi.product_id
WHERE o.status <> 'cancelled'
GROUP BY c.id
ORDER BY spent DESC;`),
    C('text', `name         | spent
Asha Rao     | 4020
Ben Carter   | 3340
Divya Nair   | 1200
Emma Wilson  | 700
Farid Hassan | 650
Grace Mwangi | 320`),
    P("Chidi's only order was cancelled, and Hari has no orders, so neither appears. Read the query as a chain: customer to orders, orders to items, items to products. Each `ON` line is one link in the chain. When a join returns strange numbers, check the chain one link at a time by removing the later joins."),
    H("Why join results sometimes grow"),
    P("A join returns one row for every matching pair. If one order has three items, joining orders to items gives three rows for that order. This is correct, but if you then sum an order-level number such as a delivery fee, you would count it three times. When totals look too big, suspect a join that multiplied your rows. Check by counting rows before and after each join."),
    H("Other joins you will meet"),
    L("**RIGHT JOIN** keeps all rows from the right table. It is a LEFT JOIN written backwards, so most people just swap the table order and use LEFT JOIN. SQLite supports it in recent versions.", "**FULL OUTER JOIN** keeps all rows from both sides. It exists in PostgreSQL, SQL Server and Oracle. MySQL does not have it.", "**CROSS JOIN** pairs every row with every row. It is rarely wanted by accident and often a bug.", "**Self join** joins a table to itself, for example an employee table to find each person's manager. Give the two copies different aliases."),
    H("Common mistakes"),
    L("Forgetting the `ON` rule. In some engines this gives a cross join and a huge result.", "Writing a condition on the right table in `WHERE` after a `LEFT JOIN`, for example `WHERE o.status = 'delivered'`. It removes the NULL rows, so the result behaves like an inner join. Put such conditions in the `ON` clause instead.", "Not qualifying a column that exists in both tables. You get an error like “ambiguous column name”.", "Counting with `COUNT(*)` after a left join and counting the unmatched rows as one."),
    ...task("Show each product name with the total quantity ever ordered. Use `order_items` and `products`. Notebook and Sticky notes are both 10.", "List every order with the customer's name and city, only for customers in Nairobi. Two rows come back.", "Find the total value of each order (price times quantity summed per order). Order 3 should be 2500.", "List customers who have at least one shipped order. Use joins and not a subquery."),
    ...check("The Nairobi query returns orders 8 and 10.", "Order values are 520, 1400, 2500, 1300, 1200, 700, 840, 650, 2100 and 320 for orders 1 to 10.", "The shipped query returns Emma Wilson and Asha Rao."),
  ], A('Matching rows with a JOIN', [
    n('left', 'customers', '8 rows', 0, 0, 'store'), n('on', 'ON c.id = customer_id', 'matching rule', 1, 0, 'check'),
    n('right', 'orders', '10 rows', 0, 1, 'store'), n('inner', 'INNER JOIN', 'matches only', 2, 0, 'out'), n('lj', 'LEFT JOIN', 'all customers', 2, 1, 'out'),
  ], [
    { say: 'You have two tables: customers on the left and orders on the right.', on: ['left', 'right'] },
    { say: 'The ON rule says a customer and an order match when the customer id equals the order customer_id.', flow: ['left>on:id', 'right>on:customer_id'] },
    { say: 'INNER JOIN returns only the pairs that match, so a customer with no orders is left out.', flow: ['on>inner:matches'] },
    { say: 'LEFT JOIN keeps every customer. When there is no matching order, the order columns are NULL.', flow: ['on>lj:matches and NULLs'] },
  ]), [
    faq('What is the difference between INNER JOIN and LEFT JOIN?', 'INNER JOIN returns only rows that match in both tables. LEFT JOIN returns all rows from the left table and fills the right side with NULL when there is no match.'),
    faq('How do I find rows with no match in another table?', 'Use a LEFT JOIN and filter for rows where a column from the right table IS NULL.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S4, 'subqueries-exists-and-ctes', 'Subqueries, EXISTS and CTEs: Queries Inside Queries', 'SQL Subqueries, EXISTS and CTEs',
    'Use a query inside another query with subqueries, EXISTS and WITH (CTEs). Learn the NOT IN with NULL trap and how to split big queries into readable steps.', [
    P("Sometimes the answer to one question depends on the answer to another. Which products cost more than the average price? To know that, you first need the average. SQL lets you put one query inside another. It is called a **subquery**. In this lesson you learn three tools that solve this kind of problem: subqueries, `EXISTS` and the `WITH` clause, also called a common table expression or CTE."),
    H("A subquery that returns one value"),
    P("Put a query in brackets where a single value is expected."),
    C('sql', `SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price;`),
    C('text', `name         | price
Desk lamp    | 650
Mouse        | 700
Backpack     | 1400
Laptop stand | 1800`),
    P("The inner query runs first and returns one number, 638.75. Then the outer query uses it like a normal value. If the inner query returned more than one row here, you would get an error or a wrong answer, so make sure it returns exactly one value."),
    H("A subquery that returns a list"),
    P("When the inner query returns a column of values, use it with `IN`."),
    C('sql', `SELECT name
FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE status = 'shipped');`),
    C('text', `name
Asha Rao
Emma Wilson`),
    P("The inner query lists the customer ids that have a shipped order. The outer query finds the names that go with those ids. The same result can be written with a join. Joins and subqueries are often two ways to say the same thing. Choose the one that is easier to read."),
    H("The NOT IN trap with NULL"),
    P("`NOT IN` finds rows whose value is not in a list. It has a serious catch. If the list contains even one NULL, `NOT IN` returns no rows at all."),
    C('sql', `-- This returns Hari Singh, because customer_id is never NULL in orders:
SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);

-- But this returns nothing at all:
SELECT name FROM customers WHERE id NOT IN (1, 2, NULL);`),
    P("The reason is the same as with `= NULL`. For a customer with id 5, the test is “5 is not 1 and not 2 and not NULL”. The last part is unknown, so the whole test is not definitely true and the row is dropped. If a column in your data can be NULL, use `NOT EXISTS` or a `LEFT JOIN` instead."),
    H("EXISTS: does a matching row exist?"),
    P("`EXISTS` is true when the inner query returns at least one row. It is often written with a link back to the outer row. This is called a **correlated subquery**, because the inner query uses a value from the outer query."),
    C('sql', `SELECT c.name
FROM customers AS c
WHERE NOT EXISTS (
  SELECT 1 FROM orders AS o WHERE o.customer_id = c.id
);`),
    C('text', `name
Hari Singh`),
    P("For each customer, the database asks: is there any order for this customer? `SELECT 1` simply means we do not care about the column, only whether a row exists. Use `EXISTS` for “has at least one” and `NOT EXISTS` for “has none”. It is safe with NULLs and stops looking as soon as it finds one row, which is good for speed."),
    H("A subquery in FROM"),
    P("You can also treat a subquery as a temporary table. It must have a name."),
    C('sql', `SELECT category, avg_price
FROM (
  SELECT category, AVG(price) AS avg_price
  FROM products
  GROUP BY category
) AS cat
WHERE avg_price > 500;`),
    P("This works, but deeper nesting quickly becomes hard to read. That is where CTEs help."),
    H("WITH: name each step (CTE)"),
    P("A **CTE** gives a name to a query so you can use it like a table in the main query. It reads from top to bottom like a recipe: first do this, then do that."),
    C('sql', `WITH totals AS (
  SELECT o.customer_id, SUM(p.price * oi.quantity) AS spent
  FROM orders AS o
  JOIN order_items AS oi ON oi.order_id = o.id
  JOIN products AS p     ON p.id = oi.product_id
  WHERE o.status <> 'cancelled'
  GROUP BY o.customer_id
)
SELECT c.name, t.spent
FROM totals AS t
JOIN customers AS c ON c.id = t.customer_id
WHERE t.spent > 1000
ORDER BY t.spent DESC;`),
    C('text', `name       | spent
Asha Rao   | 4020
Ben Carter | 3340
Divya Nair | 1200`),
    P("The first part, `totals`, works out what each customer spent. The second part uses it. You can write several CTEs one after another, separated by commas, and later ones can use earlier ones. CTEs work in SQLite, MySQL 8 and later, PostgreSQL, SQL Server and Oracle. Older MySQL versions do not have them."),
    H("Which one should I use?"),
    L("A single value to compare with: scalar subquery, like `price > (SELECT AVG(price) ...)`.", "A list to test membership: `IN`. Mind NULLs with `NOT IN`.", "“Has at least one” or “has none”: `EXISTS` or `NOT EXISTS`, or a `LEFT JOIN ... IS NULL`.", "A long query with several steps: a CTE, so each step has a clear name."),
    N("Readability is not decoration. In a team, a query is read many more times than it is written. If you cannot explain a query in a sentence per step, split it with CTEs."),
    ...task("Find the products priced below the average price. Four products qualify: Notebook, Pen pack, Sticky notes and Water bottle.", "List customers who have at least one delivered order, using `IN`, then again using `EXISTS`. Both should return Asha, Ben, Divya and Farid.", "Using a CTE, work out the number of items in each order, then show only orders with more than 4 items.", "Explain in your own words why `id NOT IN (1, 2, NULL)` returns nothing."),
    ...check("The below-average list has four products.", "Both delivered-order queries give the same four names.", "The CTE query returns orders 1 (5 items), 5 (7 items) and 7 (12 items)."),
  ], A('Inner query first, then the outer query', [
    n('inner', 'Inner query', 'AVG(price) = 638.75', 0, 0, 'tool'), n('val', 'One value', '638.75', 1, 0, 'data'),
    n('outer', 'Outer query', 'price > that value', 2, 0, 'app'), n('res', 'Result', '4 products', 3, 0, 'out'),
  ], [
    { say: 'A subquery is a query inside brackets. The inner one runs first.', on: ['inner'] },
    { say: 'Here it works out the average price, a single value.', flow: ['inner>val:average'] },
    { say: 'The outer query uses that value in its WHERE condition.', flow: ['val>outer:use it'] },
    { say: 'Only products above the average remain in the result.', flow: ['outer>res:rows kept'] },
  ]), [
    faq('What is a CTE in SQL?', 'A CTE (common table expression) is a named query written with WITH that you can use like a table in the main query. It makes long queries easier to read.'),
    faq('Should I use a join or a subquery?', 'Often both work. Pick the one that is clearer. Use EXISTS or a LEFT JOIN for no-match tests, and a join when you need columns from both tables.'),
  ]),
];
