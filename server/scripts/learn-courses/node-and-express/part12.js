import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code } from './files.js';
import { RAN, SETUP, run } from './kit2.js';

const SJ = 'JavaScript Fundamentals';

export const jsBasics = [
  les(SJ, 'javascript-basics-variables-data-types-and-operators', 'JavaScript Basics: Variables, Data Types and Operators', 'JavaScript Variables, Types and Operators',
    'Start JavaScript from zero: let and const, strings, numbers, booleans, null and undefined, operators, strict equality, truthy and falsy values.', [
    P("Node.js and Express are written in JavaScript, so this is where the course really begins. If you have never programmed, do not worry. We will move slowly, run every example, and explain each word the first time it appears. JavaScript is the language of the web: it started in browsers to make pages interactive, and Node.js lets the same language run on a server. Learn it once and you can build the front end and the back end of an app."),
    P("A program is a list of instructions for a computer. Most instructions work with **data**, so the first thing to learn is how to store data and what kinds of data exist. Think of a variable as a labelled box. The label is the name, and the box holds a value. When you need the value, you use the label."),
    H("Variables: let and const"),
    P("You make a variable with `const` or `let`. Use `const` when the value will not be given a new value, and `let` when it will. Start with `const` for everything, and change to `let` only when you need to. There is also an old keyword, `var`, that you will see in old code. Avoid it, because it behaves in surprising ways. A variable name must start with a letter, an underscore or a dollar sign, cannot contain spaces, and is case sensitive: `price` and `Price` are different names. By habit, programmers write names in camelCase, such as `totalPrice`."),
    H("The basic data types"),
    L("**String:** text, written in quotes, such as `'Node.js'`.", "**Number:** whole and decimal numbers. JavaScript uses one type for both, so `10` and `10.5` are both numbers.", "**Boolean:** only `true` or `false`. Booleans answer yes-or-no questions.", "**null:** a value that means *empty on purpose*, like an empty box that you labelled yourself.", "**undefined:** the value that a variable has before you give it one. It means *nothing was set yet*.", "**BigInt:** whole numbers too large for a normal number. You rarely need it.", "**Objects and arrays:** collections of values. Later lessons cover them."),
    SETUP('', ['Save the code below as `basics.js` and run it with `node basics.js`.']),
    C('js', code('jsb01-basics.js')),
    run('node basics.js'),
    C('text', `Node.js 125 499.5 true null undefined
string number boolean object undefined bigint
10 4 21 3.5 1 32
53 2
true false
false
true
[
  false, false, false,
  false, false, true,
  true,  true,  true
]
Guest 
undefined
Node.js has 125 students`),
    P("Read the output line by line. The second line shows the result of `typeof`, an operator that tells you the type of a value. Notice that `typeof null` says `object`. That is an old mistake in the language that cannot be fixed without breaking old websites, so just remember it."),
    H("Operators"),
    P("Operators are small symbols that do work. The arithmetic operators are `+`, `-`, `*`, `/`, `%` (the remainder after division) and `**` (power). In the output, `7 % 2` is 1 because 7 divided by 2 leaves a remainder of 1. The line `'5' + 3` gives `53`, because when one side of `+` is text, JavaScript joins the two as text. But `'5' - 3` gives `2`, because `-` only works with numbers, so it turns the text into a number first. This kind of automatic conversion is called **type coercion**, and it is the cause of many beginner bugs. The best protection is to convert values on purpose, with `Number('5')`, and to use strict equality."),
    P("There are two ways to compare for equality. `==` is *loose*: it converts the types first, so `5 == '5'` is true. `===` is *strict*: it also compares the types, so `5 === '5'` is false. Always use `===` and `!==`. You will almost never need the loose version. Another famous surprise appears in the output too: `0.1 + 0.2 === 0.3` is `false`, because computers store many decimal fractions only approximately. That is why, in the payment lessons of this course, money is stored as whole numbers of cents."),
    H("Truthy and falsy"),
    P("When you put any value in a condition, JavaScript treats it as true or false. The values that count as false are called **falsy**: `false`, `0`, the empty string `''`, `null`, `undefined` and `NaN` (short for *not a number*). Everything else is **truthy**, including the text `'hello'`, the number 42, and even an empty array `[]` or an empty object `{}`. The output above shows exactly which values are false, in the same order as the list."),
    H("Safe defaults: ||, ?? and ?."),
    P("Backend code constantly deals with missing values, such as a query string that was not sent. The `||` operator gives a default when the left side is falsy, so an empty text becomes `'Guest'`. The newer `??` operator gives a default only when the left side is `null` or `undefined`, so an empty text stays empty. Choose `??` when `0` or an empty string are valid values. The `?.` operator, called *optional chaining*, reads a property only if the thing before it exists. In the example, `user.profile?.city` gives `undefined` instead of crashing, while `user.profile.city` would throw an error because `profile` is `null`."),
    P("Finally, **template strings** use backticks and `${}` to place values inside text: `` `${course} has ${students} students` ``. They are the clean way to build messages, URLs and log lines, so you will use them everywhere."),
    RAN,
    H('Common mistakes'),
    L("Using `=` when you mean `===`. A single `=` stores a value, and three compare.", "Forgetting that `+` joins text. Convert input with `Number()` before you calculate.", "Using `let` for everything. Prefer `const` so that accidental changes become errors.", "Comparing decimals with `===`. Round them first or store whole numbers."),
    ...task("Change the code so that `students` goes up by 10 and print a message with a template string.", "Predict the output of `'10' * '2'`, `'10' + '2'` and `true + 1`, then run them.", "Write a line that uses `??` to print `'unknown'` when `city` is `null`, but `''` when `city` is an empty string."),
    ...check("You can explain the difference between `const` and `let`.", "You can name the six falsy values.", "You can say why `0.1 + 0.2 === 0.3` is false."),
  ], A('Values, labels and types', [
    n('v', 'Variable', 'a labelled box', 0, 0, 'store'), n('t', 'Data type', 'string, number, boolean', 1, 0, 'data'),
    n('op', 'Operator', 'does the work', 2, 0, 'tool'), n('cond', 'Truthy or falsy', 'decides conditions', 3, 0, 'check'),
  ], [
    { say: 'A variable is a name that holds a value. const cannot be reassigned, let can.', on: ['v'] },
    { say: 'Every value has a type, such as text, number or boolean.', flow: ['v>t:holds'] },
    { say: 'Operators combine values. Watch for + joining text and for strict equality ===.', flow: ['t>op:use'] },
    { say: 'In a condition every value counts as truthy or falsy. Know the six falsy ones.', flow: ['op>cond:result'] },
  ]), [
    faq('Should I use var?', 'No. Use const by default and let when the value must change. var has confusing rules and is only in old code.'),
    faq('What is the difference between null and undefined?', 'undefined means nothing was set yet. null means empty on purpose. Both are falsy.'),
    faq('Why use === instead of ==?', '=== compares the type as well, so it avoids surprises from automatic type conversion.'),
  ]),

  les(SJ, 'javascript-conditions-and-loops-if-switch-for-while', 'JavaScript Conditions and Loops: if, switch, for and while', 'JavaScript Conditions and Loops',
    'Learn how JavaScript makes decisions and repeats work: if and else, switch, the ternary operator, for, while, for of, for in, break and continue, with output.', [
    P("A program that only runs from the first line to the last is not very useful. Real programs make decisions, such as *is this user an admin?*, and repeat work, such as *send an email to every customer*. In JavaScript, decisions are made with **conditions** and repetition is done with **loops**. Together with variables, they are the whole foundation of programming. A server uses them constantly: every route checks conditions, and every list of results is walked through with a loop."),
    H("Conditions: if, else if and else"),
    P("An `if` statement runs a block of code only when its condition is true. You can add `else if` for more choices and `else` for the case when nothing matched. JavaScript checks the conditions from top to bottom and runs only the first block that matches. That is why the grade function below checks the highest score first. If it checked `score >= 50` first, every pass would become a `C`."),
    SETUP('', ['Save the code as `flow.js` and run it with `node flow.js`.']),
    C('js', code('jsb02-flow.js')),
    run('node flow.js'),
    C('text', `A B C Fail
weekend weekday
adult
Sum 1..5 = 15
First power of 2 above 100: 128
tool: node
tool: express
tool: mongo
name = Asha
city = Pune
odd 1
odd 3
odd 5`),
    P("Notice the `return` statements in `grade`. When a function returns, it stops, so the lines after it do not run. Many programmers use this to write **early returns**: handle the unusual cases first and return, and keep the normal path flat and readable. You will see early returns in every Express route that checks input first."),
    H("switch and the ternary operator"),
    P("When you compare one value against many exact choices, `switch` can be tidier than a long chain of `else if`. Each `case` is a possible value. Without a `return` or `break`, JavaScript *falls through* into the next case, which the example uses on purpose so that both `'Sat'` and `'Sun'` give the same answer. The `default` case runs when nothing matched. The **ternary operator**, `condition ? a : b`, is a one-line choice between two values. It is good for simple choices and hard to read when nested, so do not nest it."),
    H("Loops"),
    P("A loop repeats a block of code. The classic `for` loop has three parts in its brackets: where to start, when to continue, and how to step. `for (let i = 1; i <= 5; i++)` starts at 1, continues while `i` is at most 5, and adds 1 each round. A `while` loop only has a condition, and it is the right tool when you do not know in advance how many rounds are needed. Be careful: if the condition never becomes false, the loop never ends and freezes your program, which is called an **infinite loop**. In the example, `while (true)` is made safe with `break`, which ends the loop at once. `continue` is the opposite: it skips the rest of the current round and goes to the next."),
    P("For walking through a collection, use `for...of` for arrays, which gives you the values one by one, and `for...in` for the keys of an object. A common beginner mistake is to use `for...in` on an array. It gives you the index numbers as text, and can include surprising extras, so use `for...of` for arrays. Later you will meet array methods such as `map` and `filter`, which do most loop work in a shorter way."),
    H("Where you use this in a back end"),
    L("A route checks `if (!user) return res.status(404)...` before it does the real work.", "A `switch` on `req.method` or on an event name decides what to do.", "A loop turns a list of database rows into a list of JSON objects.", "A `while` loop can retry a failed network call a few times."),
    N("Do not run a loop that waits for something on the same thread, such as a loop that checks a flag forever. Node has one thread, and a loop that never gives it back stops the whole server. Lesson 44 explains this."),
    RAN,
    H('Common mistakes'),
    L("Writing `if (x = 5)` with one `=`. It stores 5 instead of comparing.", "Forgetting `break` in a `switch`, so the code falls through.", "An off-by-one error: using `<` when you meant `<=`, or starting from 1 instead of 0.", "Changing the array while you loop over it."),
    ...task("Add a grade `A+` for scores of 98 or more.", "Write a loop that prints the multiplication table of 7 from 1 to 10.", "Write a `while` loop that doubles a number until it passes 1000 and counts the rounds."),
    ...check("Your output matches the output above.", "You can say when `switch` falls through.", "You can explain how a `while (true)` loop ends."),
  ], A('Decide, then repeat', [
    n('c', 'Condition', 'true or false', 0, 0, 'check'), n('br', 'Branch', 'if, else if, else', 1, 0, 'tool'),
    n('lp', 'Loop', 'for, while, for of', 2, 0, 'app'), n('out', 'Result', 'one run per item', 3, 0, 'out'),
  ], [
    { say: 'A condition is an expression that is true or false.', on: ['c'] },
    { say: 'if, else if and else choose one block. The first match wins.', flow: ['c>br:choose'] },
    { say: 'A loop repeats a block. break ends it early and continue skips a round.', flow: ['br>lp:repeat'] },
    { say: 'Each round produces a result, such as one line or one object in a list.', flow: ['lp>out:each item'] },
  ]), [
    faq('When should I use switch instead of if?', 'When you compare one value against several exact choices. For ranges and complex conditions, use if and else if.'),
    faq('What is an infinite loop?', 'A loop whose condition never becomes false, so it never ends. Make sure that something inside changes the condition, or use break.'),
    faq('for...of or for...in?', 'Use for...of for the values of an array. Use for...in for the keys of an object.'),
  ]),

  les(SJ, 'javascript-functions-arrays-objects-and-array-methods', 'JavaScript Functions, Arrays, Objects and Array Methods', 'JavaScript Functions, Arrays and Objects',
    'Write functions and arrow functions, work with arrays and objects, and use map, filter, find, reduce and sort to process lists of data.', [
    P("Almost everything that a back end does is: take some data in, change it in some way, and send some data out. **Functions** are the reusable pieces that do the changing, and **arrays** and **objects** are the shapes that the data takes. A list of orders is an array of objects. A request body is an object. If you are comfortable with these three things, reading Express code will feel natural. This lesson also covers the array methods that replace most loops in modern JavaScript."),
    H("Functions"),
    P("A function is a named block of code that you can run again and again, optionally giving it inputs, called **parameters**, and getting an output back with `return`. Without `return` a function gives back `undefined`. You can give a parameter a **default value**, as in `add(a, b = 0)`, which is used when the caller leaves that argument out. An **arrow function**, written `(a, b) => a * b`, is a shorter way to write a function. With one expression, you can leave out the braces and the `return`, and the result is returned automatically. Arrow functions are the style used in most Express code, for route handlers and for array methods. There is one more reason to know functions well: in JavaScript they are values. You can store one in a variable, pass it to another function, and return it from a function. Express uses this idea all the time: `app.get('/', handler)` hands your function to Express, and Express calls it later."),
    H("Arrays and objects"),
    P("An **array** is an ordered list, written with square brackets. Positions start at 0, so the first item is `list[0]`. Useful basics are `push` to add at the end, `pop` to remove the last item, `slice` to copy a part, and `length` for the size. An **object** is a set of named values, written with curly braces: `{ name: 'Pen', price: 10 }`. You read a value with `product.name`, add one by assigning to it, and remove one with `delete`. `Object.keys` and `Object.entries` list the names and the pairs. The JSON that APIs send and receive is just text in the shape of objects and arrays."),
    SETUP('', ['Save the code as `arrays.js` and run it with `node arrays.js`.']),
    C('js', code('jsb03-functions-arrays.js')),
    run('node arrays.js'),
    C('text', `5 2 20 36
[ 'Keyboard', 'Mouse', 'Monitor', 'Cable' ]
3
Monitor
true true
11200
[ 'Monitor', 'Keyboard', 'Mouse', 'Cable' ]
true 2
{ name: 'Pen', stock: 50 } [ 'name', 'stock' ] [ [ 'name', 'Pen' ], [ 'stock', 50 ] ]
true undefined
d [ 'b', 'c' ] [ 'a', 'b', 'c' ]`),
    H("The array methods you will use every day"),
    L("**`map`** makes a new array by changing every item. It is how you shape database rows into API replies.", "**`filter`** keeps only the items for which your function returns true. It is how you remove unpaid orders.", "**`find`** returns the first matching item, or `undefined`. **`findIndex`** returns its position.", "**`some`** and **`every`** answer yes-or-no questions about a whole list.", "**`reduce`** combines all items into one value, such as a total. It takes a starting value, here `0`.", "**`sort`** orders an array **in place**, which means it changes the original. Copy first with `[...orders]` when you must keep the original, as the example does.", "**`includes`** checks if a value is in an array."),
    P("Read the output against the code. `orders.filter((o) => o.paid).length` is 3 because three orders are paid. `reduce` adds up the prices to 11200. The sort puts the highest price first because the compare function returns a negative number when the first item should come earlier. Without a compare function, `sort` orders items as **text**, so `10` would come before `2`. That is another classic surprise."),
    H("Common mistakes"),
    L("Forgetting `return` inside the braces of an arrow function, which gives `undefined`. Without braces the return is automatic.", "Using `sort` on the original array when other code still needs it.", "Using `map` just to loop. If you do not use the new array, use `for...of` instead.", "Reading `list[list.length]`. The last item is at `list.length - 1`.", "Comparing two objects with `===`. They are equal only if they are the very same object."),
    RAN,
    ...task("Add a `discount` function and use `map` to give every paid order a discounted price.", "Use `reduce` to count how many orders are paid and how many are not, in one object.", "Write a function that takes an array of numbers and returns the largest, without using `Math.max`."),
    ...check("Your output matches the output above.", "You can explain why `sort` needs a compare function for numbers.", "You can write `map`, `filter` and `reduce` calls from memory."),
  ], A('Data in, data out', [
    n('arr', 'Array of objects', 'a list of orders', 0, 0, 'data'), n('f', 'filter', 'keep paid ones', 1, 0, 'check'),
    n('m', 'map', 'shape the reply', 2, 0, 'tool'), n('r', 'reduce', 'one total', 3, 0, 'out'),
  ], [
    { say: 'Data usually arrives as an array of objects, such as rows from a database.', on: ['arr'] },
    { say: 'filter keeps only the items that pass your test.', flow: ['arr>f:each item'] },
    { say: 'map turns each item into the shape that you want to send.', flow: ['f>m:new array'] },
    { say: 'reduce combines the items into one value, like a total.', flow: ['m>r:combine'] },
  ]), [
    faq('What is the difference between a function and an arrow function?', 'They do the same job. Arrow functions are shorter, and with one expression they return it automatically. They also treat this differently, which matters in classes.'),
    faq('Does map change the original array?', 'No. map, filter and slice return new arrays. sort and splice change the original.'),
    faq('What is the difference between an array and an object?', 'An array is an ordered list accessed by position. An object is a set of named values accessed by name.'),
  ]),

  les(SJ, 'javascript-error-handling-and-json-try-catch-throw-and-parse', 'JavaScript Error Handling and JSON: try, catch, throw and parse', 'JavaScript Error Handling and JSON',
    'Handle errors without crashing: try, catch, finally, throw, custom errors and async errors, and learn how JSON.stringify and JSON.parse work.', [
    P("Things go wrong in real programs. A user types text where a number is needed, a file does not exist, a network call fails. A beginner program crashes. A professional program **expects** problems and decides what to do about each one. In a server, the difference matters a lot: one uncaught error in a handler must not take the site down for everyone. This lesson covers how JavaScript reports errors and how you catch them, and also JSON, the text format that nearly every API uses."),
    H("throw, try, catch and finally"),
    P("To report a problem yourself, you **throw** an error: `throw new Error('message')`. A thrown error stops the current function and travels up to whoever called it, then to who called them, until something **catches** it. If nothing does, the program stops with an error message. You catch errors with `try` and `catch`. The code inside `try` runs normally. If anything inside it throws, JavaScript jumps straight to the `catch` block, and the variable in brackets holds the error. An optional `finally` block runs in both cases, whether there was an error or not, which makes it the right place for cleanup, such as closing a file or a database connection."),
    SETUP('', ['Save the code as `errors.js` and run it with `node errors.js`.']),
    C('js', code('jsb04-errors-json.js')),
    run('node errors.js'),
    C('text', `29
Caught: "abc" is not a valid age
finally always runs
ValidationError email true
Async caught: network down
{"name":"Asha","skills":["js","sql"],"joined":"2026-01-15T00:00:00.000Z"}
{
  "a": 1,
  "b": [
    2,
    3
  ]
}
3
Bad JSON: SyntaxError`),
    P("Look at the first three lines. The first call works and prints 29. The second call throws, so the line `console.log('not reached')` never runs, the `catch` block prints the message, and `finally` prints its line. An error object has a `message` that explains the problem, a `name` such as `TypeError` or `SyntaxError`, and a `stack` that lists the chain of calls that led to it, which lesson 45 teaches you to read."),
    H("Custom errors"),
    P("You can make your own kind of error by extending `Error`. The `ValidationError` in the example has an extra `field`. In an Express app you build classes such as `NotFoundError` or `AppError` with a status code, and one error handler turns them into the right response. That is the system of lesson 38. The check `error instanceof ValidationError` lets you treat different errors differently: show a message to the user for a validation error, but only log and show a generic message for an unknown one."),
    H("Errors in asynchronous code"),
    P("A `try/catch` only catches errors thrown while it is running. A callback that runs later is outside of it. With promises, the fix is `async` and `await`: when you `await` a promise that fails, the failure is thrown as a normal error at that line, and your `try/catch` catches it, as the `load` example shows. Without `await`, you would receive the failed promise and the error would become an **unhandled rejection**, which can crash a Node process. The rule is: await your promises, and put a catch around the place where you can decide what to do. In Express 5, a rejected promise from an async route handler goes to the error handler automatically."),
    H("JSON: text that carries data"),
    P("**JSON** stands for JavaScript Object Notation. It is plain text that looks like a JavaScript object, with some rules: names are in double quotes, there are no comments, and the values can only be text, numbers, `true`, `false`, `null`, arrays and other objects. Because it is text, it can be sent over a network or saved in a file. `JSON.stringify(value)` turns a JavaScript value into JSON text, and `JSON.parse(text)` turns JSON text into a value. Study the output. The `note: undefined` and the `greet` function are **dropped**, because JSON has no such types, and the `Date` became a text string in a standard format, so after `parse` it is a string and not a date. A third argument to `stringify`, such as `2`, adds indentation, which is useful for reading and for saving files."),
    P("`JSON.parse` throws a `SyntaxError` when the text is not valid JSON, so you must always wrap it in `try/catch` when the text comes from outside. Express's `express.json()` does this for you for request bodies, and answers 400 for broken JSON in the course code."),
    RAN,
    H('Common mistakes'),
    L("An empty `catch` block that hides the error. At least log it.", "Throwing text instead of an `Error`, which loses the stack trace.", "Forgetting `await`, so the error escapes the `try/catch`.", "Trusting `JSON.parse` on outside text without a `try/catch`.", "Expecting dates, functions or `undefined` to survive `JSON.stringify`."),
    ...task("Make `parseAge` also reject ages above 120, and test it.", "Write a `NotFoundError` class with a `status` of 404 and throw and catch it.", "Save an object to a file with `JSON.stringify`, read it back with `JSON.parse` and compare."),
    ...check("Your output matches the output above.", "You can say what `finally` is for.", "You can name two things that `JSON.stringify` drops."),
  ], A('An error travels upward', [
    n('th', 'throw', 'new Error', 0, 0, 'user'), n('tr', 'try block', 'code that may fail', 1, 0, 'app'),
    n('ca', 'catch', 'decide what to do', 2, 0, 'check'), n('fi', 'finally', 'cleanup always runs', 3, 0, 'tool'),
  ], [
    { say: 'Code reports a problem by throwing an Error.', on: ['th'] },
    { say: 'Inside a try block, the throw stops the rest of the block.', flow: ['th>tr:throws'] },
    { say: 'Control jumps to catch, where you log, convert or answer with a message.', flow: ['tr>ca:error object'] },
    { say: 'finally runs either way, so cleanup is never skipped.', flow: ['ca>fi:always'] },
  ]), [
    faq('What is the difference between throw and return?', 'return gives a value back normally. throw signals an error, which skips the normal path until something catches it.'),
    faq('Why does JSON.parse need a try/catch?', 'It throws a SyntaxError for invalid text, and text from outside can be invalid. Without a catch, that error can crash the request.'),
    faq('What is an unhandled rejection?', 'A promise failed and nothing handled the failure. It can crash a Node process, so await your promises and catch errors.'),
  ]),
];

