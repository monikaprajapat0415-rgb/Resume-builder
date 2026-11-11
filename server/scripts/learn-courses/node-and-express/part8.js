import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, PARTLY, SETUP, run } from './kit2.js';

const S = 'Architecture, Reliability and Performance';

export const lessons = [
  // ---------------------------------------------------------------- 32
  les(S, 'clean-architecture-in-express-repository-service-dependency-injection-and-solid', 'Clean Architecture in Express: Repository, Service, Dependency Injection and SOLID', 'Express Architecture: Service, Repository',
    'Organise a growing Express app into controller, service and repository layers, use dependency injection to test rules without HTTP, and apply SOLID.', [
    P("Lesson 19 split an app into store, controller and routes. That is enough for a small API. As an app grows, a new problem appears: **business rules**. Rules such as \"a task title cannot be empty\" or \"a finished task cannot be edited\" end up inside route handlers, mixed with HTTP details, and then they are hard to test and easy to copy by mistake. The cure is one more layer, and a habit of passing in what a piece of code needs instead of creating it inside."),
    H("Four layers, each with one job"),
    L("**Controller:** speaks HTTP. It reads the request, calls the service and turns the result into a status code and JSON. It contains no business rules.", "**Service:** holds the **rules** of your application. It knows nothing about requests, responses or the database engine.", "**Repository:** the only place that talks to the database. It offers methods such as `findById` and `save`.", "**Errors:** the service raises its own kinds of error, for example `NotFoundError` or `RuleError`, and one small mapper turns them into 404 or 409."),
    P("The direction of dependency matters. The controller depends on the service, and the service depends on a repository *interface*, but never the other way round. The service never imports Express and never imports Mongoose. That is why you could change from MongoDB to PostgreSQL by writing a new repository, and why the business rules stay untouched."),
    C('js', code('ar33-layers.js')),
    H("Dependency injection without a framework"),
    P("Look at how `TaskService` is built: `new TaskService(repository)`. The service does not create its repository. It receives it. This is **dependency injection**, and in JavaScript it needs no special library, just constructor or function parameters. The place where everything is wired together, here `createApp`, is called the **composition root**. In a test you pass a memory repository, and in production you pass the real one."),
    P("The first test below does not use HTTP at all: it creates a service with a memory repository and calls its methods directly. It runs in a few milliseconds. The second test goes through HTTP with Supertest and checks that the error mapper gives the right status codes. Both pass."),
    SETUP('express', ['Save the code as `layers.js`. The test needs `npm install -D supertest`.']),
    C('js', code('ar33.test.js')),
    H("SOLID, in one paragraph each"),
    P("**SOLID** is a set of five design ideas that interviewers like to ask about. You do not need to memorise them as rules. They describe the same habits you just used."),
    L("**S, single responsibility:** a piece of code has one reason to change. The controller changes when the API shape changes, the service when the rules change, the repository when the database changes.", "**O, open/closed:** you can add behaviour without editing working code. A new payment provider is a new file, not an edit of the old ones.", "**L, Liskov substitution:** any repository that follows the same methods can replace another. The memory repository and the MongoDB repository are interchangeable.", "**I, interface segregation:** keep contracts small. A service that only reads should not need a repository with ten write methods.", "**D, dependency inversion:** depend on a contract, not on a concrete tool. The service depends on \"a repository\", not on Mongoose."),
    H("Do not over-build"),
    P("Layers cost files and indirection. For a three-route API they are more than you need, and a pile of empty \"manager\" classes helps nobody. Add a layer when it solves a problem you have: rules scattered across handlers, tests that need a database, a plan to change the data store. **Clean architecture**, the name for pushing this idea all the way, is a direction, not a goal. Start simple, and refactor towards layers when the pain appears."),
    RAN,
    ...task("Add a `complete` rule to the service: a completed task cannot be completed again, and make it return 409.", "Write a second repository that stores tasks in a JSON file and pass it to the service.", "Write a service test with a fake repository that throws, and see how the error is handled."),
    ...check("The service test passes with no HTTP.", "You can explain what the composition root is.", "You can name the layer that you would change when moving from MongoDB to PostgreSQL."),
  ], A('Layers point inward', [
    n('c', 'Controller', 'HTTP in and out', 0, 0, 'app'), n('s', 'Service', 'business rules', 1, 0, 'tool'),
    n('r', 'Repository', 'only DB access', 2, 0, 'store'), n('e', 'Error mapper', 'rule error to 4xx', 3, 0, 'check'),
  ], [
    { say: 'The controller turns an HTTP request into a plain method call.', on: ['c'] },
    { say: 'The service applies the rules. It does not know about Express.', flow: ['c>s:call'] },
    { say: 'The repository is passed in, so tests use memory and production uses the database.', flow: ['s>r:injected'] },
    { say: 'Rule errors are mapped to the right status code in one place.', flow: ['r>e:throws'] },
  ]), [
    faq('Is dependency injection the same as using a framework like NestJS?', 'No. DI is just passing what a piece of code needs as a parameter. NestJS adds a container that does it for you, but you can do it by hand.'),
    faq('Do small projects need all these layers?', 'No. Add a layer when you feel the pain it solves, such as business rules duplicated in handlers or tests that need a database.'),
    faq('What is a composition root?', 'The single place where the app creates its parts and connects them, usually the file that builds the app.'),
  ]),

  // ---------------------------------------------------------------- 33
  les(S, 'error-handling-and-logging-in-express-winston-morgan-and-request-ids', 'Error Handling and Logging in Express: Winston, Morgan and Request IDs', 'Express Error Handling and Logging',
    'Build one reliable error system for Express: custom AppError classes, safe client messages, JSON logs with Winston, request logs with Morgan and request ids.', [
    P("When something goes wrong in production, you cannot sit beside the server and watch. You have two sources of truth: the reply that the client received and the logs that your server wrote. If the reply leaks a stack trace, you have given attackers a map. If the logs are missing, you cannot find the cause. This lesson builds a small but complete system that gets both right."),
    H("Two audiences, two messages"),
    P("Every error has two readers. The **client** needs to know what it can fix: \"Item not found\", \"Email is invalid\". The **developer** needs everything: the full message, the stack trace, the user and the request. The rule is simple: show client errors (status 400 to 499) to the client, and **hide the details of server errors** (500 and above), while writing them in full to the log. The custom `AppError` class carries a status code, a short code and a flag `expose` that says whether its message is safe to send."),
    C('js', code('ar34-errors-logs.js')),
    P("Read the code from the top. `AppError` and its helpers `notFound` and `badRequest` are the errors that your own code throws on purpose. The error handler at the end decides: if the error is an `AppError` with a status below 500, send its message and code. For anything else, such as a crash from a bug or a library, log the full error and send only `Something went wrong`. In Express 5, a rejected promise in an async handler goes to this handler automatically, so you no longer need to wrap every route in `try/catch`."),
    H("Winston: structured logs"),
    P("`console.log` is fine on your laptop and poor in production. **Winston** is a logging library with **levels** (`error`, `warn`, `info`, `debug`), timestamps and several outputs, called transports, such as the console, files or a cloud service. The example writes **JSON**, one object per line, because tools like Datadog, Grafana Loki or the ELK stack can search and graph JSON easily. Set the level from an environment variable, `LOG_LEVEL`, so you can turn on `debug` for a short time without changing code."),
    H("Morgan and request ids"),
    P("**Morgan** writes one line for each request: method, URL, status and the time taken. Here its output is sent *into* Winston, so every log line goes to the same place in the same format. Each request also receives a unique **request id**, taken from the incoming `x-request-id` header or generated, and returned in the response. When a user reports a problem, ask for that id, search the logs for it, and you will find every line that belongs to that one request."),
    SETUP('express winston morgan', ['Save the code as `errors.js`. The test needs `npm install -D supertest`.']),
    C('js', code('ar34.test.js')),
    C('text', 'ok 1 - client errors show their message, server errors hide it but are logged'),
    L("Never log passwords, tokens, card numbers or full personal data. Remove them before logging.", "Log at the right level: `error` for failures you must act on, `warn` for strange but survivable, `info` for normal events.", "Watch the logs, or set up alerts. A log that nobody reads does not protect you.", "Also handle the two global events, `unhandledRejection` and `uncaughtException`: log them and exit, and let your process manager restart the app, because the program may be in an unknown state."),
    N("Never rely on `console.log` for security events. Write logins, failures and permission denials to the structured log, because those lines are what you search after an incident."),
    RAN,
    ...task("Add a `ValidationError` subclass with status 422 that carries a list of field messages.", "Log the user id in each request line when the user is logged in.", "Send the logs to a file as well, with a daily rotation package such as winston-daily-rotate-file."),
    ...check("A thrown server bug shows only a safe message to the client but the stack in the log.", "Every response has an `x-request-id` header.", "You can say which status codes are safe to show messages for."),
  ], A('Same error, two stories', [
    n('thr', 'Error thrown', 'bug or AppError', 0, 0, 'user'), n('h', 'Error handler', 'one place', 1, 0, 'app'),
    n('cl', 'Client sees', 'safe message only', 2, 0, 'out'), n('log', 'Log sees', 'full error + id', 3, 0, 'store'),
  ], [
    { say: 'A route throws, either on purpose with an AppError or by accident with a bug.', on: ['thr'] },
    { say: 'In Express 5 even a rejected async function reaches the same error handler.', flow: ['thr>h:next(err)'] },
    { say: 'The client receives a short, safe message and the request id.', flow: ['h>cl:4xx text, 5xx generic'] },
    { say: 'The developer log receives the stack, the request id and the context, as JSON.', flow: ['cl>log:Winston'] },
  ]), [
    faq('Why hide the message of a 500 error?', 'It may contain file paths, query text or library details that help an attacker. Log it fully and show the client something generic.'),
    faq('Winston or console.log?', 'console.log is fine to learn. In production, Winston or a similar library gives levels, JSON and several outputs.'),
    faq('What is a request id for?', 'It lets you find all log lines of one request, and a user can quote it in a support message.'),
  ]),

  // ---------------------------------------------------------------- 34
  les(S, 'caching-in-node-memory-cache-redis-and-cache-aside', 'Caching in Node: Memory Cache, Redis and the Cache-Aside Pattern', 'Caching in Node: Memory, Redis, Cache-Aside',
    'Speed up a Node.js API with the cache-aside pattern, time-to-live expiry and invalidation, first with a memory cache and then with Redis for several servers.', [
    P("The fastest database query is the one you do not run. **Caching** means keeping a copy of an answer close at hand, so the next person who asks the same question gets it at once. A product page that 10,000 people view an hour does not need 10,000 database queries, only a few. Caching is also famous for being hard, because a copy can become wrong. This lesson teaches the one pattern that you will use most, and the rules for keeping it honest."),
    H("The cache-aside pattern"),
    P("*Cache-aside* works in three steps. First, look in the cache. If the answer is there, a **hit**, return it. If not, a **miss**, load it from the database, store it in the cache with a lifetime, and return it. Your code controls the cache, and the cache never needs to know about the database."),
    C('js', code('ca35-cache.js')),
    P("The file has two caches with the same three methods, `get`, `set` and `del`. `memoryCache` keeps values in a `Map` inside your process and can run anywhere. `redisCache` wraps a Redis client. Because both offer the same methods, `cachedProductService` works with either, which is dependency injection again. The lifetime, **time to live** (TTL), is in seconds, and after that the entry is considered expired and the next request refills it. The memory cache takes `now` as a parameter so that a test can move the clock instead of waiting."),
    SETUP('', ['Save the code as `cache.js`. The test uses only Node. For the Redis version you also need a Redis server and `npm install redis`.']),
    C('js', code('ca35.test.js')),
    C('text', 'ok 1 - hit, miss, expiry and invalidation'),
    P("The test checks four things: the first read is a miss and goes to the database, the second is a hit and does not, the value expires after the TTL, and after the product is changed, its cache entry is **deleted** so that the next read loads the new value."),
    H("Memory cache or Redis?"),
    P("A cache inside the process is the fastest and simplest, and it is fine for a single server and for data that can be a little different on each copy. But each copy of a server has its **own** cache, the cache disappears on restart, and deleting an entry on one copy does not delete it on the others. **Redis** is a separate, very fast, in-memory data store that all your copies share. It is also used for sessions, rate limiting counters, queues and real-time messaging, so it earns its place in most mid-sized systems."),
    H("The hard part: invalidation"),
    L("**Use short TTLs** for data that is allowed to be slightly old, such as a product list. Even 30 seconds removes most of the load.", "**Delete on change.** When you update or delete a record, delete its cache key at once, as the test does.", "**Cache only what is safe to share.** Never cache one user's private data under a key that another user could hit.", "**Beware of a stampede.** When a popular key expires, many requests may miss together and hit the database at the same moment. Short random variation in TTL, or a lock so that only one request refills it, reduces this.", "**Measure.** Count hits and misses. A cache with a low hit rate is only extra complexity."),
    PARTLY('the Redis cache, which needs a running Redis server,'),
    ...task("Add a `stats()` function to the memory cache that returns hits and misses.", "Cache the result of a list route for 30 seconds, and clear it when a product is added.", "Add a little random jitter to each TTL."),
    ...check("The second read does not call the database.", "An update removes the old value from the cache.", "You can explain why two servers cannot share a memory cache."),
  ], A('Cache-aside, step by step', [
    n('req', 'Request', 'asks for product 7', 0, 0, 'user'), n('cache', 'Cache', 'memory or Redis', 1, 0, 'tool'),
    n('db', 'Database', 'only on a miss', 2, 0, 'store'), n('inv', 'Invalidate', 'delete on update', 3, 0, 'check'),
  ], [
    { say: 'A request asks for a product.', on: ['req'] },
    { say: 'The service looks in the cache first. A hit returns at once.', flow: ['req>cache:get'] },
    { say: 'On a miss it loads from the database and stores the value with a lifetime.', flow: ['cache>db:miss'] },
    { say: 'When the product changes, its cache entry is deleted so nobody sees old data.', flow: ['db>inv:update'] },
  ]), [
    faq('What is TTL?', 'Time to live: how long a cached value is kept before it counts as expired and must be loaded again.'),
    faq('Is Redis a database?', 'It is an in-memory data store. It can save to disk, but it is mostly used for cache, sessions, counters and queues next to a main database.'),
    faq('What is cache invalidation?', 'Removing or refreshing a cached value when the original data changes, so users do not see old data.'),
  ]),

  // ---------------------------------------------------------------- 35
  les(S, 'background-jobs-in-node-queues-retries-cron-and-bullmq', 'Background Jobs in Node: Queues, Retries, Scheduling and BullMQ', 'Background Jobs: Queues, Retries and BullMQ',
    'Move slow work out of web requests with a job queue, retries and a dead-letter list, run scheduled tasks, and see how BullMQ and Redis do the same at scale.', [
    P("Some work is too slow for a web request: sending 500 emails, making a PDF, resizing images, calling a slow API. If the user waits for it, the page feels broken and a timeout can kill the work half way. The answer is a **job queue**. The request puts a small description of the work on a list and replies at once. A separate **worker** takes the jobs one by one. This lesson shows the idea with a small queue that you can run, and then the production tool, **BullMQ**."),
    H("The idea in four words"),
    L("**Producer:** your route. It calls `queue.add(data)` and returns immediately, usually with status **202 Accepted**.", "**Queue:** a waiting list. In production it lives in Redis, so it survives a restart.", "**Worker:** code that takes a job and does the slow work.", "**Retries and dead letters:** if a job fails, try again after a delay. After the last attempt, move it to a **failed** list that a person can look at, instead of losing it."),
    C('js', code('jb36-jobs.js')),
    P("`createQueue` takes a `handler`. `add` pushes a job and returns at once. The loop inside `run` takes jobs one at a time. When the handler throws, the job's attempt count goes up, it waits a little longer each time, and goes back on the list. After `maxAttempts` it is saved in `results.failed` with the error message. That behaviour, retry with growing delay and then a failed list, is exactly what real queue systems offer."),
    SETUP('', ['Save the code as `jobs.js`. The test uses only Node.']),
    C('js', code('jb36.test.js')),
    C('text', `ok 1 - jobs run, retry and end in the failed list
ok 2 - every() repeats and stops`),
    H("Scheduled work"),
    P("Some jobs are not triggered by a user but by the clock: send a daily report, delete expired tokens, back up the database. The simplest way in Node is `setInterval`, which the `every` helper wraps. Call `unref()` on the timer so that it does not keep the process alive on its own, and always return a stop function so that tests and shutdown can clean up. For schedules such as \"every day at 02:00\", use a cron expression with a library like `node-cron`, or better, the scheduler of your platform. If you run several copies of your app, make sure **only one** of them runs a scheduled job, or you will send every email several times."),
    H("BullMQ and Redis"),
    P("A queue in the memory of your process has two flaws: jobs vanish when the process restarts, and you cannot run a worker on another machine. **BullMQ** keeps the jobs in Redis, so they survive restarts, several workers can share the load, and you get retries with backoff, delayed jobs, repeatable jobs, priorities, rate limits and a dashboard through tools such as Bull Board. The structure of the code is the same as the small version: a `Queue` to add jobs and a `Worker` that processes them."),
    C('js', code('jb36-bullmq.js')),
    PARTLY('BullMQ, which needs a running Redis server,'),
    L("Make jobs **idempotent**: running the same job twice must be safe, because a retry may repeat work that half succeeded.", "Keep job data small, such as ids, not whole documents.", "Set sensible timeouts and attempt limits, and watch the failed list.", "Shut down workers gracefully, so that a running job can finish before the process exits."),
    ...task("Make `add` return a job id, and add a `status(id)` method.", "Write a job handler that sends a welcome email by using the fake mailer from lesson 28.", "Add a delay option so that a job runs after a number of seconds."),
    ...check("A job that fails twice and then works is retried and counted as done.", "A job that always fails ends up in the failed list.", "You can explain why jobs should be idempotent."),
  ], A('The web request does not wait', [
    n('route', 'Web route', 'adds a job, replies 202', 0, 0, 'app'), n('q', 'Queue', 'in Redis in production', 1, 0, 'store'),
    n('w', 'Worker', 'does the slow work', 2, 0, 'tool'), n('f', 'Failed list', 'after the last retry', 3, 0, 'check'),
  ], [
    { say: 'The route puts a small job description on the queue and replies at once.', on: ['route'] },
    { say: 'The queue holds the job. With Redis it survives restarts.', flow: ['route>q:add'] },
    { say: 'A worker takes jobs one by one. If one throws, it is retried after a delay.', flow: ['q>w:next job'] },
    { say: 'When all attempts fail, the job is kept in a failed list for a person to inspect.', flow: ['w>f:gave up'] },
  ]), [
    faq('What does idempotent mean?', 'Doing it twice has the same result as doing it once. It matters because retries and duplicate deliveries can repeat a job.'),
    faq('Why is setInterval not enough for every schedule?', 'It runs inside one process, is lost on restart and runs on every copy of the app. Use cron or a platform scheduler for important schedules.'),
    faq('BullMQ or a database table as a queue?', 'A table is fine for low volume. BullMQ adds speed, retries, delays and monitoring when the volume or the needs grow.'),
  ]),
];
