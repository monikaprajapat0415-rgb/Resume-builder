import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, out } from './files.js';

const S1 = 'Python Basics';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-python-install-and-first-program', 'What Is Python? Install It and Write Your First Program', 'What Is Python? Install and First Program',
    'Learn what Python is used for, install it on Windows, macOS or Linux, run code in the terminal and in a file, and write your first program.', [
    P("Python is a programming language known for being easy to read. Its code looks a little like plain English, which is why it is one of the most popular first languages. It is also used by professionals every day. People use Python to analyse data, automate boring computer tasks, build websites and back ends, work with spreadsheets, write scripts for testing, and train machine learning models. You can learn the basics in a few weeks of regular practice, and the same basics carry over to all of those jobs."),
    P("This course has 15 lessons. You need a computer, a free code editor and some patience. You do not need to know any programming. Every lesson ends with a task and a way to check that your answer works. The code samples in the course were all run before they were written down, and the outputs shown are what Python printed."),
    H("Install Python"),
    P("Go to the official website, python.org, open the Downloads page and install the latest stable version of Python 3. This course works with Python 3.9 and newer. Python 2 is very old and no longer supported, so make sure your version starts with 3."),
    L("**Windows:** run the installer and tick **Add python.exe to PATH** at the bottom of the first screen before you click Install. This one tick prevents the most common beginner problem.", "**macOS:** use the installer from python.org. Your Mac may already have a `python3` command, and that is fine for learning, but a newer version from python.org is better.", "**Linux:** Python 3 is usually installed. If not, use your package manager, for example `sudo apt install python3 python3-venv python3-pip` on Ubuntu and Debian."),
    P("Now open a terminal. On Windows, use PowerShell or the Terminal app. Check the version."),
    C('bash', `python --version`),
    P("It prints something like `Python 3.13.1`. On macOS and Linux the command is usually `python3`, and on Windows you can also use `py`. In this course we write `python`. If that command is not found on your computer, use `python3` or `py` instead, everywhere."),
    N("If the terminal says Python was not found, or opens the Microsoft Store on Windows, the PATH tick was missed. Run the installer again, choose Modify or Repair, and make sure the PATH option is on. Then open a new terminal window."),
    H("Your editor"),
    P("You can write Python in any text editor. A friendly free choice is Visual Studio Code with its Python extension. Another is Thonny, which was made for beginners and comes with Python built in. Pick one and stay with it. The editor is not the important part. Writing and running code is."),
    H("The interactive prompt"),
    P("Type `python` on its own and press Enter. You see a prompt that looks like `>>>`. Here you can type one line of Python and see the result at once. It is perfect for trying small ideas. Type `exit()` to leave."),
    C('text', `>>> 2 + 3
5
>>> "ha" * 3
'hahaha'
>>> exit()`),
    H("Your first program"),
    P("Real programs live in files that end in `.py`. Make a folder for the course, for example `python-course`, and open it in your editor. Create a file called `hello.py` with the code below. Words after a `#` are comments, notes for people that Python ignores."),
    C('python', code('l01_hello.py')),
    P("Run it from the terminal, in the same folder. We add two extra words after the file name to see how they arrive."),
    C('bash', `python hello.py one two`),
    C('text', out('l01_hello.py')),
    P("Look closely at what each line did. `name = \"Asha\"` creates a **variable**, a name that holds a value. `print(...)` shows something on the screen. Putting an `f` before a quote makes an **f-string**, where anything in curly braces is replaced by its value. `import sys` brings in a built-in tool box. `sys.argv` is the list of words typed on the command line, where the first item is the file name, so `[1:]` skips it. The last print shows `True` because the comparison `== 3` is true."),
    H("How Python reads your file"),
    L("Python runs the file from the top to the bottom, one line at a time.", "Indentation matters. In Python, spaces at the start of a line show which lines belong together. You will see this in the next lessons. Use four spaces and be consistent.", "Capital letters matter: `Name` and `name` are different variables.", "Text goes inside quotes, either single or double. Numbers do not."),
    H("Reading error messages"),
    P("Every programmer makes errors all day. Python tells you what went wrong, and where. Look at the **last line** of the message first. It names the type of problem, such as `SyntaxError` (the code is written wrongly), `NameError` (a name that does not exist, often a typing mistake) or `TypeError` (the wrong kind of value). Above it, Python shows the file name and line number. Fix the first error, then run again. Do not be afraid of red text. It is help."),
    N("If you copy code from a web page and it fails with strange characters, retype it. Some pages replace straight quotes with curly quotes, and Python only accepts straight ones."),
    H("A few habits to start with"),
    L("Run your code often, after every few lines, so you find mistakes while they are small.", "Use clear names such as `total_price` and not `x`.", "Type the examples yourself instead of copy and paste. Typing teaches your hands and your eyes.", "When you are stuck, read the error, change one thing and run again."),
    ...task("Install Python 3 and run `python --version`.", "Create `hello.py`. Change the name and the number of hours to your own.", "Run it with three words after the file name and check that all three are printed.", "Open the interactive prompt, calculate `15 * 4 + 2`, and leave with `exit()`."),
    ...check("`python --version` shows a version that starts with 3.", "Running `python hello.py one two` prints the greeting, then `Python 3 is running: True`, then `['one', 'two']`.", "You can say what the last line of an error message tells you."),
  ], A('From file to result', [
    n('file', 'hello.py', 'your code', 0, 0, 'data'), n('py', 'Python', 'reads line by line', 1, 0, 'tool'),
    n('pc', 'Your computer', 'does the work', 2, 0, 'app'), n('res', 'Output', 'print() shows it', 3, 0, 'out'),
  ], [
    { say: 'You write Python code in a file that ends with .py.', on: ['file'] },
    { say: 'You run it with the python command. Python reads the file from top to bottom.', flow: ['file>py:python hello.py'] },
    { say: 'Python asks your computer to do what each line says.', flow: ['py>pc:runs'] },
    { say: 'Results show in the terminal when your code uses print.', flow: ['pc>res:prints'] },
  ]), [
    faq('Which version of Python should a beginner install?', 'The latest stable Python 3 from python.org. This course works with Python 3.9 and newer. Do not use Python 2, which is no longer supported.'),
    faq('Is Python good for getting a job?', 'Python is widely used in data, automation, testing, back-end and machine learning work, so it is a useful skill. Jobs also ask for other skills, and no single language guarantees one.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'variables-numbers-strings-and-input', 'Variables, Numbers, Text and input() in Python', 'Python Variables, Numbers and Strings',
    'Learn how to store values in variables, do maths, work with text, use f-strings for neat output, convert between text and numbers, and ask the user for input.', [
    P("Almost every program does the same three things: it takes in data, works on it, and shows a result. In this lesson you learn the building blocks for the first two: variables to hold data, the main kinds of data (numbers and text), and `input()` to ask a person for data. We will use a small shopping example."),
    H("Variables"),
    P("A **variable** is a name that points to a value. You create it with a single equals sign, which in Python means *store this value under this name*, and does not mean *is equal to*. Choose names that say what the value is. Python style uses lowercase words joined by underscores, such as `unit_price`. A name cannot start with a digit or contain spaces, and it cannot be a word Python already uses, such as `if` or `for`."),
    H("Numbers, text and types"),
    P("Every value has a **type**. The ones you will meet first are `int` (whole numbers like 120), `float` (decimal numbers like 0.1) and `str` (text, short for string). The function `type(value)` tells you which one. Run this program and read the output line by line."),
    C('python', code('l02_variables.py')),
    C('text', out('l02_variables.py')),
    L("The operators are `+` `-` `*` `/` for the usual four. `/` always gives a float. `//` divides and drops the decimals, `%` gives the remainder and `**` is power. For example `7 // 2` is 3, `7 % 2` is 1, and `2 ** 3` is 8.", "In an **f-string**, `{total:.2f}` means: show `total` with two decimals. `{1234567:,}` adds commas. Formatting like this is what makes output look professional.", "Text has useful **methods**, which are functions that belong to the value, written with a dot: `.strip()` removes spaces at both ends, `.title()` capitalises each word, `.upper()` and `.lower()` change the case. `len(text)` counts the characters.", "Notice the last two lines of the output: `25` plus 1 gives `26`, but the text `\"25\"` plus `\"1\"` gives `251`. With text, `+` joins pieces together. This is why the types matter."),
    H("Converting between types"),
    P("Python will not guess. If you try `\"25\" + 1`, it stops with a `TypeError`. You convert on purpose with `int()`, `float()` and `str()`. `int(\"25\")` gives the number 25. `str(25)` gives the text `\"25\"`. If the text is not a number, such as `int(\"abc\")`, Python raises a `ValueError`. Lesson 9 shows how to handle that safely."),
    H("Asking the user: input()"),
    P("`input(\"question\")` shows the question, waits for the user to type and press Enter, and gives you what they typed. The result is **always text**, even if the user typed a number, so convert it when you need a number."),
    C('python', code('l02_input.py')),
    P("Run it. The lines below are a real session. Your answers are what you type."),
    C('text', `Your name: Asha
Hours studied today: 3
Hi Asha, that is 180 minutes.`),
    P("The program turns the second answer into a whole number with `int(...)`, and then multiplies it. If you forget the `int`, then `hours * 60` would repeat the text 60 times, and you would see a very long line. This is one of the most common beginner surprises."),
    H("Rounding and money"),
    P("Computers store decimal numbers in a way that cannot represent some values exactly. For example, `0.1 + 0.2` shows `0.30000000000000004`. For display, round with an f-string such as `{value:.2f}` or with `round(value, 2)`. For serious money calculations in a business program, many developers store whole amounts in the smallest unit, such as paise or cents, or use Python's `decimal` module. For learning, rounding for display is enough."),
    H("Common mistakes"),
    L("Using `=` when you mean `==`. Use `==` to compare in lesson 3.", "Forgetting quotes around text: `print(Hello)` looks for a variable named Hello and fails with a `NameError`.", "Mixing tabs and spaces at the start of a line.", "Forgetting that `input()` gives text.", "Using a name before you create it. Python runs from top to bottom."),
    N("When you are not sure what a value is, print it with its type: `print(value, type(value))`. It solves many puzzles in seconds."),
    ...task("Create `shop.py`. Ask for a product name, a price and a quantity. Print the name in title case and the total price with two decimals.", "Add a 5 percent discount if you like, and show both the price before and after.", "Try typing text instead of a number when the program asks for the price. Read the error and write down what it says.", "Print `7 // 2`, `7 % 2` and `2 ** 3` and check them."),
    ...check("For name `pen`, price `12.5` and quantity `4`, the total shows `50.00`.", "The product name is printed as `Pen`.", "You can explain why `\"25\" + \"1\"` gives `251`."),
  ], A('Input, convert, calculate, show', [
    n('in', 'input()', 'always text', 0, 0, 'user'), n('conv', 'int() / float()', 'turn text into numbers', 1, 0, 'tool'),
    n('calc', 'Calculate', 'price * quantity', 2, 0, 'app'), n('show', 'f-string', 'neat output', 3, 0, 'out'),
  ], [
    { say: 'input() asks the user a question and returns what they typed, always as text.', on: ['in'] },
    { say: 'You convert the text to a number with int() or float() before doing maths.', flow: ['in>conv:text'] },
    { say: 'Now you can calculate, for example price times quantity.', flow: ['conv>calc:numbers'] },
    { say: 'An f-string shows the result neatly, for example with two decimal places.', flow: ['calc>show:result'] },
  ]), [
    faq('Why does input() give text even if I type a number?', 'input() always returns a string. Convert it with int() or float() when you need to calculate with it.'),
    faq('What is an f-string?', 'A string that starts with f, like f\"Total: {total:.2f}\". Python puts the value of what is inside the curly braces into the text, with optional formatting.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'making-decisions-with-if-elif-else', 'Making Decisions in Python: if, elif, else and Booleans', 'Python if, elif, else and Booleans',
    'Make your programs choose between options with if, elif and else. Learn comparisons, and, or, not, truthy and falsy values, and how indentation groups code.', [
    P("So far your programs ran every line in order. Real programs have to choose: if the marks are high enough, give a pass; if the customer is a member, give a discount; if the file is missing, show a message. In Python, choices are written with `if`, `elif` and `else`, using conditions that are either true or false."),
    H("Booleans and comparisons"),
    P("A **boolean** has only two values: `True` and `False`. You usually get one by comparing things. The comparison operators are `==` (equal), `!=` (not equal), `<`, `>`, `<=` and `>=`. Remember: one equals sign stores, two equals signs compare. You can join conditions with `and`, `or` and `not`. `and` needs both sides true. `or` needs at least one. `not` flips the result."),
    H("if, elif and else"),
    P("Read the program below. The block under each `if` is indented by four spaces. That indentation is how Python knows which lines belong to that choice. The colon at the end of the `if` line is required."),
    C('python', code('l03_decisions.py')),
    C('text', out('l03_decisions.py')),
    L("Python checks the conditions **from the top**. The first one that is true runs, and the rest are skipped. That is why the `grade` function can check `>= 90` first and then `>= 75`: a mark of 80 fails the first and passes the second.", "`elif` is short for *else if*. You can have as many as you like, or none.", "`else` has no condition. It runs when nothing above was true.", "A function that returns a value stops at the first `return`. The `grade` function uses that, so it does not need extra `else` blocks."),
    H("Truthy and falsy"),
    P("Python lets you use almost any value as a condition. These count as **false**: `False`, `None` (nothing), `0`, `0.0`, the empty text `\"\"`, the empty list `[]`, the empty dictionary `{}` and the empty set. Everything else counts as **true**. That is why `if not name:` is a neat way to say: if the name is empty. It makes checks shorter, but it can hide mistakes when `0` is a valid value, so use `if x is None` when you mean specifically nothing."),
    H("Comparison traps"),
    L("`5 == 5.0` is `True`, because numbers are compared by value.", "`\"5\" == 5` is `False`. Text and number are different kinds of value, and Python does not convert for you. This is why you convert `input()` first.", "`1 < 5 < 10` is `True`. Python allows chained comparisons, which read like maths.", "Compare text with care: `\"apple\" == \"Apple\"` is `False`. Use `.lower()` on both sides when case should not matter.", "Never compare with `== True`. Write `if is_member:` instead."),
    H("A real example: a discount rule"),
    P("Suppose a shop gives 10 percent off if the total is at least 1000, and an extra 5 percent for members. Think about the order and write the rule with plain words first. Then turn it into code."),
    C('python', `total = 1500
is_member = True

discount = 0
if total >= 1000:
    discount = 0.10
    if is_member:
        discount += 0.05

final = total * (1 - discount)
print(f"Discount {discount:.0%}, pay {final:.2f}")`),
    P("This prints `Discount 15%, pay 1275.00`. Notice the **nested** `if`: the member check is inside the first block, so it only runs for orders of 1000 or more. If you wrote the member discount for everyone, the result would be different. Always test the edges: exactly 1000, just below it, a member and a non-member."),
    H("Testing your decisions"),
    P("A good habit is to test each branch of your `if` with values on both sides of the limit. For the `grade` function the edges are 90, 89, 75, 74, 50 and 49. The sample program tested 95, 80, 50 and 49. If a decision matters, for example about money, write down the cases and check each one."),
    N("A very common beginner error is a missing colon after `if`, `elif` or `else`, or an indentation that is not consistent. Python reports `SyntaxError` or `IndentationError` and shows an arrow where it noticed the problem. Look at that line and the one above it."),
    ...task("Write `age_check.py`. Ask for an age, convert it to a number and print `child` for under 13, `teenager` for 13 to 17, `adult` for 18 to 64 and `senior` for 65 and above.", "Add a rule: if the age is below 0 or above 120, print `Please check the age` and do nothing else.", "Test the edge ages 12, 13, 17, 18, 64 and 65.", "Rewrite your checks with a chained comparison, such as `13 <= age <= 17`."),
    ...check("Ages 12, 13, 17, 18, 64 and 65 give child, teenager, teenager, adult, adult and senior.", "An age of 150 prints the warning only.", "You can explain why the order of `elif` lines matters."),
  ], A('A decision', [
    n('data', 'A value', 'marks = 80', 0, 0, 'data'), n('if', 'if marks >= 90', 'false: skip', 1, 0, 'check'),
    n('elif', 'elif marks >= 75', 'true: run this', 2, 0, 'check'), n('out', 'Result', 'grade B', 3, 0, 'out'),
  ], [
    { say: 'Python starts with a value, for example marks equal to 80.', on: ['data'] },
    { say: 'It checks the first condition. 80 is not at least 90, so the block is skipped.', flow: ['data>if:test'] },
    { say: 'It checks the next condition from the top. 80 is at least 75, so this block runs.', flow: ['if>elif:next'] },
    { say: 'The matching block gives the result, and the remaining conditions are never checked.', flow: ['elif>out:grade B'] },
  ]), [
    faq('What is the difference between = and ==?', 'A single = stores a value in a variable. A double == compares two values and gives True or False.'),
    faq('Why does Python care about indentation?', 'Indentation shows which lines belong to an if, a loop or a function. Use four spaces and keep it consistent.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S1, 'lists-and-loops-for-while', 'Lists and Loops in Python: for, while and range', 'Python Lists and Loops: for, while, range',
    'Store many values in a list, repeat work with for and while loops, use range and enumerate, filter with list comprehensions and slice parts of a list.', [
    P("Real data comes in groups: a list of prices, a list of names, the rows of a file. Python holds a group of values in a **list**, and it repeats work for each value with a **loop**. These two ideas let a short program deal with ten values or ten million in the same way."),
    H("Lists"),
    P("A list is written with square brackets and commas: `prices = [120, 80, 650, 45]`. Each value has a position called an **index**, which starts at **0**, not 1. So `prices[0]` is the first value and `prices[-1]` is the last. A list can hold any values, and the list can grow and shrink."),
    L("`len(prices)` counts the items. `sum`, `max` and `min` work on lists of numbers.", "`prices.append(300)` adds to the end. `prices.insert(0, 10)` adds at a position. `prices.remove(80)` removes the first value that equals 80. `prices.pop()` removes and returns the last one.", "`sorted(prices)` returns a new sorted list. `prices.sort()` sorts the list itself.", "`prices[1:3]` is a **slice**: the items from index 1 up to, but not including, index 3. `prices[:2]` is the first two, and `prices[2:]` is everything from index 2 on.", "`x in prices` tells you whether a value is in the list."),
    H("The for loop"),
    P("A `for` loop runs the indented block once for each item. Read this program and its output. It also shows `enumerate`, which gives you a counter together with each item, `range`, which makes a series of numbers, a `while` loop, and a list comprehension."),
    C('python', code('l04_loops.py')),
    C('text', out('l04_loops.py')),
    L("`for price in prices:` takes each value in turn and calls it `price`. The name is yours to choose. Make it singular, to read like English.", "`enumerate(prices, start=1)` gives pairs like `(1, 120)`, so you can number the lines starting from 1.", "`range(3)` gives 0, 1, 2. It stops **before** the number you give. `range(1, 6)` gives 1 to 5.", "A `while` loop repeats as long as its condition is true. In the example, it adds prices until the total reaches 500. If the condition never becomes false, you get an **endless loop**. Press Ctrl+C to stop it.", "A **list comprehension** builds a new list in one line: `[p for p in prices if p < 100]` reads as *p for each p in prices, if p is below 100*. It is a short form of a loop that makes a list."),
    H("break and continue"),
    P("Two small commands change how a loop runs. `break` ends the loop at once. `continue` skips the rest of this round and goes to the next. For example, a search loop can `break` as soon as it finds what it wants, so it does not do needless work."),
    C('python', `names = ["Asha", "Ravi", "Meena", "Dev"]
for name in names:
    if name == "Meena":
        print("Found Meena")
        break
    print("Checked", name)`),
    P("This prints `Checked Asha`, `Checked Ravi` and `Found Meena`. It never looks at Dev."),
    H("Changing a list while you loop over it"),
    P("Do not add or remove items from a list while you loop over the same list. The loop can skip items or behave oddly. Build a new list instead, as the list comprehension does, or loop over a copy such as `for p in prices[:]:`."),
    H("Copying lists"),
    P("`b = a` does not make a copy of a list. Both names point to the **same** list, so a change through one shows in the other. Make a real copy with `b = a.copy()` or `b = a[:]`. This surprises many beginners, and it is worth remembering."),
    H("Choosing between for and while"),
    L("Use `for` when you know what to loop over: a list, a range, the lines of a file.", "Use `while` when you repeat until something happens, such as the user typing the right answer.", "If you can write it with `for`, it is usually the clearer choice."),
    N("Index errors are common. `prices[10]` on a list with four items raises `IndexError: list index out of range`. The last valid index is `len(prices) - 1`."),
    ...task("Make a list of five test scores. Print the total, the average, the highest, and how many scores are above the average.", "Use a `for` loop with `enumerate` to print `1. Asha 90` style lines for a list of names and a list of scores (use two lists and the index).", "Write a `while` loop that keeps asking for a number until the user types `0`, and then prints the sum of what they typed.", "Use a list comprehension to build a list of the squares of the numbers 1 to 10."),
    ...check("The average for scores `[72, 85, 90, 66, 85]` is `79.6`, and `3` scores are above it.", "Your `while` loop stops when you type 0 and shows the right sum.", "You can explain why `range(3)` stops at 2."),
  ], A('A loop over a list', [
    n('list', 'prices list', '[120, 80, 650, 45]', 0, 0, 'data'), n('loop', 'for price in prices', 'one by one', 1, 0, 'tool'),
    n('body', 'Loop body', 'if price > 500 ...', 2, 0, 'check'), n('res', 'Result', 'Expensive: 650', 3, 0, 'out'),
  ], [
    { say: 'A list holds several values in order. The first one has index 0.', on: ['list'] },
    { say: 'A for loop takes the items one by one and runs the indented block for each of them.', flow: ['list>loop:each item'] },
    { say: 'Inside the block you can check or calculate with the current item.', flow: ['loop>body:price'] },
    { say: 'When the list has no more items, the loop ends and the program moves on.', flow: ['body>res:output'] },
  ]), [
    faq('Why do lists start at index 0?', 'In Python, as in most programming languages, the index counts how far the item is from the start of the list, so the first item is at distance 0.'),
    faq('What is a list comprehension?', 'A short way to build a new list from another one in one line, for example [p * 2 for p in prices if p < 100].'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S1, 'dictionaries-tuples-and-sets', 'Dictionaries, Tuples and Sets in Python', 'Python Dictionaries, Tuples and Sets',
    'Use dictionaries to store data by name, count things, build tables from lists of dictionaries, and learn when to use tuples and sets for fixed or unique values.', [
    P("A list keeps things in order and finds them by position. But often you want to find a value by a **name**: the price of a product, the city of a customer, the number of times a word appears. A **dictionary** (dict) is made for that. It is one of the most useful tools in Python, and you will use it in almost every real program."),
    H("Dictionaries"),
    P("A dictionary stores **key and value** pairs inside curly braces: `{\"name\": \"Notebook\", \"price\": 120}`. You look up a value by its key, like `product[\"price\"]`. Keys are usually text or numbers and must be unique. Values can be anything, including lists and other dictionaries. Study this program and its output."),
    C('python', code('l05_dicts.py')),
    C('text', out('l05_dicts.py')),
    L("`product[\"stock\"]` reads a value. It raises a `KeyError` if the key does not exist. `product.get(\"colour\", \"no colour\")` returns a default value instead of an error, and `get` without a default returns `None`.", "`product[\"stock\"] -= 3` changes a value. Assigning to a new key, like `product[\"category\"]`, adds it.", "`.items()` gives key and value pairs for a loop. `.keys()` and `.values()` give only keys or values. `del product[\"stock\"]` removes a key.", "`\"price\" in product` checks whether a key exists.", "Since Python 3.7, a dictionary remembers the order in which keys were added."),
    H("A very common pattern: counting"),
    P("The loop that counts words is a pattern you will use again and again. For each word, `counts.get(word, 0) + 1` means: take the current count, or 0 if the word is new, and add one. The output shows `the` three times, and `and` twice. Later you will meet `collections.Counter`, which does this in one line, but writing it once by hand is the best way to understand it."),
    H("Lists of dictionaries: data like a table"),
    P("Rows of a spreadsheet or a database are often a list of dictionaries, where each dictionary is one row and each key is a column name. That is also very close to JSON, the format used by web services. You can filter and add up the rows with loops and comprehensions. The line `sum(o[\"amount\"] for o in orders if o[\"city\"] == \"Pune\")` adds the amounts of the orders from Pune only, and the program printed 600 (450 plus 150)."),
    H("Tuples"),
    P("A **tuple** is like a list that cannot be changed after it is made. It is written with round brackets: `point = (3, 4)`. Use tuples for small fixed groups of values, such as a point on a map or a name and a score. You can **unpack** a tuple into variables in one line: `x, y = point`. Functions often return several values as a tuple. You will see that in the next lesson."),
    H("Sets"),
    P("A **set** holds unique values, with no order and no duplicates. `{\"Pune\", \"Delhi\", \"Pune\"}` has only two items. Sets are fast at checking whether something is in them, and they are good for removing duplicates: `sorted(set([3, 1, 3, 2, 1]))` gives `[1, 2, 3]`. An empty set is written `set()`, because `{}` makes an empty dictionary."),
    H("Which one should I use?"),
    L("**List:** an ordered group that may change, such as the lines of a file.", "**Dictionary:** look up by name or id, such as a product by its code.", "**Tuple:** a small fixed group, such as coordinates.", "**Set:** unique values and quick membership checks."),
    H("Common mistakes"),
    L("Using a key that does not exist and getting a `KeyError`. Use `get` or check with `in`.", "Using a list as a key. Keys must be fixed values such as text, numbers or tuples.", "Writing `{}` and expecting a set.", "Changing a dictionary while you loop over it. Loop over `list(my_dict)` if you need to remove keys."),
    N("Dictionaries are the bridge between Python and web data. A JSON file that you load with Python's `json` module becomes dictionaries and lists, and Python data you save as JSON goes the other way. You will do exactly that in lesson 8."),
    ...task("Make a dictionary for yourself with keys name, city and skills (a list). Print each key and value on its own line.", "Write a program that counts how many times each letter appears in a word you choose, and prints the counts.", "Make a list of four order dictionaries with `id`, `city` and `amount`. Print the total for one city and the largest order.", "Remove the duplicates from `[5, 3, 5, 1, 3, 9]` and print the numbers in order."),
    ...check("For `\"banana\"` your letter count shows `a` three times, `n` twice and `b` once.", "The unique sorted list is `[1, 3, 5, 9]`.", "You can explain the difference between `product[\"x\"]` and `product.get(\"x\")`."),
  ], A('Look up by name', [
    n('key', 'Key', '\"price\"', 0, 0, 'user'), n('dict', 'Dictionary', 'name, price, stock', 1, 0, 'data'),
    n('val', 'Value', '120', 2, 0, 'app'), n('use', 'Your code', 'uses the value', 3, 0, 'out'),
  ], [
    { say: 'A dictionary stores pairs: a key such as price and a value such as 120.', on: ['dict'] },
    { say: 'You ask for a key.', flow: ['key>dict:product[price]'] },
    { say: 'Python finds that key and gives back its value, with no need to search by position.', flow: ['dict>val:found'] },
    { say: 'Your code uses the value. If the key is missing, get() lets you give a default instead of an error.', flow: ['val>use:use it'] },
  ]), [
    faq('What is the difference between a list and a dictionary?', 'A list stores values in order and finds them by position. A dictionary stores key and value pairs and finds values by key.'),
    faq('How do I create an empty set?', 'Use set(). Writing {} creates an empty dictionary, not an empty set.'),
  ]),
];