export const modulesLesson = les('Node.js Basics', 'commonjs-vs-es-modules-require-import-and-export', 'CommonJS vs ES Modules: require, import and export', 'CommonJS vs ES Modules in Node.js',
  'Understand the two module systems in Node.js: require and module.exports versus import and export, how to choose, mix them and avoid the common errors.', [
  P("When you read Node.js code, you will meet two ways to share code between files, and the beginner confusion about them is real. One looks like `const express = require('express')` and the other looks like `import express from 'express'`. Both work, both are common, and they come from different times in the history of JavaScript. This lesson explains where each comes from, how they differ in practice, and how to deal with the errors that appear when they meet."),
  H("Why two systems?"),
  P("Early JavaScript had no way to split code into files. When Node.js started in 2009 it needed one, so it invented **CommonJS**: each file is a module, you expose things with `module.exports`, and you load them with `require`. Years later, the JavaScript language itself got an official module system, **ES modules** (ESM), with `export` and `import`. Browsers use it, and Node.js added support for it. So today Node supports both, and the old and the new live together in a huge number of projects."),
  H("CommonJS"),
  C('js', '// mod-cjs-math.cjs\n' + code('mod-cjs-math.cjs')),
  C('js', '// mod-cjs-main.cjs\n' + code('mod-cjs-main.cjs')),
  run('node mod-cjs-main.cjs'),
  C('text', `5 3.14159
string mod-cjs-main.cjs
object object`),
  P("In CommonJS, `require` loads the file **synchronously**, at the moment it runs, and returns whatever that file put into `module.exports`. Every CommonJS file also gets the free variables `__dirname` (the folder of the file), `__filename`, `module`, `exports` and `require`. Files normally end in `.js` in a project without `type: module`, or in `.cjs` to mark them clearly."),
  H("ES modules"),
  C('js', '// mod-esm-math.mjs\n' + code('mod-esm-math.mjs')),
  C('js', '// mod-esm-main.mjs\n' + code('mod-esm-main.mjs')),
  run('node mod-esm-main.mjs'),
  C('text', `5 3.14159 A tiny math module
undefined
true true
top-level await works
15
[ 'PI', 'add', 'default' ]`),
  P("ES modules use `export` to make things available, either **named** (`export const add`) or one **default** (`export default`). You import named things with braces, `import { add }`, and the default without braces, `import describe from`. They are loaded in a way that lets tools see the imports without running the code, which allows features such as tree shaking, and they support **top-level `await`**, shown in the example, which CommonJS cannot do. They do not have `__dirname`. The example shows the replacement: `import.meta.url` holds the address of the current file, and `fileURLToPath` plus `path.dirname` give you the folder."),
  H("How Node chooses the system"),
  L("A file ending in `.mjs` is always an ES module, and `.cjs` is always CommonJS.", "A `.js` file follows the `type` field in the nearest `package.json`: `\"type\": \"module\"` means ESM, and no type or `\"commonjs\"` means CommonJS.", "This course uses `\"type\": \"module\"`, so every `.js` file uses `import` and `export`.", "In ES modules, local imports must include the file extension: `./math.js`, not `./math`."),
  H("Mixing the two"),
  P("From an ES module you can load a CommonJS file with `createRequire`, as the example does, and the default import of a CommonJS package usually works too: `import express from 'express'`. Going the other way used to be an error: a CommonJS file could not `require` an ES module and received `ERR_REQUIRE_ESM`. Newer versions of Node.js, including the 22 that this lesson was run on, allow `require` of an ES module that has no top-level `await`, and the dynamic `import()` function works from both worlds on every version and returns a promise. If your project must run on older Node versions, use `import()`. Check the Node.js documentation for your version."),
  H("Which should you use?"),
  P("For a new project, use ES modules. They are the standard of the language, they match what you write in front-end code, and the ecosystem has moved that way. You still need to read CommonJS, because many tutorials, tools and configuration files use it. Some tools, such as the Jest configuration in lesson 46, work in the `.cjs` style. If you see the error `Cannot use import statement outside a module`, your file is being treated as CommonJS, so add `\"type\": \"module\"` or rename it to `.mjs`. If you see `require is not defined in ES module scope`, do the opposite: you used `require` in an ES module."),
  RAN,
  H('Common mistakes'),
  L("Using `require` in a file that is an ES module, and `import` in one that is not.", "Forgetting the file extension in an ES module import.", "Using `__dirname` in an ES module, where it does not exist.", "Mixing default and named imports: `import add from` when `add` is a named export."),
  ...task("Add a `subtract` function to the ES module and import it in the main file.", "Rename `mod-esm-main.mjs` to `.js` and add and remove `type: module` to see both error messages.", "Convert the CommonJS math file into an ES module and update the main file."),
  ...check("Both examples print the output shown above.", "You can name the two replacements for `__dirname` and `require` in ES modules.", "You can say which system a `.js` file uses, and where Node looks to decide."),
], A('Two ways to share code', [
  n('cj', 'CommonJS', 'require, module.exports', 0, 0, 'data'), n('es', 'ES modules', 'import, export', 1, 0, 'tool'),
  n('pk', 'package.json', 'type decides .js files', 2, 0, 'check'), n('mix', 'Mixing', 'createRequire, import()', 3, 0, 'app'),
], [
  { say: 'CommonJS is the original Node system. It loads files synchronously with require.', on: ['cj'] },
  { say: 'ES modules are the language standard. They add top-level await and static imports.', flow: ['cj>es:newer'] },
  { say: 'The type field in package.json, or .mjs and .cjs, tells Node which one a file uses.', flow: ['es>pk:decides'] },
  { say: 'To mix them, use createRequire in ESM or the dynamic import() in CommonJS.', flow: ['pk>mix:bridge'] },
]), [
  faq('Should I use require or import?', 'Use import with ES modules in new projects. Know require for reading older code and tools.'),
  faq('Why is __dirname not defined in my file?', 'It exists only in CommonJS. In an ES module, use path.dirname(fileURLToPath(import.meta.url)).'),
  faq('Can I use both in one project?', 'Yes. Use the file extensions .mjs and .cjs, or the type field, to say which each file is, and bridge with createRequire or import().'),
]);

