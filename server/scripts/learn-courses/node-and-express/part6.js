import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, PARTLY, SETUP, run } from './kit2.js';

const S = 'Databases, Validation and Data Modelling';

export const lessons = [
  // ---------------------------------------------------------------- 24
  les(S, 'mongodb-relationships-populate-indexes-and-sql-versus-nosql', 'MongoDB Relationships, Populate, Indexes and SQL versus NoSQL', 'MongoDB Relations, Indexes and SQL vs NoSQL',
    'Model related data in MongoDB with Mongoose references and populate, add indexes for the queries you really run, and learn when SQL fits better than NoSQL.', [
    P("Real data is connected. A user writes posts, a customer places orders, an employee belongs to a department. How you store those connections decides how simple your queries are and how fast the app is. This lesson covers the choices you have in MongoDB with Mongoose, the indexes that keep queries fast, and an honest comparison with SQL databases, which interviewers love to ask about."),
    H("SQL and NoSQL in plain words"),
    P("A **SQL** database, such as PostgreSQL or MySQL, stores data in tables with fixed columns, and connects tables with keys and **joins**. It is strong when data is highly connected and correctness matters, for example banking, bookings and inventory, because it supports strict rules and multi-table transactions. A **NoSQL** document database, such as MongoDB, stores flexible JSON-like documents in collections. It is comfortable when records have varied shapes, when the data is read as a whole document, and when the structure changes often. Neither is better in general. A good answer in an interview is: *it depends on the shape of the data and the queries*. Many companies use both."),
    H("Embed or reference?"),
    P("In MongoDB you choose for each relation. **Embedding** puts the related data inside the document, for example the address inside the user. One read returns everything, and it is the right choice when the child data is small, belongs to one parent and is always read together. **Referencing** stores the id of the other document, like a foreign key. Use it when the data is large, grows without limit, or is shared. A post has an author and may have thousands of comments, so the post holds the author's id and the comments live in their own collection. A document cannot grow beyond 16 MB, so never embed something that can grow forever."),
    C('js', code('db24-models.js')),
    P("The `author` field of a post is an `ObjectId` that points at a `User`. With a connection you replace it by the real user using **populate**, as shown in the comment at the bottom: `Post.findById(id).populate('author', 'name email')`. Populate runs a second query behind the scenes, so use it on purpose, ask only for the fields you need, and avoid it inside loops. Use `.lean()` for read-only lists; it returns plain objects and skips Mongoose's extra work, which is faster."),
    H("Validation in the schema"),
    P("The schema is also your first line of validation. The post requires a title of at most 120 characters, trims spaces, lowercases tags, limits `status` to two words with `enum`, and fills in a default. The next file runs those rules **without a database**, since validation happens in memory, and prints the result."),
    SETUP('mongoose', ['Save both files and run `node db24-check.js`. No database is needed for this check.']),
    C('js', code('db24-check.js')),
    C('text', `Errors on: [ 'author', 'title' ]
Tags cleaned: [ 'js', 'node' ]
Default status: draft
User errors on: [ 'name' ]
Email lowercased: asha@example.com
Post indexes: [ 'author+createdAt', 'status+tags', 'title+body' ]`),
    N("In Mongoose 9, the synchronous `validateSync` method is deprecated, so the example awaits `validate()` and catches the error. Check the Mongoose release notes when you upgrade."),
    H("Indexes: the biggest speed-up you can buy"),
    P("Without an index, MongoDB reads every document to answer a query, which is called a collection scan. That is fine for 500 documents and painful for 5 million. An **index** is a sorted lookup structure on one or more fields. The three indexes in the example match three real questions: *my posts, newest first* uses `author` and `createdAt`; *published posts with a tag* uses `status` and `tags`; and *search the text* uses a text index. The order of fields in a compound index matters, because it can only be used from the left. An index on `{ author: 1, createdAt: -1 }` helps a query on `author` alone, but not one on `createdAt` alone."),
    L("Create indexes for the queries you actually run, not for every field.", "Every index makes writes a little slower and uses memory and disk.", "Use `unique: true` for values that must not repeat, such as an email. It is enforced by an index.", "Use `explain()` in the shell, or the Atlas performance tools, to confirm that a query uses its index."),
    H("A word about MongoDB Atlas"),
    P("**MongoDB Atlas** is the hosted service from the makers of MongoDB. It has a free tier that is enough for learning. You create a cluster, add your server's IP address to the access list, create a database user, and copy the connection string into an environment variable such as `MONGODB_URI`. Never write that string in your code. Atlas clusters are replica sets, which is why transactions work there, as the next lesson shows."),
    PARTLY('the queries that need a running MongoDB, such as populate and the index speed-up,'),
    ...task("Add a `Comment` model that references both a post and a user, with an index for `post` and `createdAt`.", "Add a `slug` field to `Post` with `unique: true` and see how the index list changes.", "Write down one thing that you would embed and one that you would reference in your own project, and say why."),
    ...check("The check prints the same six lines.", "You can explain embed versus reference using the 16 MB limit.", "You can explain why `{ author, createdAt }` does not help a query on `createdAt` alone."),
  ], A('Reference, populate, index', [
    n('post', 'Post document', 'holds author id', 0, 0, 'data'), n('pop', 'populate()', 'second query', 1, 0, 'tool'),
    n('user', 'User document', 'name and email', 2, 0, 'store'), n('idx', 'Index', 'fast lookup', 3, 0, 'check'),
  ], [
    { say: 'A post stores only the id of its author, so the user data is not copied everywhere.', on: ['post'] },
    { say: 'populate asks for the user in a second query and puts the result in place of the id.', flow: ['post>pop:author id'] },
    { say: 'The user document is read from its own collection.', flow: ['pop>user:find by _id'] },
    { say: 'Indexes decide whether those lookups take microseconds or scan the whole collection.', flow: ['user>idx:uses index'] },
  ]), [
    faq('When should I choose SQL instead of MongoDB?', 'When data is strongly connected, needs strict rules and multi-table transactions, or you do a lot of reporting with joins. MongoDB suits flexible documents read as a whole.'),
    faq('Does populate use a join?', 'No. Mongoose runs a separate query for the referenced documents and combines the results. For database-side joins use the $lookup stage of aggregation.'),
    faq('How many indexes are too many?', 'Each one slows writes and uses memory. Keep only the indexes your real queries use, and drop unused ones.'),
  ]),

  // ---------------------------------------------------------------- 25
  les(S, 'mongodb-aggregation-pipelines-and-transactions-in-node', 'MongoDB Aggregation Pipelines and Transactions in Node', 'MongoDB Aggregation and Transactions',
    'Use MongoDB aggregation stages like match, group, sort and lookup to build reports, and use transactions so several writes succeed together or not at all.', [
    P("Sooner or later someone asks a question that no simple `find` can answer: *Who are our top five customers this year? How many orders came in each day? What is the average salary per department?* Doing that in JavaScript, by loading everything and looping, is slow and wastes memory. MongoDB can do the work inside the database with an **aggregation pipeline**. This lesson also covers **transactions**, which protect you when several changes must happen together."),
    H("A pipeline is a list of stages"),
    P("Think of an assembly line. Documents enter the first stage, each stage transforms them, and the output of one becomes the input of the next. The most useful stages are: `$match` to keep only some documents, like `find`; `$group` to combine documents by a key and calculate totals; `$sort` and `$limit` to order and cut the list; `$lookup` to join another collection; `$unwind` to turn an array into separate documents; and `$project` to choose and rename the output fields."),
    C('js', code('db25-aggregate.js')),
    P("Read the pipeline top to bottom. It keeps only paid orders of one year, groups them by customer while adding up `amountCents` and counting orders, sorts by total from largest to smallest, keeps five, joins the user documents to get names, flattens the joined array, and returns only the name, total and count. The first stage is always a `$match` if you can manage it, because it reduces the number of documents early, and a `$match` at the start can use an index."),
    SETUP('mongoose', ['The pipeline is a plain array, so you can print it without a database. Save `db25-check.js` and run it.']),
    C('js', code('db25-check.js')),
    C('text', '$match -> $group -> $sort -> $limit -> $lookup -> $unwind -> $project'),
    P("Amounts are stored in **cents as whole numbers**, not as decimals such as 19.99. Computers cannot store many decimal fractions exactly, so adding prices as floating-point numbers drifts by tiny amounts. Whole numbers in the smallest unit stay exact. Convert to rupees or dollars only when you show the value."),
    H("Why transactions exist"),
    P("Imagine moving stock from one warehouse to another. You subtract from the first and add to the second. If the server crashes between the two writes, the stock has vanished. A **transaction** groups writes so that either all of them are saved or none are. In the example, `session.withTransaction` runs the callback, commits if it finishes, and rolls everything back if it throws. The first update also contains the condition `stock: { $gte: quantity }`, so checking that there is enough stock and subtracting it happen in one step. That prevents two simultaneous requests from both thinking there is enough."),
    N("MongoDB transactions need a replica set. MongoDB Atlas always is one. A plain local `mongod` is not, unless you start it as one, so the example fails on a default local install with an error about transactions. This is expected, not a bug in your code."),
    H("When you do not need a transaction"),
    P("In MongoDB, a change to **one document** is atomic, even if it touches many fields. So if you design the data so that things that must change together live in one document, you often need no transaction at all. Use `$inc`, `$push` and `findOneAndUpdate` with a condition for counters and stock. Reach for a transaction when a rule really spans several documents, as with transfers, bookings and payments. Transactions cost performance, so keep them short and never call a slow external API inside one."),
    L("Put `$match` first and `$project` last.", "Store money as integers in the smallest unit.", "Use conditional updates, such as `stock >= quantity`, to avoid race conditions.", "Use a transaction when several documents must change together, and keep it short."),
    PARTLY('the pipeline and the transaction, which need a running MongoDB replica set,'),
    ...task("Write a pipeline that counts orders per day for the last 30 days.", "Add a `$facet` stage that returns both the top five and the overall total.", "Write a transaction that creates an order and reduces stock, and make it fail on purpose to see the rollback."),
    ...check("You can name the seven stages in the example and say what each does.", "You can explain why the stock check and the update are one operation.", "You can say what a replica set has to do with transactions."),
  ], A('A pipeline, stage by stage', [
    n('m', '$match', 'keep paid orders', 0, 0, 'check'), n('g', '$group', 'sum per customer', 1, 0, 'tool'),
    n('s', '$sort + $limit', 'top five', 2, 0, 'app'), n('l', '$lookup + $project', 'names and totals', 3, 0, 'out'),
  ], [
    { say: 'The first stage keeps only the documents that matter and can use an index.', on: ['m'] },
    { say: 'The group stage combines documents by customer and adds up the amounts.', flow: ['m>g:filtered'] },
    { say: 'Sort and limit keep the five biggest customers.', flow: ['g>s:totals'] },
    { say: 'Lookup joins the names and project shapes the final result for the API.', flow: ['s>l:top five'] },
  ]), [
    faq('Is aggregation faster than doing the work in JavaScript?', 'Usually yes, because the database works close to the data and returns only the result, instead of sending every document to your server.'),
    faq('Why store money as cents?', 'Decimal fractions cannot always be stored exactly as floating-point numbers, so whole numbers in the smallest unit keep totals exact.'),
    faq('Do I need transactions for every write?', 'No. A write to a single document is already atomic. Use transactions only when several documents must change together.'),
  ]),

  // ---------------------------------------------------------------- 26
  les(S, 'validate-requests-with-zod-and-meet-prisma-with-postgresql', 'Validate Requests with Zod, and Meet Prisma with PostgreSQL', 'Zod Validation, Prisma and PostgreSQL',
    'Validate and clean request data with Zod in an Express middleware, then see how Prisma and PostgreSQL model the same data with a schema file and typed queries.', [
    P("Everything that enters your server from outside is untrusted: the body, the query string, the headers and the URL parameters. If you use it without checking, you get crashes at best and security holes at worst. **Validation** means checking that the data has the right shape and obeys your rules before the rest of your code sees it. This lesson uses **Zod**, a popular schema library, and then introduces **Prisma** and **PostgreSQL**, which are the usual next step for people who want a SQL database."),
    H("One schema, three jobs"),
    P("A Zod schema describes the shape of data, the rules, and, in TypeScript, its type. It can also **clean** data as it checks: `trim` removes spaces, `toLowerCase` normalises an email, and `z.coerce.number()` turns the text `\"25\"` from a form into the number 25. The registration schema below shows all of these, and the `validate` function turns any schema into an Express middleware."),
    SETUP('express zod', ['Save the file as `zod.js`. For the test, install `npm install -D supertest`.']),
    C('js', code('z26-zod.js')),
    P("The middleware calls `safeParse`, which never throws and returns either `success: true` with the cleaned data or a list of issues. On failure it sends **422** with one message per field, so the front end can show each message beside the right input. On success it replaces `req.body` with the cleaned value, so later code never sees the raw input. Use the same idea for `req.query` and `req.params`: a `page` that is not a number should be a 422, not an internal error."),
    C('js', code('z26.test.js')),
    P("The test sends a good body, a body with several mistakes, and a body with extra fields, and checks the replies. Zod removes unknown keys by default in an object schema, which protects you from **mass assignment**: a client adding `\"role\": \"admin\"` to a registration body. Always list the fields you accept. Never pass `req.body` directly to `User.create`."),
    N("Validation on the server is not optional, even if the front end also validates. The front end is for helping users. The server is for protecting the system, because anyone can send requests without using your front end."),
    H("Meeting PostgreSQL"),
    P("**PostgreSQL**, often called Postgres, is a free, mature SQL database. Data lives in tables with typed columns. Related tables are connected by a foreign key, and a **join** combines them in a query. It enforces rules in the database itself, such as `NOT NULL`, `UNIQUE` and foreign keys, so even a bug in your code cannot store an order for a customer that does not exist. That strictness is a major reason why companies choose it for payments, bookings and accounts."),
    H("Prisma: a schema file and typed queries"),
    P("**Prisma** is a tool that sits between Node and the database. You describe your models in one `schema.prisma` file. Prisma then generates a client with functions such as `prisma.user.create` and `prisma.post.findMany`, and creates the tables for you with *migrations*, which are versioned scripts that change the database step by step. With TypeScript you get autocomplete and compile-time errors for wrong field names."),
    C('prisma', code('z26-prisma-schema.prisma')),
    C('js', code('z26-prisma-usage.js')),
    P("Compare the model with the Mongoose model in lesson 24. The ideas are the same, a user and many posts, but here the relation is declared in the schema, the database enforces it, and you fetch related data with `include`. The common workflow is: edit `schema.prisma`, run `npx prisma migrate dev` to create and apply a migration, then use the client in your code. In production you apply migrations with `npx prisma migrate deploy`."),
    PARTLY('Prisma and PostgreSQL, which need a running database server and a generated client,'),
    P("Prisma changes between major versions, including how the client is generated and configured, so follow the current official guide when you set it up, and treat the files above as the idea rather than a copy-paste recipe. The Zod example was run and its tests pass."),
    L("Validate `body`, `query` and `params` at the edge of every route.", "Accept only listed fields and ignore the rest.", "Return 422 with messages per field.", "Keep validation schemas in their own files and reuse them in tests and documentation."),
    ...task("Write a `loginSchema` and a `createPostSchema` with a maximum title length.", "Validate `req.query` for a list route with `page` and `limit`.", "Write the Prisma model for `Order` and `OrderItem` with a one-to-many relation."),
    ...check("A body with `role: \"admin\"` does not reach your handler with the role.", "A bad email returns 422 with a message for the email field only.", "You can say two reasons why teams pick PostgreSQL."),
  ], A('Validate at the edge', [
    n('in', 'Request body', 'untrusted', 0, 0, 'user'), n('zod', 'Zod schema', 'check and clean', 1, 0, 'check'),
    n('h', 'Route handler', 'clean data only', 2, 0, 'app'), n('db', 'Database', 'Mongo or Postgres', 3, 0, 'store'),
  ], [
    { say: 'Everything in the request is treated as untrusted text.', on: ['in'] },
    { say: 'The schema checks the shape, trims and converts values, and drops unknown fields.', flow: ['in>zod:safeParse'] },
    { say: 'Only the cleaned result reaches the handler. Errors stop here with a 422.', flow: ['zod>h:clean body'] },
    { say: 'The handler saves it, and a strict database such as Postgres checks the rules again.', flow: ['h>db:insert'] },
  ]), [
    faq('Why validate on the server if the front end already does?', 'Anyone can call your API without your front end, so only the server can protect your data.'),
    faq('Should I choose Prisma or Mongoose?', 'Mongoose is the natural choice with MongoDB. Prisma is a strong choice with PostgreSQL or MySQL, especially with TypeScript.'),
    faq('What is a migration?', 'A versioned script that changes the database structure step by step, so every environment can reach the same structure.'),
  ]),
];
