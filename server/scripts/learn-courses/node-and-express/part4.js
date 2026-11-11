import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, SETUP, run } from './kit2.js';

const S = 'JavaScript and Node Core in Depth';

export const lessons = [
  // ---------------------------------------------------------------- 16
  les(S, 'javascript-essentials-for-node-destructuring-closures-promises-and-the-event-loop', 'JavaScript Essentials for Node: Destructuring, Closures, Promises and the Event Loop', 'JavaScript Essentials for Node Developers',
    'Review the JavaScript that Node and Express use daily: destructuring, spread and rest, closures, higher-order functions, promises and the event loop.', [
    P("Node.js is JavaScript outside the browser, so everything you know about the language applies. Express code, though, uses a particular slice of it again and again: pulling values out of objects, copying objects without changing the original, functions that return functions, and asynchronous code written with promises. If one of these feels shaky, backend code will feel confusing. This lesson is a fast review of exactly those parts, with one small file that you can run."),
    P("If you are new to JavaScript, read this lesson slowly and try each line in the REPL. If you already know the language well, skim the headings and read the last section on the event loop, because it explains why Node can serve many users at once."),
    H("Destructuring, spread and rest"),
    P("**Destructuring** takes values out of an object or array and gives them names. In Express you will write `const { title, price } = req.body` hundreds of times. **Spread** (`...`) copies the items of an object or array into a new one, which is how you change data without changing the original. **Rest** is the same three dots used the other way round, to collect the remaining items. The rule that decides which is which is simple: on the left of an assignment or in a function's parameter list it collects (rest), and everywhere else it expands (spread)."),
    SETUP('', ['Save the code below as `essentials.js` and run it with `node essentials.js`.']),
    C('js', code('js16-essentials.js')),
    run('node essentials.js'),
    C('text', `Asha Pune js [ 'sql' ]
30 29 6
count 2
[ 4, 8, 12 ]
A B
Caught: Something failed`),
    P("Look at the second line: `older.age` is 30 and `user.age` is still 29. Spread made a new object, so the original is untouched. This matters in servers, because code that quietly changes shared objects causes bugs that appear only under load."),
    H("Closures and higher-order functions"),
    P("A **closure** is a function that remembers the variables around the place where it was created. The `counter` function returns an inner function that still sees `count`, even after `counter` has finished. Closures are how middleware factories work: `rateLimit({ max: 5 })` returns a function that remembers `max`. A **higher-order function** is a function that takes another function as input or returns one. `filter`, `map` and `reduce` take functions. Express itself is built on this idea: you hand `app.get` a function and Express calls it later."),
    H("Callbacks, promises and async/await"),
    P("Slow things, such as reading a file or asking a database, must not freeze the server, so Node starts them and carries on. When the result is ready, it calls a function you provided, a **callback**. Nested callbacks quickly become hard to read, so JavaScript added **promises**: an object that stands for a value that will arrive later. `async` and `await` let you write promise code in a straight line. In the example, `Promise.all` waits for two promises at the same time, which is much faster than waiting for one and then the other. A rejected promise becomes an exception that `try/catch` can handle."),
    L("Always `await` a promise, or return it. A promise you forget about can fail silently.", "Use `Promise.all` when the tasks do not depend on each other, and `await` one by one when they do.", "Wrap awaited code in `try/catch`, or let Express 5 pass the error to your error handler."),
    H("JSON and modules"),
    P("**JSON** is text in the shape of JavaScript objects, and it is the language of APIs. `JSON.stringify` turns an object into text and `JSON.parse` turns text back into an object. Remember that JSON has no functions, no `undefined`, and no dates: a date becomes a text string. For code organisation, ES modules use `export` and `import`, which this course uses throughout. Older code uses `require`, which you will still meet in many projects."),
    H("The event loop in one picture"),
    P("JavaScript runs your code on **one thread**, which means one thing at a time. Node serves many users because slow work, such as network and disk, is handed to the operating system, and your code is called again when it finishes. The **event loop** is the part that keeps checking for finished work and runs the waiting callbacks. The practical rule is: never block the loop. A long calculation or a synchronous file read inside a request handler stops every other user until it ends. Lesson 18 shows how to move heavy work to other threads."),
    RAN,
    ...task("Change the example so that `counter` takes a starting number and a step.", "Write a function `pick(object, ...keys)` that returns a new object with only those keys.", "Make one of the two `wait` promises reject, and see what `Promise.all` and `Promise.allSettled` do."),
    ...check("Your output matches the output shown above.", "You can say whether `...` is spread or rest in any line.", "You can explain why a long synchronous loop in a handler hurts every user."),
  ], A('One thread, many users', [
    n('req', 'Requests', 'many users', 0, 0, 'user'), n('loop', 'Event loop', 'one thread', 1, 0, 'tool'),
    n('os', 'OS and libuv', 'disk and network', 2, 0, 'cloud'), n('cb', 'Callback runs', 'promise resolves', 3, 0, 'out'),
  ], [
    { say: 'Requests arrive. Node runs your handler on a single thread.', on: ['req'] },
    { say: 'When the handler starts slow work, it is handed over and the loop carries on.', flow: ['req>loop:handler runs'] },
    { say: 'The operating system does the disk or network work in the background.', flow: ['loop>os:start I/O'] },
    { say: 'When it finishes, the loop runs your callback or resumes your await.', flow: ['os>cb:done'] },
  ]), [
    faq('Is JavaScript really single-threaded?', 'Your code runs on one thread, but Node uses other threads inside for things such as file and network work, and you can start more with worker threads.'),
    faq('Should I use callbacks, promises or async/await?', 'Use async/await in new code. Callbacks still appear in older libraries, and util.promisify can turn many of them into promises.'),
    faq('What is the difference between spread and rest?', 'They look the same. Rest collects the remaining items into one variable. Spread expands items out of a variable.'),
  ]),

  // ---------------------------------------------------------------- 17
  les(S, 'node-core-modules-eventemitter-streams-buffers-os-and-process', 'Node Core Modules: EventEmitter, Streams, Buffers, os and process', 'Node Core Modules: Events, Streams, Buffers',
    'Learn the Node.js built-in modules back ends rely on: EventEmitter, streams with pipeline, Buffers, and the os and process modules.', [
    P("Node.js ships with a standard library that needs no installation, and several of its parts show up in every serious project. You have already used `fs` and `path`. This lesson adds the ones you meet next: **events** for letting parts of a program talk without knowing each other, **streams** for handling big data in small pieces, **buffers** for raw bytes, and the **os** and **process** modules for information about the machine and the running program. Express itself is built on them: a request is a readable stream, a response is a writable stream, and the server is an event emitter."),
    H("EventEmitter: announce, do not call"),
    P("An `EventEmitter` lets one part of a program announce that something happened, while other parts listen. The sender does not need to know who listens. When an order is placed, the order code announces `placed`. The email code, the stock code and the analytics code each listen and do their own work. Adding a fourth listener needs no change to the order code. That is the idea behind event-driven design, and it returns in later lessons about queues and sockets."),
    SETUP('', ['Save each example below as its own file in the same folder and run it with `node`.']),
    C('js', code('n17-events.js')),
    C('text', `Email sent for Keyboard
Stock reduced for Keyboard
First order ever!
Email sent for Mouse
Stock reduced for Mouse
Listeners: 2`),
    P("Listeners run in the order you added them, and they run **synchronously**, one after another, when you call `emit`. A listener that throws stops the others, so keep listeners small and careful. The special event name `error` is different: if you emit `error` and nobody listens, Node throws and the process can crash. Always attach an `error` listener to emitters that can fail."),
    H("Streams: big data in small pieces"),
    P("Reading a 2 GB file into memory with `readFile` could crash the server. A **stream** reads it in small chunks, passes each chunk along, and forgets it, so memory use stays small whatever the file size. There are four kinds: readable, writable, duplex and transform. A transform changes data as it passes, such as compressing or converting to upper case. `pipeline` connects streams, passes errors along, and closes everything properly. Prefer it to the older `.pipe()` method, which does not clean up when something fails."),
    C('js', code('n17-streams.js')),
    C('text', `[ 'HELLO', 'STREAMS', 'ARE', 'USEFUL' ]
<Buffer 4e 6f 64 65> 4 4e6f6465 Tm9kZQ==
Node JS`),
    P("In an Express route, `fs.createReadStream(path).pipe(res)` sends a large download without loading it, and `req` is a stream too, which is how upload libraries read big files in parts. Streams also have **backpressure**: if the receiver is slow, the sender is told to wait. `pipeline` handles this for you."),
    H("Buffers: raw bytes"),
    P("A `Buffer` is a fixed block of bytes. Files, network packets, images and encrypted data are bytes, not text. The same buffer can be read as text with `toString('utf8')`, as hexadecimal with `'hex'`, or as base64 with `'base64'`. You saw in the output that the text `Node` is four bytes, `4e 6f 64 65`. Security code uses buffers constantly, for example to compare two secrets safely, and upload code uses them to check the first bytes of a file."),
    H("os and process"),
    P("The `os` module tells you about the machine: the number of CPU cores, total and free memory, the platform. You use it to decide how many workers to start. The `process` object is the running program. `process.argv` holds the command-line words, `process.env` the environment variables, `process.exitCode` the result code, and `process.on('exit')` and `process.on('SIGTERM')` let you clean up when the program ends. A server should listen for `SIGTERM`, stop taking new requests, finish the current ones and then exit. Hosting tools send that signal when they restart your app."),
    C('js', code('n17-os-process.js')),
    C('text', `Platform: linux | Node: v22.23.4
CPU cores: true
Total memory > 0: true
Arguments after the script name: []
PORT from the environment: (not set)
Exiting with code 0`),
    P("Your platform and version will differ. Two more things to remember: global objects such as `process`, `Buffer`, `setTimeout`, `console` and `URL` need no import, and `globalThis` is the standard name for the global object. Avoid putting your own data on it."),
    RAN,
    ...task("Make the order service in the first example emit an `error` event for an empty item name and add a listener that logs it.", "Write a transform stream that turns each line into a numbered line, and use `pipeline` to process a text file.", "Run the os example with `PORT=4000 node n17-os-process.js a b c` and read the output."),
    ...check("You can explain why `pipeline` is safer than `.pipe()`.", "You can name the four kinds of streams.", "You can say why a large download should be streamed."),
  ], A('Streams keep memory small', [
    n('src', 'Readable', 'file or request', 0, 0, 'data'), n('tr', 'Transform', 'change each chunk', 1, 0, 'tool'),
    n('dst', 'Writable', 'file or response', 2, 0, 'out'), n('pipe', 'pipeline()', 'wires and cleans up', 3, 0, 'check'),
  ], [
    { say: 'A readable stream produces data in small chunks.', on: ['src'] },
    { say: 'A transform changes each chunk as it passes.', flow: ['src>tr:chunk'] },
    { say: 'A writable stream receives the chunks, and slows the sender if it is busy.', flow: ['tr>dst:chunk'] },
    { say: 'pipeline connects them, passes errors and closes everything when done.', flow: ['dst>pipe:finished'] },
  ]), [
    faq('When should I use streams instead of readFile?', 'When the data can be large or arrives over time, such as big files, uploads, downloads and logs. For small files, readFile is simpler.'),
    faq('What is backpressure?', 'A way for a slow receiver to tell a fast sender to pause, so memory does not fill up with data nobody has processed yet.'),
    faq('Why must I add an error listener to an EventEmitter?', 'An unhandled error event throws an exception, which can crash the whole process.'),
  ]),

  // ---------------------------------------------------------------- 18
  les(S, 'scaling-node-worker-threads-child-processes-and-the-cluster-module', 'Scaling Node: Worker Threads, Child Processes and the Cluster Module', 'Worker Threads, Child Processes, Cluster',
    'Use more than one CPU core in Node.js: worker threads for heavy work, child processes for other programs, and cluster to run copies of a server.', [
    P("Node runs your JavaScript on a single thread, which is fine for work that mostly waits, such as database and network calls. It is not fine for work that keeps the processor busy, such as resizing images, hashing many passwords, or a big calculation. While that runs, nobody else is served. Modern computers have many cores, and Node gives you three tools to use them. Each fits a different problem, and choosing the right one is a common interview question."),
    H("Worker threads: heavy calculations"),
    P("A **worker thread** is another JavaScript thread inside the same Node process. It has its own event loop and its own memory, and it talks to the main thread by sending messages. Use it for CPU-heavy JavaScript. The example below calculates slow Fibonacci numbers in three workers at once. The main thread only starts them and waits for the messages, so it could keep answering requests meanwhile."),
    SETUP('', ['Save the code as `worker.js` and run it with `node worker.js`.']),
    C('js', code('n18-worker.js')),
    C('text', `Results: [ 832040, 1346269, 2178309 ]`),
    P("Notice that the same file contains both sides. `isMainThread` tells which side is running. Data sent between threads is copied, not shared, except for special shared memory. Starting a worker costs a few tens of milliseconds, so for a real server you create a small **pool** of workers at start and reuse them, using a library such as Piscina. Do not start a new worker for every request."),
    H("Child processes: other programs"),
    P("A **child process** is a separate operating-system process. Use it to run another program, such as `ffmpeg` for video, a Python script, or `git`, or to run a second Node script that must be isolated. `execFile` runs a program and gives you its output. `fork` starts another Node script with a built-in message channel."),
    C('js', code('n18-child.js')),
    C('text', `Child program printed: 42
Forked child replied: { doubled: 42 }`),
    N("Security rule: never build a command from user input. `exec` runs its text in a shell, so a user who sends `; rm -rf ~` could run anything. Use `execFile` or `spawn` with the arguments as an array, and validate the values anyway."),
    H("Cluster: copies of your server"),
    P("The **cluster** module starts several copies of the same server, one per core, that share one port. The operating system or Node spreads new connections between them. If one copy crashes, the others keep serving, and the primary process can start a replacement. This is the simplest way to use all the cores for a normal web server, because each request is handled completely by one copy."),
    C('js', code('n18-cluster.js')),
    C('text', `Answers came from 2 worker process(es)`),
    P("The number may vary: the system may happen to give all four requests to the same worker. In practice you rarely write cluster code yourself. The process manager **pm2**, which lesson 42 uses, can run your app in cluster mode with one setting. Container platforms and load balancers do the same by starting several copies."),
    H("Choosing the right tool"),
    L("**Waiting work** (database, network): nothing special. The event loop already handles many at once.", "**Heavy JavaScript calculation**: worker threads, ideally from a pool.", "**Another program or language**: child process, with `execFile` and an argument array.", "**More throughput for a web server**: cluster, pm2, or more containers behind a load balancer.", "**Very heavy or slow work**: a background job queue, as in lesson 35, so the web request does not wait at all."),
    P("One warning applies to all copies of a server. Each copy has its own memory. A user logged in on copy A is unknown to copy B if you keep sessions or caches in a normal variable. Store shared state in a database or in Redis, and keep your servers stateless."),
    RAN,
    ...task("Change the worker example to take the numbers from `process.argv` and compare the time with and without workers.", "Run the child example, then change it to run `node --version` and print the result.", "Run the cluster example with three workers, and print the process id each answer came from."),
    ...check("Your outputs match the outputs above.", "You can say which tool fits an image resize, a call to ffmpeg and a normal web server.", "You can explain why an in-memory session breaks with several copies."),
  ], A('Using more than one core', [
    n('main', 'Main thread', 'serves requests', 0, 0, 'app'), n('wt', 'Worker thread', 'heavy JavaScript', 1, 0, 'tool'),
    n('cp', 'Child process', 'other programs', 2, 0, 'data'), n('cl', 'Cluster', 'copies of the server', 3, 0, 'out'),
  ], [
    { say: 'The main thread serves requests and must never be blocked.', on: ['main'] },
    { say: 'Heavy JavaScript goes to a worker thread, which reports back with a message.', flow: ['main>wt:postMessage'] },
    { say: 'Other programs run as child processes with safe arguments.', flow: ['wt>cp:execFile'] },
    { say: 'To use all cores for the web server itself, run copies with cluster or pm2.', flow: ['cp>cl:scale out'] },
  ]), [
    faq('Do worker threads share variables?', 'No. Each has its own memory and they communicate with messages, which copy the data. SharedArrayBuffer is the exception for special cases.'),
    faq('Is cluster the same as worker threads?', 'No. Cluster starts separate processes that share a port. Worker threads are threads inside one process, meant for CPU work.'),
    faq('Do I need cluster if I use Docker or Kubernetes?', 'Usually not. You run several containers and a load balancer spreads traffic, which gives the same benefit.'),
  ]),
];
