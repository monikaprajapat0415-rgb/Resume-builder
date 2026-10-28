import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const SETUP = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'setup.txt'), 'utf8');

const S1 = 'Start Here';
const S2 = 'Reading Data';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-sql-and-a-database', 'What Is SQL and What Is a Database?', 'What Is SQL? A Database Guide for Beginners',
    'Learn what a database is, what SQL does, and why almost every company that stores data uses it. Easy words, no code to install yet.', [
    P("SQL is the language people use to ask questions of a database. The letters stand for Structured Query Language, and most people say it as “ess-cue-el” or “sequel”. If you have ever used a spreadsheet to sort a list, filter a column or add up a total, you already know the kind of thinking SQL needs. The difference is size and safety. A spreadsheet is good for a few thousand rows that one person edits. A database holds millions of rows that many people and programs read and change at the same moment, and SQL is how they all talk to it."),
    P("This first lesson has no software to install. It explains the ideas in plain words, so every later lesson makes sense. Read it slowly. The ideas here, tables, rows, columns and keys, come back in every lesson of the course."),
    H("What is a database?"),
    P("A **database** is an organised place to keep data so it can be found, changed and shared quickly. When you order food on a phone app, the restaurant list, your address, your past orders and the delivery status all live in a database. When a bank shows your balance, a database holds it. When a company like the one you may apply to keeps its staff records, a database holds those too."),
    P("Most databases that people meet at work are **relational databases**. The word relational means the data is stored in tables, and the tables are linked to each other. You can picture each table as a sheet in a workbook. One sheet holds customers, another holds products, another holds orders. A relational database keeps these sheets separate on purpose, and then lets you connect them when you ask a question."),
    H("Tables, rows and columns"),
    P("Every table has **columns** and **rows**. A column is one kind of fact, such as `name` or `price`. A row is one thing described by those facts, such as one customer or one product. If a `products` table has the columns `id`, `name`, `category` and `price`, then a row might say: product 1 is called Notebook, belongs to Stationery and costs 120."),
    C('text', `products
id | name      | category   | price
1  | Notebook  | Stationery | 120
2  | Pen pack  | Stationery | 80
3  | Desk lamp | Home       | 650`),
    P("Each column has a **data type**. Prices are numbers. Names are text. A joining date is a date. The database checks the type, so it will refuse to store the word “cheap” in a price column. This small rule saves a lot of mistakes."),
    H("Keys: how rows are told apart"),
    P("Two people can have the same name. Two products can have the same price. So every table needs a column that is different for every row, and it is called the **primary key**. Most of the time it is a column called `id` with the numbers 1, 2, 3 and so on. When you need exactly one row, you ask for it by its primary key."),
    P("Now think about orders. An order belongs to a customer. Instead of copying the customer's name and city into every order, the order stores only the customer's `id`. That column in the `orders` table is called a **foreign key**, because it points to the primary key of another table. Storing the name once and pointing to it from many places is the heart of a relational database. If a customer changes city, you update one row and every order is still correct."),
    N("A simple way to remember it: the primary key says “who am I?”, and the foreign key says “who do I belong to?”."),
    H("What SQL actually does"),
    P("SQL lets you do four main jobs with a database. Many people remember them as CRUD."),
    L("**Create** new rows (`INSERT`).", "**Read** rows that match a question (`SELECT`).", "**Update** values in existing rows (`UPDATE`).", "**Delete** rows you no longer need (`DELETE`)."),
    P("Most of your time, especially in a data, analyst, support or testing job, goes to the second job: reading. In the first half of this course you will learn to read data well. After that you will learn to change it safely, design tables and make queries fast."),
    P("A SQL statement is a sentence that reads almost like English. For example: `SELECT name, price FROM products WHERE price > 500;` means “show me the name and price from the products table, only where the price is more than 500”. You will write sentences like this in the next lessons."),
    H("Different databases, one language"),
    P("You will hear the names MySQL, PostgreSQL, SQL Server, Oracle and SQLite. They are database programs, often called database engines, and all of them understand SQL. The basics are the same everywhere: `SELECT`, `WHERE`, `JOIN`, `GROUP BY` work in all of them. Small things differ, such as how you get the current date or limit the number of rows. This course uses **SQLite** for practice because it is free, small and needs no server. Where another engine does something differently, the lesson says so."),
    P("That means the skills you build here transfer. If your future job uses MySQL or PostgreSQL, you will spend a day learning the small differences, not weeks learning SQL again."),
    H("Who uses SQL, and for what?"),
    L("**Data and business analysts** pull numbers for reports: sales by month, customers by city.", "**Software developers** store and fetch the data behind apps and websites.", "**Testers** check that the data in the database matches what the screen shows.", "**Support and operations staff** look up an order or a user to answer a question.", "**Finance and HR teams** often use SQL-based reporting tools."),
    P("SQL appears in many job descriptions, especially for analyst and developer roles, and it is a common topic in interviews. It is not a guarantee of any job, but it is a practical skill that is useful in many kinds of work."),
    H("What you will build in this course"),
    P("You will work with one small shop database: customers, products, orders and the items inside each order. It has only a few rows, so you can see every answer with your own eyes and check your thinking. By the end you will be able to answer questions such as: Which customers have not ordered anything? What did each customer spend? Which product sells the most in each category?"),
    ...task("Take any spreadsheet you know, such as a contact list or a price list. Write down its column names and say what data type each one holds (number, text or date).", "Decide which column could be a primary key, meaning it is different on every row. If none is, invent an `id` column.", "Think of a second sheet that connects to it, such as orders for customers. Which column would the second sheet use to point to the first? That is your foreign key."),
    ...check("You can say in one sentence what a table, a row and a column are.", "You can explain why orders store a customer id instead of the customer's full name.", "You can name the four basic jobs of SQL: create, read, update and delete."),
  ], A('From your question to your answer', [
    n('you', 'You', 'write a question', 0, 0, 'user'), n('sql', 'SQL statement', 'SELECT ... FROM', 1, 0, 'app'),
    n('engine', 'Database engine', 'finds the rows', 2, 0, 'tool'), n('tables', 'Tables', 'customers, orders', 2, 1, 'store'), n('result', 'Result', 'rows and columns', 3, 0, 'out'),
  ], [
    { say: 'You have a question about your data, such as which products cost more than 500.', on: ['you'] },
    { say: 'You write the question as a SQL statement.', flow: ['you>sql:write'] },
    { say: 'The database engine reads the statement and plans how to answer it.', flow: ['sql>engine:send'] },
    { say: 'It looks in the tables, where the data is stored as rows and columns.', flow: ['engine>tables:look up'] },
    { say: 'The matching rows come back as a result table you can read.', flow: ['engine>result:rows'] },
  ]), [
    faq('Is SQL a programming language?', 'SQL is a query language. It describes what data you want, and the database works out how to get it. It does not have the loops and functions of a general language like Python, but it is a real, useful skill.'),
    faq('Do I need to know coding before learning SQL?', 'No. SQL is one of the easier first technical skills, because statements read almost like English. This course starts from zero.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'set-up-sqlite-practice-database', 'Set Up a Free Practice Database with SQLite', 'Set Up SQLite and a Practice Database',
    'Install free SQLite tools, create the shop database used in every lesson, and run your first query. Copy-and-paste setup script included.', [
    P("You learn SQL by running it. In this lesson you set up a free practice database on your own computer. It takes about fifteen minutes and you only do it once. Every later lesson uses the same small shop database, so you can run each example and see the same answers shown in the lesson."),
    H("Choose your tool"),
    P("SQLite is a tiny database engine that stores everything in one file. There is no server to install and no password. Choose one of these free ways to use it. Any of them works for the whole course."),
    L("**DB Browser for SQLite**: a free desktop app with a window where you type SQL and see results in a table. This is the easiest for most beginners. Search for “DB Browser for SQLite” and download it from its official site.", "**The sqlite3 command line**: a small program. It is already installed on many Mac and Linux computers. On Windows you can download the “sqlite-tools” package from the official SQLite website.", "**An online SQLite playground**: several free websites let you run SQLite in the browser with nothing to install. They come and go, so search for “online SQLite” and pick a well-known one. Do not paste private or work data into a website."),
    P("If you use the command line, open a terminal and type `sqlite3 shop.db`. This creates a file called `shop.db` in the current folder and opens a prompt. If you use DB Browser, choose **New Database**, save it as `shop.db`, and close the dialog that asks you to create a table. Then open the **Execute SQL** tab, which is where you will paste and run the script below."),
    H("Create the shop database"),
    P("The script below does two things. First it creates four tables: `customers`, `products`, `orders` and `order_items`. Then it fills them with a small amount of data. You do not need to understand every word yet. By lesson 12 you will be able to read it line by line."),
    C('sql', SETUP),
    P("Copy the whole script, paste it into your tool and run it. In DB Browser, press the play button or the keyboard shortcut shown on the tab. In the command line, paste it and press Enter, or save it as `setup.sql` and type `.read setup.sql`. If you run it twice you will see an error saying a table already exists. That is fine. Delete the `shop.db` file and start again, or run `DROP TABLE` commands first as you will learn later."),
    H("Run your first query"),
    P("Now ask the database to show you everything in the `customers` table. The star `*` means “all columns”."),
    C('sql', `SELECT * FROM customers;`),
    P("You should see eight rows. The last one, Hari Singh, has an empty city. Databases call an empty value **NULL**, meaning “not known”. NULL is important and has its own lesson. For now just notice it."),
    C('text', `id | name         | city      | joined
1  | Asha Rao     | Bengaluru | 2024-01-15
2  | Ben Carter   | London    | 2024-02-03
3  | Chidi Okafor | Lagos     | 2024-02-20
4  | Divya Nair   | Chennai   | 2024-03-11
5  | Emma Wilson  | Toronto   | 2024-04-02
6  | Farid Hassan | Nairobi   | 2024-04-18
7  | Grace Mwangi | Nairobi   | 2024-05-09
8  | Hari Singh   | NULL      | 2024-06-01`),
    H("A map of the shop database"),
    P("Keep this picture in your head, because every lesson uses it."),
    L("**customers** has 8 rows. Each customer has an `id`, a `name`, a `city` and the date they `joined`.", "**products** has 8 rows. Each product has an `id`, a `name`, a `category` and a `price` as a whole number.", "**orders** has 10 rows. Each order has an `id`, a `customer_id` that points to a customer, an `order_date` and a `status` such as delivered, shipped, pending or cancelled.", "**order_items** has 15 rows. Each one says which product was in which order and the `quantity`. One order can have several items."),
    P("Prices are plain numbers like 120 or 1800 so the sums are easy to check in your head. Think of them as any currency you like. Dates are written as year-month-day, for example `2024-06-02`. This format is the safest in databases because sorting the text also sorts the dates correctly."),
    H("The basic rules of writing SQL"),
    L("A statement ends with a semicolon `;`. Some tools forgive a missing one, but write it anyway.", "SQL keywords like `SELECT` and `FROM` are not case sensitive. Writing them in capitals is a habit that makes queries easier to read.", "Text values go in single quotes: `'Nairobi'`. Numbers do not: `500`.", "You can split a statement over many lines. Spaces and line breaks do not change its meaning.", "Comments start with two dashes: `-- this is a note`. The database ignores them."),
    H("If something goes wrong"),
    P("Errors are normal and the messages are helpful. “no such table” means you spelled a table name wrong, or the setup script did not run. “no such column” means a column name is misspelled. “near ...: syntax error” means the database got confused near the word it shows, so look for a missing comma, a missing quote or an extra comma just before a `FROM`. Read the message, look at the word it points to, and fix one thing at a time."),
    N("Practice habit: type the queries yourself instead of only pasting them. Typing makes your fingers remember the shape of a statement, and you will make small mistakes that teach you the most."),
    ...task("Install one of the tools above and create `shop.db`.", "Run the setup script. Then run `SELECT * FROM products;` and count the rows. You should see 8.", "Run `SELECT * FROM orders;` and `SELECT * FROM order_items;`. Note the row counts (10 and 15) and look at how `customer_id` and `order_id` link rows to other tables.", "Add a comment line above a query, run it again, and confirm nothing changes."),
    ...check("`SELECT * FROM customers;` returns 8 rows and Hari Singh has no city.", "You can say which table holds the quantity of items in an order (`order_items`).", "You know how to open a fresh start: delete the file and run the script again."),
  ], A('Your practice setup', [
    n('tool', 'Your SQL tool', 'DB Browser or sqlite3', 0, 0, 'user'), n('script', 'Setup script', 'CREATE and INSERT', 1, 0, 'app'),
    n('file', 'shop.db', 'one small file', 2, 0, 'store'), n('query', 'Your query', 'SELECT * ...', 1, 1, 'tool'), n('rows', 'Result rows', 'seen in the grid', 3, 0, 'out'),
  ], [
    { say: 'You open a free SQL tool and create an empty database file called shop.db.', on: ['tool', 'file'] },
    { say: 'You paste the setup script into the tool and run it.', flow: ['tool>script:paste'] },
    { say: 'The script creates four tables and fills them with data inside shop.db.', flow: ['script>file:create and insert'] },
    { say: 'Now you type a query such as SELECT * FROM customers.', flow: ['tool>query:type'] },
    { say: 'The rows from the table appear in the results grid.', flow: ['file>rows:rows'] },
  ]), [
    faq('Why SQLite and not MySQL or PostgreSQL?', 'SQLite needs no server or password, so you can start in minutes. The core SQL you learn works in MySQL and PostgreSQL too, and the lessons mention small differences.'),
    faq('Can I use the practice database on my phone?', 'Setup is much easier on a computer. A few online SQLite playgrounds work in a phone browser, but typing long SQL on a phone is slow, so a computer is recommended.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S2, 'select-from-where-basics', 'SELECT, FROM and WHERE: Your First Queries', 'SQL SELECT, FROM and WHERE Explained',
    'Write your first real queries: choose columns with SELECT, name the table with FROM, and keep only matching rows with WHERE. Includes NULL.', [
    P("Almost every SQL query you will ever read starts with the same three ideas. `SELECT` says which columns you want to see. `FROM` says which table to look in. `WHERE` says which rows to keep. In this lesson you learn all three, and a fourth idea that surprises every beginner: NULL."),
    H("SELECT and FROM: choose columns"),
    P("The shortest useful query asks for everything in a table."),
    C('sql', `SELECT * FROM products;`),
    P("The star means every column. This is fine for a quick look, but in real work you usually name the columns you need. Naming columns makes the result easier to read, faster for big tables and safer when the table gains new columns later."),
    C('sql', `SELECT name, price FROM products;`),
    P("The order you write the columns is the order you get them. Try `SELECT price, name FROM products;` and the two columns swap places. The table itself does not change. A query only reads data, it never changes it."),
    H("Give a column a nicer name with AS"),
    P("You can rename a column in the result with `AS`. This is called an **alias**. It is useful when a column name is unclear or when you calculate a new value."),
    C('sql', `SELECT name AS product, price AS price_in_rupees FROM products;`),
    P("You can also calculate. Suppose you want the price with 18 per cent tax added, the way a shop in India might show GST. The database does the sum for every row."),
    C('sql', `SELECT name, price, price * 1.18 AS price_with_tax FROM products;`),
    P("Use the tax rate of your own country and your own case, this is only an example. The idea to keep is that a SELECT list can hold calculations, not just column names."),
    H("WHERE: keep only the rows you want"),
    P("`WHERE` filters rows. It comes after `FROM`. Only rows where the condition is true are kept."),
    C('sql', `SELECT name, price
FROM products
WHERE price > 500;`),
    C('text', `name         | price
Desk lamp    | 650
Backpack     | 1400
Laptop stand | 1800
Mouse        | 700`),
    P("Four of the eight products cost more than 500, so four rows come back. The comparison signs are the ones you know from school: `=` equal, `<>` or `!=` not equal, `>` greater, `<` less, `>=` greater or equal, `<=` less or equal. Notice that SQL uses a single `=` to compare, not `==`."),
    H("Comparing text and dates"),
    P("Text goes in single quotes, and in SQLite the match is case sensitive for `=`, so `'nairobi'` and `'Nairobi'` are different. Other engines may ignore case, so it is a good habit to write values exactly as stored."),
    C('sql', `SELECT name, city FROM customers WHERE city = 'Nairobi';`),
    P("Dates saved as `YYYY-MM-DD` text compare correctly with the same signs, because 2024-06-01 sorts before 2024-07-01."),
    C('sql', `SELECT name, joined FROM customers WHERE joined >= '2024-04-01';`),
    P("That returns the four customers who joined from April 2024 onward: Emma, Farid, Grace and Hari."),
    H("NULL: a value that is not there"),
    P("Hari Singh has no city in our table. The city is NULL, which means “unknown or missing”. NULL is not zero and not an empty text. It is the absence of a value. Because of this, you cannot test for it with `=`."),
    C('sql', `-- This returns nothing, even though Hari has no city:
SELECT name FROM customers WHERE city = NULL;

-- This is the correct way:
SELECT name, city FROM customers WHERE city IS NULL;`),
    C('text', `name       | city
Hari Singh | NULL`),
    P("To find rows that do have a value, use `IS NOT NULL`. The reason `= NULL` fails is logical: if a value is unknown, the database cannot say that it equals something. “Unknown equals unknown” is also unknown, and `WHERE` only keeps rows that are definitely true. Many real bugs, and many interview questions, come from forgetting this."),
    N("Rule to remember: use `IS NULL` and `IS NOT NULL` for missing values. Never `= NULL`."),
    H("The order the database thinks in"),
    P("You write `SELECT` first, but the database reads the query in a different order. It first looks at `FROM` to find the table, then applies `WHERE` to keep the rows, and only then picks the columns in `SELECT`. This is why you cannot use a new alias from `SELECT` inside `WHERE` in most engines. You can use the real column or repeat the calculation."),
    C('sql', `-- Works: repeat the calculation
SELECT name, price * 1.18 AS price_with_tax
FROM products
WHERE price * 1.18 > 1000;`),
    H("Common beginner mistakes"),
    L("Forgetting the quotes around text: `WHERE city = Nairobi` makes the database look for a column named Nairobi.", "Using double quotes for text. Use single quotes for text values.", "Putting a comma after the last column before `FROM`: `SELECT name, price, FROM products` is a syntax error.", "Writing `WHERE` before `FROM`. The order is always `SELECT`, `FROM`, `WHERE`."),
    ...task("List the name and category of every product in the Stationery category.", "List the names of customers who joined before `'2024-03-01'`.", "Find customers whose city is missing, then find customers whose city is not missing and count them yourself (it should be 7).", "Show each product name with a column called `price_with_tax` that is the price times 1.18."),
    ...check("The Stationery query returns three rows: Notebook, Pen pack and Sticky notes.", "The date query returns Asha, Ben and Chidi.", "`city IS NULL` returns only Hari Singh."),
  ], A('The path of a simple query', [
    n('from', 'FROM', 'pick the table', 0, 0, 'store'), n('where', 'WHERE', 'keep matching rows', 1, 0, 'check'),
    n('select', 'SELECT', 'pick the columns', 2, 0, 'app'), n('out', 'Result', 'rows you asked for', 3, 0, 'out'),
  ], [
    { say: 'You write SELECT first, but the database starts with FROM and opens the products table.', on: ['from'] },
    { say: 'WHERE looks at each row and keeps only the ones where price > 500 is true.', flow: ['from>where:all 8 rows'] },
    { say: 'SELECT then picks only the columns you named, such as name and price.', flow: ['where>select:4 rows'] },
    { say: 'The result is a small table with just those rows and columns.', flow: ['select>out:result'] },
  ]), [
    faq('Why does WHERE city = NULL return nothing?', 'NULL means unknown, so nothing is equal to it, not even another NULL. Use IS NULL to find missing values.'),
    faq('Do I have to type SELECT in capital letters?', 'No. SQL keywords are not case sensitive. Capitals are only a habit that makes queries easier to read.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S2, 'filter-with-and-or-in-between-like', 'Filter Rows: AND, OR, IN, BETWEEN and LIKE', 'SQL AND, OR, IN, BETWEEN and LIKE',
    'Combine conditions with AND and OR, use brackets correctly, and write shorter filters with IN, BETWEEN and LIKE. Real examples and common traps.', [
    P("A single `WHERE price > 500` answers simple questions. Real questions have more parts: customers in Nairobi who joined after May, or products that are cheap or in the Home category. In this lesson you combine conditions and learn the shortcuts that make long filters short and clear."),
    H("AND: both must be true"),
    P("`AND` keeps a row only when both conditions are true."),
    C('sql', `SELECT name, city, joined
FROM customers
WHERE city = 'Nairobi' AND joined >= '2024-05-01';`),
    C('text', `name         | city    | joined
Grace Mwangi | Nairobi | 2024-05-09`),
    P("Two customers live in Nairobi, Farid and Grace, but only Grace joined in May or later, so only Grace remains. Each extra `AND` makes the result smaller or the same, never bigger."),
    H("OR: at least one must be true"),
    P("`OR` keeps a row when either condition is true."),
    C('sql', `SELECT name, category, price
FROM products
WHERE category = 'Bags' OR price < 100;`),
    C('text', `name         | category   | price
Pen pack     | Stationery | 80
Backpack     | Bags       | 1400
Sticky notes | Stationery | 60`),
    P("Each extra `OR` makes the result bigger or the same. A good way to remember: AND narrows, OR widens."),
    H("Brackets: the trap in mixing AND and OR"),
    P("When you mix `AND` and `OR` in one `WHERE`, SQL does `AND` first, like multiplication before addition in maths. This often gives a different answer than you meant. Use brackets to say exactly what you want."),
    C('sql', `-- What you may mean: Office or Bags products that cost under 1500
SELECT name, category, price
FROM products
WHERE (category = 'Office' OR category = 'Bags') AND price < 1500;`),
    C('text', `name     | category | price
Backpack | Bags     | 1400
Mouse    | Office   | 700`),
    P("Without the brackets, SQL would read `category = 'Office'` OR (`category = 'Bags'` AND `price < 1500`). Then the Laptop stand at 1800 would sneak into the result, because every Office product passes the first test. Whenever you use both words together, add brackets even when you think you do not need them. It costs nothing and protects you from wrong reports."),
    H("IN: a short way to write many ORs"),
    P("Writing `category = 'Home' OR category = 'Bags' OR category = 'Office'` is long. `IN` does the same with a list."),
    C('sql', `SELECT name FROM products WHERE category IN ('Home', 'Bags');`),
    P("This returns Desk lamp, Backpack and Water bottle. Add `NOT` in front to get everything else: `category NOT IN ('Home', 'Bags')`. A warning for later: if the list could contain NULL, `NOT IN` can behave strangely. You will meet this in the subqueries lesson."),
    H("BETWEEN: a range, with both ends included"),
    C('sql', `SELECT name, price
FROM products
WHERE price BETWEEN 100 AND 700
ORDER BY price DESC;`),
    C('text', `name         | price
Mouse        | 700
Desk lamp    | 650
Water bottle | 300
Notebook     | 120`),
    P("`BETWEEN 100 AND 700` is the same as `price >= 100 AND price <= 700`. Both ends are included, which is why the Mouse at exactly 700 appears. It also works with dates: `joined BETWEEN '2024-02-01' AND '2024-03-31'`."),
    H("LIKE: match patterns in text"),
    P("When you do not know the exact text, `LIKE` searches by pattern. Two special signs are used. The percent sign `%` stands for any number of characters, including none. The underscore `_` stands for exactly one character."),
    C('sql', `-- names that start with A
SELECT name FROM customers WHERE name LIKE 'A%';

-- names that end with 'Rao'
SELECT name FROM customers WHERE name LIKE '%Rao';

-- names with a letter 'k' anywhere
SELECT name FROM customers WHERE name LIKE '%k%';

-- a three-letter product code starting with P, like P01
SELECT name FROM products WHERE name LIKE 'P__';`),
    P("In SQLite, `LIKE` ignores upper and lower case for ordinary English letters. In some other engines it does not, so check your database if case matters. Be careful with `%` at the start of a pattern, such as `'%k%'`. The database has to look at every row, because it cannot jump straight to a match. On a small table you will not notice. On a table with millions of rows, it can be slow."),
    H("Putting it all together"),
    P("Here is a realistic request: “Show orders that are either shipped or pending, placed in July or August 2024.” You can build it from the parts."),
    C('sql', `SELECT id, customer_id, order_date, status
FROM orders
WHERE status IN ('shipped', 'pending')
  AND order_date BETWEEN '2024-07-01' AND '2024-08-31'
ORDER BY order_date;`),
    C('text', `id | customer_id | order_date | status
6  | 5           | 2024-07-09 | shipped
9  | 1           | 2024-08-02 | shipped
10 | 7           | 2024-08-05 | pending`),
    P("Notice how the query is laid out: one condition per line, with `AND` at the start of the line. This is not required, but it makes long conditions easy to read and easy to fix. People who read your SQL later, including you in a month, will be thankful."),
    H("Common mistakes"),
    L("Mixing `AND` and `OR` without brackets and getting a bigger or smaller list than expected.", "Writing `WHERE price BETWEEN 700 AND 100`. The smaller number must come first, or nothing is returned.", "Using `=` with `%`. `name = 'A%'` looks for the exact text A%. Use `LIKE`.", "Forgetting that NULL rows never match a comparison. A row with a missing city will not appear in `city <> 'Nairobi'`. Add `OR city IS NULL` if you want it."),
    ...task("Find products in the Stationery category that cost less than 100.", "Find customers in Nairobi or Chennai (write it once with OR and once with IN).", "Find orders that are not delivered (`status <> 'delivered'`) and were placed after `'2024-07-01'`.", "Find product names that contain the word `note`."),
    ...check("The first query returns Pen pack and Sticky notes.", "Both versions of the Nairobi or Chennai query return the same three customers: Divya, Farid and Grace.", "The product search for `%note%` returns Notebook and Sticky notes."),
  ], A('AND narrows, OR widens', [
    n('all', 'All rows', 'the table', 0, 0, 'store'), n('and', 'AND', 'both true', 1, 0, 'check'),
    n('or', 'OR', 'either true', 1, 1, 'check'), n('res', 'Your result', 'after brackets', 2, 0, 'out'),
  ], [
    { say: 'Start with every row in the table.', on: ['all'] },
    { say: 'AND keeps a row only if both conditions are true, so the list gets shorter.', flow: ['all>and:test each row'] },
    { say: 'OR keeps a row if either condition is true, so the list gets longer.', flow: ['all>or:test each row'] },
    { say: 'Brackets make clear which conditions belong together, so the result is what you meant.', flow: ['and>res:narrow', 'or>res:widen'] },
  ]), [
    faq('Does AND or OR run first?', 'AND runs before OR. Use brackets whenever you mix them so the meaning is clear.'),
    faq('Is BETWEEN inclusive?', 'Yes. BETWEEN 100 AND 700 includes both 100 and 700.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'order-by-limit-distinct', 'Sort and Trim Results: ORDER BY, LIMIT, DISTINCT', 'SQL ORDER BY, LIMIT and DISTINCT',
    'Sort rows with ORDER BY, get a top-N list with LIMIT, remove repeats with DISTINCT, and use functions like UPPER, LENGTH, COALESCE and CASE.', [
    P("By default a database gives you rows in no promised order. Sometimes they come out in the order they were added, but you must never depend on it. If order matters to you, ask for it. In this lesson you learn to sort results, cut them to the top few, remove duplicates, and use a few helpful built-in functions."),
    H("ORDER BY: sort the result"),
    C('sql', `SELECT name, price
FROM products
ORDER BY price;`),
    P("That sorts from the smallest price to the largest. This is called ascending order and it is the default. Add `DESC` for descending, largest first."),
    C('sql', `SELECT name, price
FROM products
ORDER BY price DESC;`),
    C('text', `name         | price
Laptop stand | 1800
Backpack     | 1400
Mouse        | 700
Desk lamp    | 650
Water bottle | 300
Notebook     | 120
Pen pack     | 80
Sticky notes | 60`),
    P("`ORDER BY` is always near the end of the query, after `WHERE`. Text sorts alphabetically and dates sort from earliest to latest when they are written as `YYYY-MM-DD`."),
    H("Sort by more than one column"),
    P("When two rows tie on the first column, a second column decides. List them with commas. Each one can have its own direction."),
    C('sql', `SELECT category, name, price
FROM products
ORDER BY category ASC, price DESC;`),
    C('text', `category   | name         | price
Bags       | Backpack     | 1400
Home       | Desk lamp    | 650
Home       | Water bottle | 300
Office     | Laptop stand | 1800
Office     | Mouse        | 700
Stationery | Notebook     | 120
Stationery | Pen pack     | 80
Stationery | Sticky notes | 60`),
    P("Categories are in alphabetical order, and inside each category the dearest product comes first. You can also sort by a calculated column or by its alias, for example `ORDER BY price_with_tax`."),
    H("LIMIT: only the first few rows"),
    P("`LIMIT` cuts the result to the first N rows. Combined with `ORDER BY` it gives a “top N” list, one of the most common requests in reporting."),
    C('sql', `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;`),
    C('text', `name         | price
Laptop stand | 1800
Backpack     | 1400
Mouse        | 700`),
    P("Always use `ORDER BY` with `LIMIT`. A `LIMIT` without a sort returns some rows, but which ones is not promised. To skip rows, for example for page 2 of a list, add `OFFSET`: `LIMIT 3 OFFSET 3` skips the first three and returns the next three."),
    N("Engine difference: MySQL, PostgreSQL and SQLite use `LIMIT`. SQL Server uses `SELECT TOP 3 ...` or `OFFSET ... FETCH`. Oracle uses `FETCH FIRST 3 ROWS ONLY`. The idea is the same."),
    H("DISTINCT: remove repeated values"),
    P("Two customers live in Nairobi. If you ask for the city column, Nairobi appears twice. `DISTINCT` returns each different value once."),
    C('sql', `SELECT DISTINCT city FROM customers ORDER BY city;`),
    C('text', `city
NULL
Bengaluru
Chennai
Lagos
London
Nairobi
Toronto`),
    P("NULL counts as a value here, and in SQLite it sorts first. `DISTINCT` works on the whole row you select. `SELECT DISTINCT category, price` returns each different pair of values, not each different category."),
    H("Handy functions"),
    P("A **function** takes a value and returns a changed one. You call it with its name and brackets. Here are the ones you will use most. They work the same in nearly all engines, with small name differences."),
    C('sql', `SELECT UPPER(name) AS shout, LENGTH(name) AS letters
FROM customers
WHERE id <= 3;`),
    C('text', `shout        | letters
ASHA RAO     | 8
BEN CARTER   | 10
CHIDI OKAFOR | 12`),
    L("`UPPER(x)` and `LOWER(x)` change the case of text.", "`LENGTH(x)` counts characters (`LEN` in SQL Server).", "`ROUND(x, 2)` rounds a number to 2 decimal places.", "`SUBSTR(x, start, length)` takes part of a text (`SUBSTRING` in other engines). `SUBSTR(order_date, 1, 7)` gives the year and month, like `2024-06`.", "`x || y` joins text in SQLite and PostgreSQL. MySQL uses `CONCAT(x, y)`."),
    H("COALESCE: give NULL a fallback"),
    P("Reports look odd with blank cells. `COALESCE(a, b)` returns the first value that is not NULL, so you can show a friendly default."),
    C('sql', `SELECT name, COALESCE(city, 'Unknown') AS city
FROM customers
WHERE id >= 7;`),
    C('text', `name         | city
Grace Mwangi | Nairobi
Hari Singh   | Unknown`),
    P("This changes only the result you see. The table still holds NULL."),
    H("CASE: if this, then that"),
    P("`CASE` lets a query choose a value by a rule, like an if statement. This is how you turn numbers into labels."),
    C('sql', `SELECT name, price,
  CASE
    WHEN price < 100 THEN 'cheap'
    WHEN price < 1000 THEN 'medium'
    ELSE 'premium'
  END AS band
FROM products
ORDER BY price;`),
    C('text', `name         | price | band
Sticky notes | 60    | cheap
Pen pack     | 80    | cheap
Notebook     | 120   | medium
Water bottle | 300   | medium
Desk lamp    | 650   | medium
Mouse        | 700   | medium
Backpack     | 1400  | premium
Laptop stand | 1800  | premium`),
    P("The database checks the `WHEN` lines from top to bottom and uses the first one that is true. The `ELSE` is what you get when none match. Without an `ELSE`, unmatched rows become NULL. `CASE` is useful in reports, and it often comes up in interviews."),
    ...task("List all customers sorted by `joined`, newest first.", "Show the three cheapest products.", "List the different order statuses used in the `orders` table, each only once.", "Show each customer name with their city, but show `'Not given'` when the city is missing.", "Label each order as `'open'` when its status is `shipped` or `pending`, and `'closed'` otherwise."),
    ...check("The newest customer first is Hari Singh (2024-06-01).", "The three cheapest are Sticky notes, Pen pack and Notebook.", "There are four different statuses: cancelled, delivered, pending and shipped."),
  ], A('Sort, then trim', [
    n('rows', 'Matching rows', 'from WHERE', 0, 0, 'store'), n('dist', 'DISTINCT', 'drop repeats', 1, 0, 'check'),
    n('sort', 'ORDER BY', 'sort the rows', 2, 0, 'tool'), n('lim', 'LIMIT', 'keep the top few', 3, 0, 'out'),
  ], [
    { say: 'After FROM and WHERE, you have a set of rows with no promised order.', on: ['rows'] },
    { say: 'DISTINCT removes rows that are exact repeats.', flow: ['rows>dist:all rows'] },
    { say: 'ORDER BY puts the rows in the order you asked for, such as price from high to low.', flow: ['dist>sort:unique rows'] },
    { say: 'LIMIT keeps only the first rows, which gives you a top-3 or top-10 list.', flow: ['sort>lim:sorted rows'] },
  ]), [
    faq('What order do rows come in without ORDER BY?', 'No order is promised. It may look sorted today and change later, so always add ORDER BY when order matters.'),
    faq('Can I use LIMIT in SQL Server?', 'SQL Server uses TOP or OFFSET and FETCH instead of LIMIT. The idea of taking the first N rows is the same.'),
  ]),
];