const SL = 'Testing, Debugging and Deployment';
export const linuxLesson = les(SL, 'linux-server-basics-for-node-developers-commands-permissions-and-ssh', 'Linux Server Basics for Node Developers: Commands, Permissions and SSH', 'Linux Server Basics for Node Developers',
  'Learn the Linux commands you need before deploying Node.js: files and folders, permissions, pipes, processes, SSH and firewalls, with a safe practice script.', [
  P("Almost every Node.js app in production runs on Linux. Your laptop may run Windows or macOS, but the server that you rent will most likely have Ubuntu or a similar system, and you will control it through a text terminal. It looks scary the first time, but you need only a small set of commands to be productive. This lesson teaches those commands with a harmless practice script, and the safety habits that matter on a real server."),
  H("The terminal and the file system"),
  P("A **terminal** is a window where you type commands, and the program that reads them is called a **shell**, most often `bash`. Linux organises everything in a single tree of folders that starts at `/`, called *root*. Your own files live in your **home folder**, such as `/home/asha`, which is also written `~`. A **path** says where a file is. An *absolute* path starts with `/`. A *relative* path starts from where you are now. The commands you will use all the time are these."),
  L("`pwd` prints the folder you are in. `ls` lists files, `ls -l` adds details, and `ls -a` shows hidden files whose names start with a dot.", "`cd folder` moves into a folder, `cd ..` goes up one level, and `cd ~` goes home.", "`mkdir` makes a folder. `cp` copies, `mv` moves or renames, and `rm` removes. `rm -r` removes a folder and everything inside it.", "`cat file` prints a file. `head -n 5` and `tail -n 5` print the first or last lines, and `tail -f` follows a log file as it grows.", "`nano file` is a simple text editor in the terminal.", "`grep text file` searches for text inside files, and `find` searches for files by name."),
  N("`rm` has **no recycle bin**. A removed file is gone. Check the path twice before you press Enter, never run `rm -r` with a path that you have not read, and never copy a command from the internet that you do not understand."),
  SETUP('', ['Save the script below as `lx-basics.sh` and run it with `bash lx-basics.sh`. It only touches a folder named `demo` that it creates and then removes.']),
  C('bash', code('lx-basics.sh')),
  run('bash lx-basics.sh'),
  C('text', `/home/asha/demo
total 8
-rw-r--r-- 1 asha asha 13 Nov 11 08:59 a.txt
-rw-r--r-- 1 asha asha 13 Nov 11 08:59 b.txt
-rw------- 1 asha asha 13 Nov 11 08:59 a.txt
1:hello server
2
hello server`),
  P("Your folder name, user name and dates will differ. Notice three things. First, the **pipe** `|` sends the output of one command into the next, so `cat a.txt b.txt | wc -l` counts the lines of both files together. Second, `>` writes a command's output to a file and replaces what was there, while `>>` appends. Third, look at the left column of `ls -l`, which shows the permissions."),
  H("Permissions"),
  P("Every file has an owner, a group and a set of rights for three kinds of people: the owner, the group, and everyone else. Each can have **r** (read), **w** (write) and **x** (execute). The text `-rw-r--r--` means that the owner can read and write, and the group and others can only read. `chmod 600 a.txt` changes it so that only the owner can read and write, which is right for a file with secrets, such as a `.env` file. Scripts need the `x` right to run directly. The `chown` command changes the owner. If you meet *Permission denied*, the answer is usually to fix the ownership or the rights, not to use `sudo` on everything."),
  H("sudo, users and updates"),
  P("The **root** user can do anything, including destroying the system, so you work as a normal user and put `sudo` in front of the few commands that need extra rights. Servers are kept up to date with the package manager. On Ubuntu that is `sudo apt update` to refresh the list and `sudo apt upgrade` to install updates. Do not run your Node app as root: create a normal user for it, so that a bug in your code, or an attacker, cannot control the whole machine."),
  H("Processes, ports and logs"),
  L("`ps aux | grep node` shows running Node processes, and `top` or `htop` shows CPU and memory use.", "`kill PID` asks a process to stop. `kill -9 PID` forces it, and should be the last resort.", "`ss -tulpn` shows which program listens on which port. It answers the `EADDRINUSE` question from lesson 10.", "`df -h` shows disk space, and `free -h` shows memory. A full disk is a very common cause of strange failures.", "`journalctl -u servicename` and `tail -f /var/log/...` show logs."),
  H("SSH: reaching the server"),
  P("**SSH** is the secure way to open a terminal on a remote machine: `ssh asha@203.0.113.10`. Use a **key pair** instead of a password. You create it on your own computer with `ssh-keygen`, keep the private key secret, and put the public key on the server in `~/.ssh/authorized_keys`. Move files with `scp` or `rsync`, or, better, deploy with Git as lesson 50 shows. A **firewall** lets only the ports you need through. With `ufw`, allow SSH, HTTP and HTTPS, and enable it. Do this in the right order, **allow SSH first**, or you lock yourself out."),
  P("Lesson 48 uses everything from this page. You rent a server, log in with SSH, update it, create a user, open the firewall, install Node and run the app. If every command there feels familiar, the deployment will feel easy."),
  P("The practice script above was run in a Linux sandbox and its output matches. The remaining commands in this lesson, especially SSH and the firewall, need a real server and were not run here, so try them first on a cheap test machine and read the manual with `man command` when in doubt."),
  ...task("Run the practice script, then change it to make a second folder and copy `a.txt` into it.", "Use `ls -l` to compare the permissions before and after `chmod 600`.", "Run `ss -tulpn` while a Node server is running on your machine and find its port."),
  ...check("You can say what `pwd`, `ls -l`, `cd ..` and `grep` do.", "You can read `-rw-r--r--`.", "You know why to allow SSH in the firewall before enabling it."),
], A('Reaching and running on a server', [
  n('ssh', 'SSH key login', 'no password', 0, 0, 'user'), n('sh', 'Shell commands', 'ls, cd, grep, tail', 1, 0, 'tool'),
  n('pm', 'Permissions', 'owner, group, others', 2, 0, 'check'), n('fw', 'Firewall', 'only SSH, 80, 443', 3, 0, 'cloud'),
], [
  { say: 'You log in with an SSH key, not a password.', on: ['ssh'] },
  { say: 'A small set of commands lets you move around, read files and search logs.', flow: ['ssh>sh:terminal'] },
  { say: 'Permissions decide who can read, write and run each file. Secrets get 600.', flow: ['sh>pm:chmod'] },
  { say: 'A firewall closes everything except the ports that you need. Allow SSH first.', flow: ['pm>fw:ufw'] },
]), [
  faq('Do I need Linux to deploy Node.js?', 'You can deploy on other systems, but most servers and containers run Linux, so a basic knowledge of it is expected.'),
  faq('What is the difference between rm and rm -r?', 'rm removes files. rm -r removes folders and everything inside. Neither has an undo, so check the path first.'),
  faq('Why not run my app as root?', 'If the app has a bug or is attacked, root rights give the attacker control of the entire machine. A normal user limits the damage.'),
]);
