import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, PARTLY, SETUP, run } from './kit2.js';

const S = 'Architecture, Reliability and Performance';

export const lessons = [
  // ---------------------------------------------------------------- 36
  les(S, 'real-time-apps-with-websockets-and-socket-io-rooms-auth-and-notifications', 'Real-Time Apps with WebSockets and Socket.IO: Rooms, Auth and Notifications', 'Real-Time Node: WebSockets and Socket.IO',
    'Build real-time features with Socket.IO: authenticate each connection with a JWT, use private rooms, show who is online and push notifications.', [
    P("HTTP works like letters: the browser asks, the server answers, and the conversation ends. That is wrong for a chat, a live score, a delivery map or a notification bell, where the **server** must be able to speak first. **WebSockets** solve this. A WebSocket is one long-lived connection between browser and server, open in both directions, and either side can send a message at any time. This lesson uses **Socket.IO**, the most popular library for it in Node, which adds rooms, automatic reconnection and a fallback when WebSockets are blocked."),
    H("Core ideas"),
    L("**Connection:** each browser tab that connects is a `socket`. It has an id and a place to keep data.", "**Events:** you send and receive named messages with `socket.emit('name', data)` and `socket.on('name', handler)`.", "**Rooms:** groups of sockets. Sending to a room reaches everyone inside it. A room per user is a neat way to send something to one person on all their devices.", "**Broadcast:** `io.emit` goes to everyone, `io.to(room).emit` to one room."),
    H("Authenticate on connect"),
    P("A WebSocket is a door into your server, so it needs the same protection as an HTTP route. A socket must not be able to join without proving who it is. In Socket.IO you add a middleware that runs once for each new connection. The example below verifies a JWT sent in the handshake. If the token is missing or wrong, it calls `next(new Error('unauthorized'))` and the connection is refused. After that, `socket.data.user` holds the verified user id, and the code never trusts a user id sent in a message."),
    C('js', code('ws37-realtime.js')),
    P("Walk through what happens after the connection. The socket **joins a private room** named `user:<id>`. The id is added to a set of online users and everyone receives the new `presence` list. A `private-message` event is checked first: the text must be a string, not empty and at most 500 characters, because data from a client is never trusted just because it came over a socket. Then it is sent only to the room of the receiver. On `disconnect`, the user is removed from the online set only when their **last** connection closes, since a person can have a phone and a laptop open at once."),
    H("Pushing from the rest of your server"),
    P("The function returns `notify(userId, payload)`. It lets any other part of your server, such as an Express route, a payment webhook or a background job, send a real-time notification to one user without knowing anything about sockets. When lesson 35's worker finishes a report, it can call `notify` and a bell appears in the browser. This is how most apps combine a normal HTTP API with real-time features: HTTP for requests, sockets for pushes."),
    SETUP('socket.io jsonwebtoken', ['Save the code as `realtime.js`. The test needs `npm install -D socket.io-client`.']),
    C('js', code('ws37.test.js')),
    C('text', 'ok 1 - auth, private messages and notifications'),
    P("The test connects without a token and is refused, connects two users, sends a private message from one to the other, checks that a third user does not receive it, and calls `notify`."),
    H("Scaling sockets"),
    P("Sockets are **stateful**: a connection lives on one server process. With two copies of your app, a message emitted on copy A does not reach a user connected to copy B. The fix is an **adapter**, usually the Redis adapter for Socket.IO, which passes events between the copies. You also need a load balancer that keeps a client on the same server during the connection (*sticky sessions*) when the long-polling fallback is used. Without these, real-time features work in development and break in production."),
    RAN,
    ...task("Add a `typing` event that tells the other user that someone is typing.", "Add a room per chat group, and let a user join only the groups that they belong to.", "Limit the number of messages per second for each socket."),
    ...check("A connection without a token is refused.", "A private message reaches only its receiver.", "You can explain why presence is removed only when the last connection closes."),
  ], A('Authenticated real time', [
    n('b', 'Browser', 'sends JWT in handshake', 0, 0, 'user'), n('mw', 'Auth middleware', 'verify or refuse', 1, 0, 'check'),
    n('room', 'Private room', 'user:id', 2, 0, 'store'), n('push', 'notify()', 'from routes or jobs', 3, 0, 'out'),
  ], [
    { say: 'The browser opens a socket and sends its token in the handshake.', on: ['b'] },
    { say: 'The server verifies the token once. A bad token means the connection is refused.', flow: ['b>mw:token'] },
    { say: 'Each verified user joins a private room, so messages can target one person on all devices.', flow: ['mw>room:join'] },
    { say: 'Other server code calls notify to push to that room without knowing about sockets.', flow: ['room>push:emit'] },
  ]), [
    faq('WebSocket or Socket.IO?', 'WebSocket is the browser standard. Socket.IO builds on it and adds rooms, reconnection, fallbacks and acknowledgements, at the cost of using its own protocol on both sides.'),
    faq('Do I authenticate every message?', 'You authenticate the connection once, and keep the verified user on the socket. Still validate the content of every message.'),
    faq('Why does real time break when I run two servers?', 'A socket lives on one process, so events must be shared between processes, for example with the Redis adapter.'),
  ]),

  // ---------------------------------------------------------------- 37
  les(S, 'payment-integration-basics-server-side-prices-webhooks-and-idempotency', 'Payment Integration Basics: Server-Side Prices, Webhooks and Idempotency', 'Payments: Prices, Webhooks, Idempotency',
    'Integrate payments safely: calculate prices on the server in cents, let the provider take card data, and mark orders paid only from a signed webhook.', [
    P("Payments are where mistakes cost real money, so this is the lesson to read slowly. The good news is that the safe design is simple, and almost every provider, Razorpay, Stripe, PayPal and others, works the same way. Learn the pattern once and the provider's own documentation becomes easy to follow."),
    H("Four rules"),
    L("**Money is a whole number of the smallest unit.** Use paise or cents, `1999`, not `19.99`. Decimals can drift.", "**The server decides the price.** The browser sends *what* the user wants, such as a product code and a quantity, never *how much*. A client that sends a price can send any price.", "**The provider takes the card.** Card numbers must never touch your server, which keeps you out of heavy compliance rules. You receive a payment link or token instead.", "**An order becomes paid only when a verified webhook says so.** The user coming back to your site with `?success=true` proves nothing, because anyone can type that URL."),
    P("Here is the flow. The browser asks to create an order. Your server calculates the total from **your own catalogue**, saves the order as `pending`, asks the provider to create a payment for that amount, and returns a payment URL. The user pays on the provider's page. The provider then calls your **webhook** with a signed message. Your server verifies the signature, finds the order, checks that the amount matches, and only then marks it `paid`."),
    C('js', code('pay38-payments.js')),
    P("Notice three details in the code. The webhook route comes **before** `express.json()` and uses `express.raw`, because the signature is calculated over the exact raw bytes. Next, the signature is compared with `timingSafeEqual`, as in lesson 23. Last, `seenEvents` makes the handler **idempotent**: providers resend an event when they do not receive a quick 200, so the same event can arrive twice, and you must not process it twice. In a real system you would store event ids in the database with a unique index."),
    SETUP('express', ['Save the code as `payments.js`. The test needs `npm install -D supertest`. It uses a fake payment provider, so no account is needed.']),
    C('js', code('pay38.test.js')),
    C('text', 'ok 1 - server computes the price and only a signed webhook marks it paid'),
    P("The test creates an order whose price comes from the catalogue even though the client tries to send its own, checks that the order is `pending`, sends a webhook with a bad signature and gets 400, sends a correct one and sees `paid`, and sends the same event again to confirm that it is recognised as a duplicate."),
    H("Other things a real integration needs"),
    L("**Refunds and failures:** handle `payment.failed` and refund events, and show a clear state to the user.", "**Amounts must match.** The code compares the paid amount with the order total. Without this a cheap payment could pay for an expensive order.", "**Test mode first.** Every provider has a sandbox with test card numbers. Use it until the whole flow works, including failures.", "**Keep records.** Store the provider's payment id on your order so that you can match it with their dashboard.", "**Legal and tax rules:** invoices, taxes and refunds are governed by the law of your country. Ask an accountant or lawyer, and read the provider's own rules."),
    N("This lesson uses a fake provider so that you can run everything. Each real provider has its own library, field names and signature header. Follow its current documentation for those details, and do not copy this code straight into a live shop."),
    RAN,
    ...task("Add a `payment.refunded` event that sets the order to `refunded`.", "Reject an order that asks for more than 10 of one item.", "Store the provider payment id on the order and show it in `GET /orders/:id`."),
    ...check("A price sent by the client is ignored.", "A webhook with a bad signature returns 400.", "Sending the same webhook twice changes nothing the second time."),
  ], A('The order becomes paid only by webhook', [
    n('b', 'Browser', 'sends items only', 0, 0, 'user'), n('srv', 'Your server', 'price from catalogue', 1, 0, 'app'),
    n('prov', 'Provider', 'takes the card', 2, 0, 'cloud'), n('wh', 'Signed webhook', 'verify, match, once', 3, 0, 'check'),
  ], [
    { say: 'The browser says what it wants. It never says what it costs.', on: ['b'] },
    { say: 'The server computes the total in cents and saves a pending order.', flow: ['b>srv:items'] },
    { say: 'The provider shows the payment page and takes the card. Card data never reaches your server.', flow: ['srv>prov:create payment'] },
    { say: 'The provider calls your webhook. A verified, matching, first-time event marks the order paid.', flow: ['prov>wh:payment.succeeded'] },
  ]), [
    faq('Why not trust the success page after payment?', 'Anyone can open that URL by hand. Only a signed message from the provider, received by your server, proves that money moved.'),
    faq('Why must the server set the price?', 'A browser can send any value. If the server accepted the price, a user could pay one rupee for any product.'),
    faq('What if the webhook arrives twice?', 'Providers retry, so keep the event ids you have seen and ignore repeats. That is idempotency.'),
  ]),

  // ---------------------------------------------------------------- 38
  les(S, 'scaling-node-apps-microservices-load-balancing-and-health-checks', 'Scaling Node Apps: Microservices, Load Balancing and Health Checks', 'Scaling Node: Microservices, Load Balancing',
    'Learn when to split an app into microservices, how a load balancer spreads traffic and skips sick copies with health checks, and what stateless means.', [
    P("A popular app gets slow. The first reaction is often *we need microservices*, and that is usually the wrong first step. This lesson explains the real options for handling more traffic, in the order that you should try them, and shows the central trick of scaling, a **load balancer** that spreads requests over several copies, in a small running example."),
    H("Scale up, scale out"),
    P("**Scaling up** means a bigger machine, with more CPU and memory. It is the easiest change, and it works until the machine is the largest available or too expensive. **Scaling out** means more machines, or more copies, sharing the load. It has no hard ceiling, but your app must be ready for it. Before either, measure: many slow apps are really slow queries, a missing index or no caching, and fixing those is much cheaper than new servers."),
    H("Stateless servers"),
    P("To scale out, every copy of the app must be **interchangeable**. A request can go to any copy and get the same result. That means no important data in the memory of one copy: sessions, caches, uploaded files and counters must live in a shared place such as the database, Redis or cloud storage. If a copy can be killed and replaced at any moment without losing anything, your design is **stateless**, and scaling and deployment both become easy."),
    H("The load balancer"),
    P("A **load balancer** sits in front of the copies. Clients talk to it, and it forwards each request to one copy. The simplest rule is **round robin**: the first request goes to copy 1, the next to copy 2, then 3, and back to 1. A good balancer also runs **health checks**: every few seconds it asks each copy `GET /health`. A copy that does not answer with 200 is taken out of rotation until it recovers, so users never see it. nginx, HAProxy and cloud balancers all do this. The example is a miniature version in about thirty lines."),
    C('js', code('ms39-scale.js')),
    SETUP('', ['Save the code as `scale.js`. The test uses only Node.']),
    C('js', code('ms39.test.js')),
    C('text', 'ok 1 - round robin, and a sick copy is skipped'),
    P("The test starts three small services and sends six requests, and sees that the answers rotate among the three. Then it makes one service unhealthy and sends more requests, and shows that the sick copy never answers. Finally, if every copy is unhealthy, the balancer throws an error, which a real system turns into a 503."),
    H("Microservices: when and why not"),
    P("A **microservice** architecture splits one large app into several small services, each with its own code, its own database and its own deployment, talking over HTTP or a message queue. The benefits are real: teams can work and deploy independently, and each part can scale on its own. The costs are real too: network calls can fail, data is spread over several databases, debugging crosses many logs, and you need tooling for deployment and monitoring. Many successful companies run a well-organised **modular monolith**, one deployable app with clear internal boundaries, until size or team structure makes splitting worth the pain. Project 10 in this course builds a small two-service example so that you can feel both the benefit and the cost."),
    L("Measure first: slow queries, missing indexes and no caching are the common causes.", "Make the app stateless, so any copy can serve any request.", "Add a health route that checks real dependencies, such as the database.", "Run at least two copies behind a load balancer, and deploy one at a time.", "Split into services only when a clear need, such as team size or very different scaling, pays for the extra complexity."),
    RAN,
    ...task("Change the balancer to choose the copy with the fewest active requests.", "Make `/health` return 503 when the database ping fails.", "Write down which parts of your own project are not stateless yet."),
    ...check("The answers rotate among the copies.", "A sick copy receives no traffic.", "You can name two costs of microservices."),
  ], A('Many copies, one front door', [
    n('c', 'Clients', 'one address', 0, 0, 'user'), n('lb', 'Load balancer', 'round robin', 1, 0, 'tool'),
    n('a', 'Copy A and B', 'stateless', 2, 0, 'app'), n('sh', 'Shared store', 'DB, Redis, files', 3, 0, 'store'),
  ], [
    { say: 'Clients know one address. They do not know how many copies exist.', on: ['c'] },
    { say: 'The balancer picks a copy for each request and skips any that fail the health check.', flow: ['c>lb:request'] },
    { say: 'Any copy can answer, because none of them keeps important data in its own memory.', flow: ['lb>a:forward'] },
    { say: 'Sessions, caches and files live in shared stores that every copy can reach.', flow: ['a>sh:read and write'] },
  ]), [
    faq('Should my first project use microservices?', 'No. Start with one well-organised app. Split later if team size or scaling needs justify the extra complexity.'),
    faq('What is a health check?', 'A small route, often /health, that a balancer calls to see if a copy is working, so it can stop sending traffic to a broken one.'),
    faq('What does stateless mean?', 'No copy keeps important data only in its own memory, so any copy can handle any request and can be replaced at any time.'),
  ]),

  // ---------------------------------------------------------------- 39
  les(S, 'node-performance-memory-leaks-and-blocking-the-event-loop', 'Node Performance: Memory Leaks and Blocking the Event Loop', 'Node Performance: Memory Leaks and Blocking',
    'Find and fix two classic Node.js performance problems: memory that grows forever and code that blocks the event loop, with two small programs that show both.', [
    P("When a Node app is slow, the cause is nearly always one of a few things: a slow database query, too many sequential calls that could run together, memory that grows until the process is killed, or code that blocks the event loop. The first two are about your design. This lesson covers the last two, which are Node-specific and which interviewers ask about often. Each has a small program that makes the problem visible."),
    H("Memory leaks"),
    P("Node cleans memory with a **garbage collector**, which frees anything that nothing refers to. A **leak** is memory that you no longer need but still refer to, so it is never freed. The heap grows slowly until the process becomes slow and finally dies with an out-of-memory error, often at the worst hour. The usual causes are: a global array or object that only grows, such as a cache without a size limit; event listeners added again and again and never removed; timers that are never cleared; and closures that hold large objects."),
    C('js', code('pf40-memory.js')),
    SETUP('', ['Save the code as `memory.js` and run it with `node --expose-gc memory.js`. The flag lets the program ask for garbage collection, so the numbers are steady.']),
    C('text', `Leaky cache grew the heap by more than 50 MB: true
Bounded cache stays small (under 20 MB more): true
Bounded size: 100`),
    P("The program does the same work twice. The leaky version stores every result in a `Map` that never forgets, and the heap grows by tens of megabytes. The bounded version keeps at most 100 entries and throws away the oldest, so the heap stays flat. The fix for most leaks is exactly that: **put a limit on anything that grows**, use a cache with a maximum size and an expiry, and remove listeners and timers when you are done with them."),
    H("How to look for a leak in a real app"),
    L("Watch the memory of the process over time, with `process.memoryUsage()` or your monitoring tool. A line that only goes up is the sign.", "Start the app with `node --inspect`, open `chrome://inspect`, and take **heap snapshots** at two moments. Compare them to see which objects increased.", "Look at what you store in module-level variables. A `Map` or array at the top of a file lives as long as the process.", "Check that every `on` has a matching `off`, and every `setInterval` has a `clearInterval`."),
    H("Blocking the event loop"),
    P("The event loop runs your JavaScript one piece at a time. A piece that runs for 300 milliseconds means that **every other request waits 300 milliseconds**. Common culprits are huge `JSON.parse` calls, heavy loops, synchronous file functions such as `readFileSync` in a handler, slow regular expressions, and password hashing with a synchronous function. The program below starts a timer that should tick every 10 milliseconds, runs a heavy loop, and measures how long the loop kept the timer waiting."),
    C('js', code('pf40-blocking.js')),
    C('text', 'The event loop was stuck for about 300 ms: true'),
    P("Your exact number will differ. The remedy depends on the cause. Use asynchronous versions of functions. Break a big job into smaller pieces that give the loop a turn between them. Move real CPU work to a worker thread, as in lesson 18, or to a background queue, as in lesson 35. Use the asynchronous `bcrypt.hash`, not a synchronous version. And measure: `perf_hooks` can report the event loop delay in production, and a rising delay is an early warning."),
    H("Other quick wins"),
    L("Run independent calls together with `Promise.all`.", "Turn on compression, for example with the `compression` package, or let nginx do it.", "Add indexes and use `lean()` or limited fields in database queries.", "Cache repeated answers, as in lesson 34.", "Set `NODE_ENV=production`."),
    RAN,
    ...task("Run the memory program again with a limit of 10 and with a limit of 10,000 and compare.", "Change the blocking loop to run in pieces, using `setImmediate` between them, and see the stuck time fall.", "Print `process.memoryUsage().heapUsed` every second in one of your own servers for a minute."),
    ...check("You can explain why an unbounded Map is a leak.", "You can say what blocks the event loop.", "You can name two fixes for blocking."),
  ], A('Two ways a Node app slows down', [
    n('leak', 'Leak', 'memory only grows', 0, 0, 'data'), n('lim', 'Limit it', 'max size, expiry, off()', 1, 0, 'check'),
    n('blk', 'Blocking', 'one long task', 2, 0, 'app'), n('fix', 'Move it', 'pieces, worker, queue', 3, 0, 'tool'),
  ], [
    { say: 'A leak keeps references to data nobody needs, so the garbage collector cannot free it.', on: ['leak'] },
    { say: 'The fix is a limit: bounded caches, expiry times, removed listeners and cleared timers.', flow: ['leak>lim:fix'] },
    { say: 'Blocking is a long synchronous task. Every other request waits behind it.', flow: ['lim>blk:next problem'] },
    { say: 'Split the work, use a worker thread or move it to a background queue.', flow: ['blk>fix:fix'] },
  ]), [
    faq('How do I know if my app has a memory leak?', 'Watch memory over time. If it keeps rising and never falls back after garbage collection, there is probably a leak. Heap snapshots show which objects grow.'),
    faq('Is readFileSync always bad?', 'Not at start-up, for example reading config once. Inside a request handler it blocks every other user, so use the asynchronous version there.'),
    faq('What is event loop delay?', 'How late the loop runs a timer that should be on time. A rising delay means something is blocking it.'),
  ]),
];
