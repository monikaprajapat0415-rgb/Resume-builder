import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, out } from './files.js';

const S2 = 'Functions, Text and Files';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S2, 'functions-in-python', 'Functions in Python: def, Arguments and return', 'Python Functions: def, Arguments, return',
    'Write your own functions with def: parameters, default values, keyword arguments, return values, scope and the mutable default argument trap.', [
    P("A **function** is a named block of code that you can run whenever you need it. You have already used functions that other people wrote: `print`, `len`, `input` and `int`. Writing your own lets you give a name to a piece of work, use it many times without copying the code, and change it in one place. Programs made of small, clear functions are much easier to read, test and fix."),
    H("Defining and calling a function"),
    P("You make a function with the word `def`, a name, brackets with **parameters**, a colon, and an indented body. `return` sends a value back to the code that called the function. The values you pass when you call it are called **arguments**. Run this program and compare each line with its output."),
    C('python', code('l06_functions.py')),
    C('text', out('l06_functions.py')),
    H("Understanding the example"),
    L("`add_tax(amount, rate=0.18)` has a **default value** for `rate`. If you do not give it, 0.18 is used. `add_tax(100, rate=0.05)` passes it by name, which is called a **keyword argument** and makes calls easy to read. The result prints as `118.0` and not `118`, because `round` of a float returns a float.", "The text in triple quotes right after the first line is a **docstring**. It documents what the function does, and tools and editors show it to you.", "`min_max` returns two values. Python packs them into a tuple, and `low, high = min_max(...)` unpacks them. This is how a function can give several results.", "In `describe`, the `*` in the parameter list means that everything after it must be passed by name. That avoids mixing up arguments. `age=None` means optional, and the code checks `is not None`.", "`say_hi()` has no `return`, so the call gives `None`, Python's value for nothing. Printing it shows `None`."),
    H("Scope: where a variable lives"),
    P("A variable created inside a function exists only inside that function. It is **local**. In the example, `counter()` creates `count` each time it is called, so it returns `1` every time. Variables outside any function are **global**. A function can read a global variable, but if it assigns to a name, Python creates a new local variable. Beginners are tempted to use global variables to share data. A better habit is to pass values in as arguments and get results out with `return`."),
    H("The mutable default trap"),
    P("Look at the last part of the output. `bad_add(\"a\")` gives `['a']`, but the second call gives `['a', 'b']`, although we never passed the first list. Python makes the default value **once**, when the function is defined, and a list is changed in place, so every call shares the same list. The fix, shown in `good_add`, is to use `None` as the default and create a fresh list inside the function. Remember this rule: never use a list or dictionary as a default value."),
    H("Writing good functions"),
    L("**One job each.** If you need the word *and* to describe it, think about splitting it.", "**Clear names** with a verb: `calculate_total`, `load_orders`.", "**Return values instead of printing** inside the function when you can. A function that returns a result can be tested and reused. A function that only prints is hard to reuse.", "**Keep them short.** If a function does not fit on one screen, it is probably doing too much.", "Check the input at the start when wrong values would cause a confusing failure later."),
    H("Functions that call functions"),
    P("Small functions can use each other. For example, a `final_price(amount)` function can call `add_tax`, and a `print_receipt(items)` function can call `final_price` for each item. This is how larger programs are built: small steps joined together. Read the program from the bottom, where the main code is, to the top, where the helpers are."),
    H("Lambda and other short forms"),
    P("Python has a short way to write a tiny unnamed function, called a `lambda`: `lambda x: x * 2`. You will see it as a sorting key, for example `sorted(items, key=lambda item: item[1])`. For anything longer than one expression, use a normal `def`. It is easier to read."),
    N("A function does not run when you define it. It runs when you call it. If you wrote a `def` and see no output, check that you also wrote the call, such as `print(add_tax(100))`."),
    ...task("Write `total_with_tax(prices, rate=0.18)` that takes a list of prices and returns the total with tax, rounded to two decimals.", "Write `stats(numbers)` that returns the smallest, the largest and the average. Call it and unpack the three results.", "Write `is_valid_age(age)` that returns `True` for ages from 0 to 120 and `False` otherwise. Test the edges 0, 120 and 121.", "Copy the `bad_add` example, run it twice and then fix it as shown."),
    ...check("`total_with_tax([100, 200])` returns `354.0`.", "`is_valid_age(121)` returns `False` and `is_valid_age(0)` returns `True`.", "You can explain why the mutable default argument gives surprising results."),
  ], A('Calling a function', [
    n('call', 'Call', 'add_tax(100, 0.05)', 0, 0, 'user'), n('args', 'Parameters', 'amount=100, rate=0.05', 1, 0, 'data'),
    n('body', 'Function body', 'does the work', 2, 0, 'app'), n('ret', 'return', '105.0', 3, 0, 'out'),
  ], [
    { say: 'Your code calls the function and passes arguments.', on: ['call'] },
    { say: 'The values arrive in the parameters, which are local names inside the function.', flow: ['call>args:pass in'] },
    { say: 'The body runs with those values and does the calculation.', flow: ['args>body:run'] },
    { say: 'return sends the result back to the place where the function was called.', flow: ['body>ret:send back'] },
  ]), [
    faq('What is the difference between a parameter and an argument?', 'A parameter is the name in the function definition. An argument is the actual value you pass when you call the function.'),
    faq('Should a function print or return?', 'Prefer return. A function that returns a value can be reused and tested. Print the result in the code that calls it.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'working-with-text-strings-in-python', 'Working with Text in Python: Cleaning, Splitting and Formatting', 'Python Strings: Clean, Split, Format',
    'Clean and change text with Python string methods: strip, split, join, replace, slicing and f-string alignment, with phone number and email examples.', [
    P("Much real-world data is text: names, addresses, emails, product codes, lines of a file. It is also messy: extra spaces, mixed capital letters, odd separators. Cleaning and shaping text is one of the most common jobs in practical Python. In this lesson you will learn the tools for it and use them on small, realistic examples."),
    H("Text is a sequence"),
    P("A string is a sequence of characters, and like a list you can use an index and a slice. `title[0]` is the first character. `title[-1]` is the last. `title[1:4]` takes characters from index 1 up to but not including index 4. `title[::-1]` reverses the text. Strings cannot be changed in place. Methods such as `.upper()` return a **new** string, so you must store the result."),
    C('python', code('l07_text.py')),
    C('text', out('l07_text.py')),
    H("What each part does"),
    L("**Cleaning a phone number:** the program keeps only the digits with `ch.isdigit()` and joins them with `\"\".join(...)`. A generator inside `join` is a compact loop. The result `919876543210` includes the country code, which is correct for the input.", "**Splitting:** `line.split(\",\")` cuts text at each comma and gives a list. We then `strip()` each part. `.split()` without an argument splits on any spaces.", "**Joining:** `\" \".join(words)` is the opposite. It glues a list of texts together with the separator in front of `.join`.", "**Changing:** `.lower()`, `.replace(\"_\", \" \")`, `.capitalize()`. Remember that each returns a new text.", "**Checking:** `.endswith(\".pdf\")` is `False` for `Resume_Final_v2.PDF` because of the capital letters. Lower the text first, and then it is `True`. The `in` operator checks for a piece of text inside text.", "**Aligning:** in `f\"{'Item':<10}{'Price':>8}\"` the `<10` means left-align in 10 characters and `>8.2f` means right-align a decimal with two places in 8 characters. This makes neat tables."),
    H("More methods worth knowing"),
    L("`.startswith(...)`, `.endswith(...)`, `.find(...)` and `.count(...)`.", "`.isdigit()`, `.isalpha()`, `.isspace()` to check what a text contains.", "`.title()` capitalises each word, but it makes mistakes with names like `McDonald`, and with apostrophes such as `o'neil`. For real names, be careful.", "`.splitlines()` splits text at line ends, useful with files.", "`.zfill(5)` pads a number text with zeros: `\"42\".zfill(5)` is `00042`."),
    H("Cleaning an email address"),
    P("The last lines of the program clean an email: `strip()` removes the spaces, `lower()` makes it consistent, and `.split(\"@\")[1]` takes the part after the at sign, the domain. Notice that `\"@\" in email` is a basic check only. Checking whether an email is truly valid is harder than it looks. For real forms, check for a simple pattern, and confirm by sending a message with a link."),
    H("Escape characters and multi-line text"),
    P("A backslash in text starts a special character. `\\n` is a new line, `\\t` is a tab, and `\\\\` is one backslash. This matters for Windows file paths: write them with a leading `r`, as in `r\"C:\\Users\\Asha\"`, so Python does not treat the backslashes as escapes. Triple quotes make text that spans several lines."),
    H("Unicode and languages"),
    P("Python 3 handles text in all languages. You can store names in Hindi, Arabic, French or Chinese in a string with no special steps. When you read or write files, always give `encoding=\"utf-8\"`, as you will do in the next lesson. Without it, Windows may use a different encoding and break non-English letters."),
    N("Text methods are easy to forget. Do not memorise them all. Learn that they exist, and look up the exact name in the official documentation or with `help(str)` in the interactive prompt when you need one."),
    ...task("Write `clean_phone(text)` that returns only the digits of a phone number. Test it with `\"(022) 2345-6789\"` and `\"+44 20 7946 0958\"`.", "Take the text `\"  Asha Verma ,  Pune , 29 \"`, split it and print name, city and age without extra spaces.", "Print a small price list as an aligned table with a header, using `<` and `>` in f-strings.", "Write `file_kind(name)` that returns `\"pdf\"` for names ending in `.pdf` in any letter case, and `\"other\"` otherwise."),
    ...check("`clean_phone(\"(022) 2345-6789\")` returns `02223456789`.", "Your aligned table has the columns lined up.", "`file_kind(\"CV.PDF\")` returns `pdf`."),
  ], A('Clean text step by step', [
    n('raw', 'Messy text', '  +91 98765-43210  ', 0, 0, 'data'), n('clean', 'Clean', 'strip(), lower()', 1, 0, 'tool'),
    n('split', 'Split or filter', 'split(), isdigit()', 2, 0, 'tool'), n('use', 'Usable data', 'digits, name, city', 3, 0, 'out'),
  ], [
    { say: 'Real text is often messy, with extra spaces, capital letters and odd separators.', on: ['raw'] },
    { say: 'Cleaning methods such as strip and lower give you a tidy, consistent text.', flow: ['raw>clean:tidy'] },
    { say: 'Split cuts text into pieces, and a filter such as isdigit keeps only the characters you need.', flow: ['clean>split:cut'] },
    { say: 'Now the data is ready to use, store or compare.', flow: ['split>use:ready'] },
  ]), [
    faq('Why does .upper() not change my variable?', 'Strings cannot be changed in place. Methods return a new string, so store it: name = name.upper().'),
    faq('How do I split text on commas?', 'Use text.split(\",\"), which gives a list of parts. Then clean each part with strip().'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S2, 'read-and-write-files-csv-and-json', 'Read and Write Files in Python: Text, CSV and JSON', 'Python Files: Read and Write CSV, JSON',
    'Read and write text files, CSV spreadsheets and JSON data with Python. Learn with open, pathlib, csv.DictReader, json and why UTF-8 matters.', [
    P("Data lives in files: notes, spreadsheets exported as CSV, settings in JSON. Programs that read and write files can clean data, make reports and keep information between runs. In this lesson you learn the three formats you will meet most: plain text, CSV and JSON. The program below creates its own files in a temporary folder and removes them at the end, so you can run it safely."),
    H("The with statement"),
    P("`open(path)` gives you a file object. When you finish, the file must be closed, or data can be lost. The safest way is `with open(...) as f:`. When the indented block ends, even if an error happens, Python closes the file for you. Always give `encoding=\"utf-8\"` for text, so names and symbols in any language work the same on every computer. The modes are `\"r\"` to read (the default), `\"w\"` to write and **replace** everything, and `\"a\"` to add at the end."),
    H("pathlib: paths that work everywhere"),
    P("The `Path` class from `pathlib` builds file paths in a way that works on Windows, macOS and Linux. `folder / \"notes.txt\"` joins parts of a path with the right separator. It also has handy methods: `.exists()`, `.mkdir()`, `.read_text()`, `.write_text()`, `.iterdir()` and `.name`. Prefer `Path` to typing slashes and backslashes by hand."),
    C('python', code('l08_files.py')),
    C('text', out('l08_files.py')),
    H("Understanding the example"),
    L("**Text:** `write_text` creates the file. Looping over a file object with `for line in f` gives one line at a time, which is good for big files, and `line.strip()` removes the line break at the end.", "**Append:** mode `\"a\"` added the third line. The program then counted 3 lines.", "**CSV:** CSV means comma-separated values, the plain-text form of a spreadsheet. `csv.DictWriter` writes rows from dictionaries, and `csv.DictReader` reads each row as a dictionary with the column names as keys. Open CSV files with `newline=\"\"`, as the documentation says. Everything read from a CSV is **text**, so convert numbers yourself, as in `int(row[\"amount\"])`.", "**JSON:** `json.dumps` turns Python data into JSON text, `indent=2` makes it readable, and `json.loads` turns it back into dictionaries and lists. JSON handles numbers, text, lists, dictionaries, `true`, `false` and `null` (Python's `None`). It cannot store everything, for example dates, which you must convert to text.", "**Cleaning up:** `shutil.rmtree(folder)` deletes a folder and everything inside it. Be careful with it: there is no recycle bin."),
    H("Read a whole file or line by line?"),
    L("`f.read()` returns everything as one text. Fine for small files.", "`for line in f:` handles one line at a time and uses little memory. Use it for large files.", "`f.readlines()` gives a list of all lines."),
    H("Where does Python look for a file?"),
    P("A relative path such as `\"notes.txt\"` is relative to the **current folder of the terminal**, not to the folder where your script is stored. If you run the script from another folder, the file may not be found. When your script needs to find a file that sits next to it, build the path from the script's location: `Path(__file__).parent / \"notes.txt\"`. You will do this in lesson 13."),
    H("Safety with files"),
    L("Opening a file with `\"w\"` **erases** the old content at once. Use `\"a\"` to add, or check with `exists()` first.", "Do not delete or overwrite files from a program until you have tested it on copies.", "Never build file paths from text typed by an untrusted user without checking, because input like `..` can climb out of your folder.", "Keep secrets such as passwords out of files that you share or upload."),
    N("If you get `FileNotFoundError`, print the full path with `print(Path(\"notes.txt\").resolve())` and see whether it is where you think it is. The current folder is the cause in most cases."),
    ...task("Write a program that saves three lines of your own into `notes.txt`, then reads and prints them with line numbers.", "Create a CSV file `students.csv` with columns `name` and `marks` and four rows. Read it, convert marks to numbers and print the average.", "Save a dictionary of your settings as `settings.json` and load it again. Print one value.", "Print the names of the files in the current folder using `Path(\".\").iterdir()`."),
    ...check("The notes are printed in order with numbers 1 to 3.", "The average of your marks matches a calculation by hand.", "The loaded JSON value is the same as the one you saved."),
  ], A('Files in and out of Python', [
    n('file', 'File on disk', 'txt, csv or json', 0, 0, 'data'), n('open', 'with open(...)', 'closes by itself', 1, 0, 'tool'),
    n('data', 'Python data', 'text, rows, dicts', 2, 0, 'app'), n('save', 'Saved file', 'write results', 3, 0, 'out'),
  ], [
    { say: 'Data is stored in files on disk: plain text, CSV spreadsheets or JSON.', on: ['file'] },
    { say: 'The with open statement opens the file and closes it again, even if an error happens.', flow: ['file>open:read'] },
    { say: 'Python turns the content into text, rows or dictionaries that you can work with.', flow: ['open>data:parse'] },
    { say: 'Your results can be written to a new file, using write mode, or csv and json tools.', flow: ['data>save:write'] },
  ]), [
    faq('Why use with open instead of just open?', 'with closes the file automatically, even when an error happens. Without it, you must remember to call close(), and data may be lost if you forget.'),
    faq('Why is everything I read from a CSV text?', 'CSV is plain text, so Python cannot know which columns are numbers. Convert them yourself with int() or float().'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S2, 'handling-errors-with-try-except', 'Handling Errors in Python: try, except, finally and raise', 'Python Errors: try, except and raise',
    'Stop programs from crashing on bad input: learn exceptions, try and except, finally, raise, custom exception classes and how to read tracebacks.', [
    P("Things go wrong in real programs. A user types `abc` where you wanted a number. A file has been moved. A network is down. If you do nothing, Python stops with an error message called a **traceback**. A good program expects some of these problems and deals with them politely. Python uses **exceptions** for this, and the tools are `try`, `except`, `finally` and `raise`."),
    H("What is an exception?"),
    P("When something goes wrong, Python creates an **exception**: an object that describes the problem, such as `ValueError`, `ZeroDivisionError`, `FileNotFoundError`, `KeyError` or `IndexError`. If nothing handles it, the program stops. With `try` and `except`, you say: try this, and if this kind of problem happens, do that instead."),
    C('python', code('l09_errors.py')),
    C('text', out('l09_errors.py')),
    H("Reading the example"),
    L("`parse_amount` cleans the text, tries `float(...)` and **raises** its own `ValueError` with a message that a user can understand. `from None` hides the confusing first error. It also rejects negative numbers by raising an error. The program prints the error with `print(\"Error:\", error)`.", "In `try`, put only the line or lines that might fail. In `except ValueError as error:`, name the **specific** error you expect, and use `as error` to get the details.", "`ZeroDivisionError` is caught so the program goes on.", "For the missing file, `error.filename` tells us which file. The `finally` block always runs, whether there was an error or not. Use it for clean-up, such as closing a connection.", "The `IndexError` handler prints the name of the error type with `type(error).__name__`.", "`BudgetError(Exception)` is a **custom exception**: a class you make for a problem in your own program. It gives a clear name to your own errors, and lets other code catch exactly that error."),
    H("Rules for good error handling"),
    L("**Catch specific errors.** Avoid a bare `except:` or `except Exception:` that hides every problem, including your own typing mistakes. A program that silently ignores errors is very hard to fix.", "**Keep `try` blocks small.** If the block is long, you cannot tell which line failed.", "**Tell the user something useful:** what went wrong and what to do.", "**Do not use exceptions for normal decisions** when a simple `if` is clearer.", "**Let unexpected errors stop the program,** or log them with details. Do not hide them."),
    H("else and finally"),
    P("A `try` can also have an `else` block, which runs only if no error happened, and a `finally` block, which always runs. A common pattern is `try` to read, `except` for the expected problem, `else` to continue with the data. You will not need `else` often in your first programs, but it is good to recognise it."),
    H("Reading a traceback"),
    P("When an error is not caught, Python prints a **traceback**: the chain of calls that led to the error, with file names and line numbers, from the oldest to the newest. Start with the **last line**, which names the error and gives the message. Then look at the line just above it, which is the place where it happened in your code. The lines above that show how the program got there. Copy the last line into a search engine when you are stuck, because many people have met the same error."),
    H("Validating input in a loop"),
    P("A common beginner pattern is asking again until the input is good. Combine a `while True` loop, `try` and `except`, and `break` when the value is good."),
    C('python', `while True:
    text = input("Enter your age: ")
    try:
        age = int(text)
    except ValueError:
        print("Please type a whole number, such as 25.")
        continue
    if 0 <= age <= 120:
        break
    print("Please enter an age from 0 to 120.")
print("Thanks, age saved:", age)`),
    N("The tracebacks you see may look different on your computer, because they contain your own file names and paths, and the wording of some messages has changed between Python versions. The error types and the idea stay the same."),
    ...task("Write `safe_divide(a, b)` that returns the result, or prints `Cannot divide by zero` and returns `None` when `b` is zero.", "Write the age loop above, and test it with `abc`, `-5`, `200` and `30`.", "Write `read_first_line(path)` that returns the first line of a file, or the text `File not found` when it does not exist.", "Make a custom exception `InvalidMarks` and raise it when marks are below 0 or above 100."),
    ...check("`safe_divide(10, 0)` prints the message and gives `None`.", "The age loop asks again for the three wrong inputs and accepts 30.", "You can explain why a bare `except:` is a bad idea."),
  ], A('try and except', [
    n('try', 'try block', 'risky code', 0, 0, 'app'), n('ok', 'No error', 'else / continue', 1, 0, 'out'),
    n('exc', 'Exception', 'ValueError, ...', 1, 1, 'check'), n('fix', 'except block', 'friendly message', 2, 1, 'tool'),
    n('fin', 'finally', 'always runs', 3, 0, 'data'),
  ], [
    { say: 'You put code that might fail inside a try block.', on: ['try'] },
    { say: 'If nothing goes wrong, the program continues normally.', flow: ['try>ok:fine'] },
    { say: 'If something goes wrong, Python creates an exception and jumps to the matching except block.', flow: ['try>exc:error'] },
    { say: 'The except block handles the problem, for example with a clear message, and the program carries on. A finally block runs in both cases.', flow: ['exc>fix:handle'] },
  ]), [
    faq('What is the difference between an error and an exception?', 'In everyday Python they mean almost the same. An exception is the object Python raises when something goes wrong, and you can catch it with try and except.'),
    faq('Should I catch every exception?', 'No. Catch the specific errors you expect and can handle. Hiding all errors makes bugs invisible and very hard to find.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S2, 'modules-pip-and-virtual-environments', 'Modules, pip and Virtual Environments in Python', 'Python Modules, pip and Virtual Envs',
    'Split your code into modules, use the standard library, install packages with pip, create a virtual environment and keep a requirements.txt for your project.', [
    P("A program grows beyond one file quickly. A **module** is just a Python file whose code you can use from another file. Python also comes with a large library of ready-made modules, and a huge community shares many more that you can install. In this lesson you learn to import modules, write your own, install packages with `pip` and keep each project's packages separate with a **virtual environment**."),
    H("Importing"),
    P("Use `import` to load a module. Python's own **standard library** has modules for maths, dates, files, JSON, CSV, statistics, random numbers, regular expressions, command-line tools and much more, and none of them needs installing. There are three common forms: `import math` (then write `math.sqrt(9)`), `from math import sqrt` (then write `sqrt(9)`) and `import numpy as np`, which gives a short alias."),
    H("Your own module"),
    P("Any `.py` file is a module. Make a file `shop_utils.py` with small helper functions, and import them from another file in the same folder."),
    C('python', code('shop_utils.py')),
    C('python', code('l10_modules.py')),
    C('text', out('l10_modules.py')),
    L("The import of `with_tax` and `money` works because both files are in the same folder. The name of the module is the file name without `.py`.", "`math.ceil(2.1)` rounds **up** to 3, and `round(math.pi, 4)` gives 3.1416.", "`statistics.mean` and `statistics.median` are in the standard library. The mean of 10, 20 and 60 is 30, and the median is 20.", "The last line prints `__main__`. Every module has a `__name__`. When you run a file directly, its name is `__main__`. When another file imports it, the name is the module name instead."),
    H("The if __name__ block"),
    P("The bottom of `shop_utils.py` has `if __name__ == \"__main__\":`. The code in it runs only when you start that file directly with `python shop_utils.py`, and not when another file imports it. That lets one file serve as both a module and a small program, and it is very handy for quick tests of your functions. When you run it directly, it prints `Testing: Rs 1,180.00`."),
    H("Packages from the internet with pip"),
    P("`pip` is Python's installer. It downloads packages from PyPI, the Python Package Index. For example, `requests` is a popular package for talking to web services, `pandas` is for tables of data, and `openpyxl` reads and writes Excel files. You install one with `pip install name`. Packages are written by other people. Choose well-known ones, check the name carefully for typos, and do not install packages you do not need."),
    H("Virtual environments"),
    P("If you install every package into one global place, different projects start to fight over versions. One project needs version 1 of a package and another needs version 2. A **virtual environment** is a private folder with its own copy of Python's packages for one project. You create one for each project. These are the commands. The activate line is different on each system."),
    C('bash', `python -m venv .venv

# activate it
#   Windows PowerShell:  .venv\\Scripts\\Activate.ps1
#   Windows cmd:         .venv\\Scripts\\activate.bat
#   macOS / Linux:       source .venv/bin/activate

pip install requests
pip freeze > requirements.txt`),
    L("After you activate it, your terminal usually shows `(.venv)` at the start of the line. Now `pip` and `python` use the private copy.", "`pip freeze > requirements.txt` saves the list of installed packages and their versions. Anyone can rebuild the same set with `pip install -r requirements.txt`.", "Do not commit the `.venv` folder to git. Add `.venv` to `.gitignore` and commit `requirements.txt` instead.", "To leave the environment, type `deactivate`.", "On Windows PowerShell, you may see an error about running scripts. It is a security setting. Search for the exact message, or use `activate.bat` in the normal command prompt."),
    P("We ran `python -m venv`, installed `requests` with pip and used `pip freeze` to check the commands above. The package versions in the list will differ on your computer because newer versions appear all the time, and that is exactly why a `requirements.txt` file is useful."),
    H("Naming trouble"),
    L("Never name your own file the same as a module you import, such as `random.py` or `math.py`. Python would import your file instead of the real module, and you get strange errors.", "Use lowercase names with underscores for module names.", "If `import something` says `ModuleNotFoundError`, the package is not installed in the environment you are using. Check that the environment is active, and run `pip install something`."),
    N("When you work in an editor such as VS Code, choose the interpreter that belongs to your `.venv` (the editor shows an option to select an interpreter). If you do not, the editor may use another Python and report that your packages are missing, although the terminal runs the code well."),
    ...task("Create `shop_utils.py` and `main.py`. Import two functions from the first and use them in the second.", "Add the `if __name__ == \"__main__\":` test block and run the helper file directly.", "Create a virtual environment named `.venv`, activate it and run `pip --version` to see that it points inside `.venv`.", "Install `requests` with pip, run `pip freeze > requirements.txt` and open the file."),
    ...check("Running `main.py` prints your helper functions' results.", "Running the helper file directly shows the test line, but importing it does not.", "Your terminal shows `(.venv)` and `requirements.txt` exists."),
  ], A('Packages and environments', [
    n('pypi', 'PyPI', 'shared packages', 0, 0, 'data'), n('pip', 'pip install', 'downloads', 1, 0, 'tool'),
    n('venv', '.venv', 'private for one project', 2, 0, 'app'), n('code', 'Your code', 'import requests', 3, 0, 'out'),
  ], [
    { say: 'PyPI is the shared library of Python packages written by other people.', on: ['pypi'] },
    { say: 'The pip command downloads a package and its helpers.', flow: ['pypi>pip:pip install'] },
    { say: 'With a virtual environment, the packages are installed in a private folder for this project only.', flow: ['pip>venv:into .venv'] },
    { say: 'Your code can now import the package. A requirements file records the versions for others.', flow: ['venv>code:import'] },
  ]), [
    faq('Why use a virtual environment?', 'It keeps each project packages separate, so different projects can use different versions without clashing, and your system Python stays clean.'),
    faq('What does if __name__ == \"__main__\" do?', 'It runs the code below it only when the file is started directly, and not when another file imports it.'),
  ]),
];
