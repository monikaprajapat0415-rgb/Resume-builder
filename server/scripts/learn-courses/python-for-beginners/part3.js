import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { code, out } from './files.js';

const S3 = 'Objects, Libraries and Projects';

export const lessons = [
  // ---------------------------------------------------------------- 11
  les(S3, 'classes-and-objects-in-python', 'Classes and Objects in Python: A Gentle Introduction', 'Python Classes and Objects for Beginners',
    'Learn what classes and objects are, write a class with __init__ and methods, use dataclasses for simple records, and see inheritance with a wallet example.', [
    P("So far you have used values that Python provides: numbers, text, lists and dictionaries. A **class** lets you create your own kind of value that bundles data and the actions that go with it. A bank account has a balance and can deposit and withdraw. A student has marks and can work out a grade. When data and actions belong together, a class keeps them together and makes your code easier to understand. This is called object-oriented programming, and in this lesson you meet it gently."),
    H("Class and object"),
    P("A **class** is a blueprint. An **object** (or instance) is something made from that blueprint. If `Wallet` is the class, then one person's wallet is an object, and another person's wallet is another object. Each object has its own data, called **attributes**, and its own actions, called **methods**. Read this program and its output."),
    C('python', code('l11_classes.py')),
    C('text', out('l11_classes.py')),
    H("Understanding the class"),
    L("`__init__` is the **constructor**. Python runs it when you write `Wallet(\"Asha\", 500)`. Its first parameter, `self`, is the object that is being made. `self.owner = owner` stores the value on that object.", "Methods are functions inside the class, and they also take `self` as the first parameter. `w.add(200, \"salary bonus\")` is the same as saying: use the `add` method of the object `w`. The `self` is filled in for you.", "The methods check their input. `spend` raises a `ValueError` when you try to spend more than the balance, and the code outside catches it. The class protects its own data from invalid changes.", "`__str__` tells Python how to turn the object into text for `print`. Without it, you would see an unhelpful text with a memory address.", "Every object has its own data. Changing one wallet does not change another."),
    H("Dataclasses: classes for simple records"),
    P("Often a class only holds data, like a row of a table. Writing `__init__` by hand for that is boring. The `@dataclass` decorator from the standard library writes it for you from a list of fields with types. It also gives you a readable text form and a `==` comparison for free, as the output shows: `Expense(category='Food', amount=250.0, paid=False)`, and two expenses with the same values are equal. The `= False` gives a default value. Dataclasses are a great way to make your data clear."),
    H("Inheritance"),
    P("A class can **inherit** from another. `class Savings(Wallet)` means: a Savings wallet is a Wallet with everything Wallet has, plus whatever it adds, here `add_interest`. We created `Savings(\"Ravi\", 1000)` and added 5 percent interest, so the balance became `1050.0`. Use inheritance when one thing is truly a special kind of another thing. Do not use it only to share a few lines of code. Many experienced programmers prefer to keep the structure simple and use inheritance rarely."),
    H("When should I use a class?"),
    L("When you have data and several functions that always work on that same data.", "When you have many similar things, such as many students or many orders, each with its own state.", "When a simple dictionary has grown complicated, and you want clear names and checks.", "You do not need a class for everything. A few plain functions are often the best solution."),
    H("Naming and style"),
    L("Class names use `CapitalWords`: `Wallet`, `Expense`. Function and variable names use `lowercase_with_underscores`.", "Attributes that are for internal use only start with an underscore, like `self._cache`. It is a hint to other programmers, and not a lock.", "Write a short docstring for the class and for each method that is not obvious."),
    H("Common mistakes"),
    L("Forgetting `self` as the first parameter of a method gives a `TypeError` about the number of arguments.", "Forgetting `self.` when you set or read an attribute: `balance = 5` inside a method makes only a local variable.", "Using a mutable default value such as `history=[]` in `__init__`. Create the list inside, as the example does with `self.history = []`."),
    N("Python does not force you to use classes. Many useful programs, including the final project in this course, use mostly functions and dictionaries. Classes become more important as programs grow, and when you use libraries that are built from them."),
    ...task("Write a `Student` class with `name` and a list of `marks`. Add a method `average()` and a method `grade()` that uses the average, with the same rules as lesson 3.", "Add `__str__` so that `print(student)` shows the name and the average.", "Make a `Product` dataclass with `name`, `price` and `stock`, and a function that returns the products that are low on stock.", "Make `Wallet` raise an error if someone creates it with a negative starting balance."),
    ...check("A student with marks `[80, 90, 70]` has average `80.0`, and grade `B`.", "`print(student)` shows readable text, not a memory address.", "Your `Wallet(\"Asha\", -5)` raises a `ValueError`."),
  ], A('Blueprint and objects', [
    n('cls', 'Class Wallet', 'the blueprint', 0, 0, 'data'), n('o1', 'Asha wallet', 'balance 550', 1, 0, 'app'),
    n('o2', 'Ravi savings', 'balance 1050', 2, 0, 'app'), n('m', 'Methods', 'add, spend, __str__', 3, 0, 'tool'),
  ], [
    { say: 'A class is a blueprint that describes what data an object has and what it can do.', on: ['cls'] },
    { say: 'Calling the class, for example Wallet(\"Asha\", 500), makes an object with its own data.', flow: ['cls>o1:create'] },
    { say: 'Another object, even from a related class such as Savings, keeps its own balance.', flow: ['o1>o2:another object'] },
    { say: 'Methods are the actions an object can do. They can read and change the object data and check it.', flow: ['o2>m:use methods'] },
  ]), [
    faq('What is self in Python?', 'self is the first parameter of a method and refers to the object the method is working on. Python fills it in automatically when you call the method.'),
    faq('When should I use a dataclass?', 'When a class mostly holds data, like a record or a table row. A dataclass writes the constructor, a readable text form and equality for you.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S3, 'useful-python-standard-library', 'The Python Standard Library: Dates, Counter, Statistics and More', 'Python Standard Library: Dates, Counter',
    'Meet the standard library tools you will use all the time: datetime, timedelta, Counter, defaultdict, statistics, random, zip, sorted with key, any and all.', [
    P("Python is often described as coming with *batteries included*. The standard library has tools for many everyday jobs, and learning them saves you hours. Instead of writing your own date maths, counting loops and averages, you use code that thousands of people have tested. This lesson is a tour of the tools that beginners need most. Each one appears in the program below with its real output."),
    C('python', code('l12_stdlib.py')),
    C('text', out('l12_stdlib.py')),
    H("Dates and times"),
    P("`date(2026, 1, 31)` makes a date. `strftime` turns it into text in the format you choose: `%d` is the day, `%B` the month name and `%Y` the year. `weekday()` gives 0 for Monday up to 6 for Sunday, so 31 January 2026 is a 5, a Saturday. You can add time with `timedelta(days=30)`, and subtracting two dates gives a `timedelta` whose `.days` is the number of days. `date.fromisoformat(\"2026-02-14\")` reads a date written as year, month and day. Use `datetime` instead of `date` when you also need the time, and `date.today()` or `datetime.now()` for the current moment."),
    N("Date and time work is full of surprises: time zones, daylight saving and different formats. Store dates in the ISO format (`2026-02-14`), and use the `zoneinfo` module when time zones matter."),
    H("Counting: Counter"),
    P("`Counter(votes)` counts how often each value appears, and `.most_common(2)` gives the top two as pairs. It does in one line what you wrote with a loop in lesson 5."),
    H("Grouping: defaultdict"),
    P("A `defaultdict(list)` is a dictionary that creates an empty list the first time you use a new key. That makes grouping easy: `groups[city].append(name)`. The result is a dictionary from each city to the list of names. Wrap it in `dict(...)` when you print it, so it looks normal."),
    H("Statistics"),
    P("`statistics.mean`, `median` and `mode` give the average, the middle value and the most common value. For the marks 72, 85, 90, 66 and 85, the mean is 79.6, the median is 85 and the mode is 85. The median is often a better picture of a typical value than the mean when a few values are very large or very small."),
    H("Random"),
    P("The `random` module makes pseudo-random numbers. `random.choice(list)` picks one item, `random.sample(range(100), 5)` picks five different numbers and `random.randint(1, 6)` rolls a die. `random.seed(7)` makes the sequence repeatable, which is useful for tests. The numbers are **not** safe for passwords or security tokens. For those, use the `secrets` module."),
    H("zip, sorted and key functions"),
    L("`zip(names, scores)` pairs up items from two lists, which is perfect for looping over both at once.", "`sorted(items, key=..., reverse=True)` sorts by any rule you give. In the example, `key=lambda pair: pair[1]` sorts the pairs by the score, highest first.", "`any(...)` is true if at least one item meets the condition. `all(...)` is true if every item does. In the output, `any(s < 75 ...)` is `True` because Ravi has 72, and `all(s > 50 ...)` is `True`."),
    H("Other modules worth knowing"),
    L("`json` and `csv` for data files (lesson 8), `pathlib` and `shutil` for files and folders (lessons 8 and 14).", "`re` for patterns in text, called regular expressions. They are powerful, but start with plain string methods.", "`argparse` for command-line options (lesson 15) and `logging` for proper messages from bigger programs.", "`urllib.request` for simple web requests. Many people install `requests` for a friendlier tool.", "`sqlite3` for a small database inside a file, with no server to install.", "`unittest` for tests (lesson 15), and `decimal` for exact decimal maths, which matters for money."),
    H("How to find the right tool"),
    O("Describe the job in plain words, for example: group items by a key, or add days to a date.", "Search the official Python documentation, or search the web for Python plus your description.", "Read the short example in the documentation, and try it in the interactive prompt.", "Prefer the standard library, because it is installed everywhere and well maintained, before you add a package."),
    N("The standard library is large, and nobody remembers it all. A good habit is to type `import module` followed by `help(module)` in the interactive prompt, or to open the official documentation at docs.python.org. Knowing that a tool exists is more important than remembering its exact name."),
    ...task("Print how many days remain from today until a date you choose, such as your next birthday. Use `date.today()`.", "Use `Counter` to find the three most common letters in a sentence you write.", "Use `defaultdict(list)` to group a list of words by their first letter.", "Make a list of names and a list of marks. Use `zip` and `sorted` to print them from the highest mark to the lowest."),
    ...check("Your day count is correct when you check it on a calendar.", "The most common letters match a count by hand.", "The names print in the order of their marks, highest first."),
  ], A('Ready-made tools', [
    n('need', 'A common job', 'count, group, dates', 0, 0, 'user'), n('lib', 'Standard library', 'collections, datetime', 1, 0, 'tool'),
    n('use', 'Your code', 'a few lines', 2, 0, 'app'), n('res', 'Tested result', 'no wheel reinvented', 3, 0, 'out'),
  ], [
    { say: 'Many everyday jobs, like counting, grouping or date maths, have been solved before.', on: ['need'] },
    { say: 'Python includes tested tools for them in the standard library.', flow: ['need>lib:look up'] },
    { say: 'You import the tool and use it in a few lines instead of writing your own version.', flow: ['lib>use:import'] },
    { say: 'You get a reliable result, and your code stays short and easy to read.', flow: ['use>res:result'] },
  ]), [
    faq('Is random safe for passwords?', 'No. The random module is not designed for security. Use the secrets module for passwords and tokens.'),
    faq('What is the difference between mean and median?', 'The mean is the sum divided by the count. The median is the middle value after sorting. The median is less affected by a few very large or small values.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S3, 'analyse-a-csv-file-with-python', 'Mini Project: Analyse a CSV File and Make a Report', 'Python Project: Analyse a CSV and Report',
    'Build a small data project: read an expenses CSV file, group amounts by category, sort, work out shares and print a neat report you can reuse at work.', [
    P("Time to use what you have learned. This project is typical of real office, finance and analyst work: take a CSV export, find out where the money goes and print a short report. It combines files, dictionaries, loops, sorting and formatted output. You do not need any extra packages. Later, if you move on to data work, tools such as `pandas` do the same job with less code, but doing it by hand first helps you understand what they do."),
    H("The data"),
    P("Save this as `expenses.csv` in your project folder. It is a made-up set of expenses for one month. Each row has a date, a category, a description and an amount."),
    C('text', code('expenses.csv')),
    H("The goal"),
    P("We want a table that shows, for each category, the total amount and its share of all spending, the biggest categories first. We also want the biggest single expense. Plan the steps before you write code."),
    O("Open the CSV and read each row as a dictionary.", "Convert the amount from text to a number.", "Add the amount to the total of its category, and remember the biggest expense so far.", "Work out the grand total.", "Sort the categories by total, from the biggest.", "Print a neat table."),
    H("The program"),
    C('python', code('l13_report.py')),
    C('text', out('l13_report.py')),
    H("How it works"),
    L("`Path(__file__).parent` is the folder where this script lives. Building the path from it means that the program finds `expenses.csv` wherever you start it from.", "`defaultdict(float)` starts every new category at `0.0`, so `totals[row[\"category\"]] += amount` works even the first time a category appears.", "The `biggest` variable starts as `None`. The first row replaces it, and later rows replace it only if their amount is larger.", "`sorted(totals.items(), key=lambda item: item[1], reverse=True)` sorts the pairs by total, with the largest first.", "In the f-string, `{total / grand_total:>8.0%}` formats a fraction as a percentage with no decimals. 2799 divided by 6360.25 is 44 percent.", "The `All` row repeats the total, and you can check it by adding the categories by hand: 2799 plus 2350.50 plus 760.75 plus 450 is 6360.25."),
    H("Checking your work"),
    P("A report that looks neat can still be wrong. Check it in a second way. Add up the amounts in the file by hand, or with a calculator, or in a spreadsheet, and compare it with the program total. Check one category by hand too. For Food, the rows are 1250.50, 320 and 780, and their sum is 2350.50, exactly as printed. When your program and a hand check agree, you can trust it."),
    H("Make it your own"),
    L("Add a command-line option for the month or the file name (lesson 15 shows `argparse`).", "Write the report into a file, with `Path.write_text`, so you can send it to someone.", "Find expenses above a limit, such as 1000, and list them.", "Group by month. Use the date column: `row[\"date\"][:7]` gives `2026-01`.", "Handle bad rows. If an amount is not a number, `float()` raises a `ValueError`. Decide whether to skip the row and print a warning, or stop. Lesson 9 shows how."),
    H("From here to data jobs"),
    P("Reading a file, cleaning it, grouping, summing and reporting is the heart of many data and office automation tasks. If you want to go further, look at `pandas` for tables and `matplotlib` for charts. Those are separate packages that you install with pip in a virtual environment (lesson 10). Learn the basics in this course first. They make every later tool easier to understand."),
    N("The data here is invented for the course and says nothing about real spending. When you use real personal or company data, protect it: do not upload it to places you do not trust, and do not share files with names, phone numbers or account numbers."),
    ...task("Save `expenses.csv` and the program. Run it and compare each total with a hand calculation.", "Add a line that prints the average expense and the number of expenses.", "Add a second report that lists every expense over 700, one per line.", "Add three more rows to the CSV, including a new category, and check that the report updates."),
    ...check("The report shows Bills 2799.00, Food 2350.50, Travel 760.75, Fun 450.00 and All 6360.25.", "The biggest expense is `Electricity 1800.0`.", "The program still works after you add rows with a new category."),
  ], A('From CSV to report', [
    n('csv', 'expenses.csv', 'date, category, amount', 0, 0, 'data'), n('read', 'DictReader', 'one dict per row', 1, 0, 'tool'),
    n('sum', 'Group and sum', 'totals by category', 2, 0, 'app'), n('rep', 'Report', 'sorted, with shares', 3, 0, 'out'),
  ], [
    { say: 'The data starts in a CSV file with one expense on each row.', on: ['csv'] },
    { say: 'csv.DictReader reads each row as a dictionary, with the column names as keys.', flow: ['csv>read:read rows'] },
    { say: 'The loop converts amounts to numbers and adds them to the total of each category.', flow: ['read>sum:loop'] },
    { say: 'The totals are sorted from biggest to smallest and printed with each category share.', flow: ['sum>rep:print'] },
  ]), [
    faq('Why not just use a spreadsheet?', 'A spreadsheet is fine for one-off work. A Python script is better when you repeat the same job every week, when the file is very large, or when you want the steps written down and checked.'),
    faq('When should I use pandas?', 'When you work with large tables, many columns or need joins and charts. It saves code, but learn plain Python first so you understand what it does.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S3, 'automate-files-and-folders-with-python', 'Automate Boring Tasks: Organise Files and Folders with Python', 'Python Automation: Tidy Files and Folders',
    'Use pathlib and shutil to sort a messy folder by file type, rename and move files safely, test on practice data first and avoid deleting anything by mistake.', [
    P("Many people first feel the power of programming when Python does a dull job for them: sorting a downloads folder, renaming hundreds of photos, collecting files from many folders into one place. The tools are `pathlib` for paths and `shutil` for moving and copying. Because these programs change things on your computer, we will go carefully, test on practice files first and build in safety checks."),
    H("Safety first"),
    L("**Practise on a copy or on practice files,** never on your only copy of something important.", "**Print what you would do before you do it.** A *dry run* shows the plan and changes nothing. When it looks right, switch to the real run.", "**Never overwrite silently.** Check whether the destination exists, and skip or rename.", "**Avoid deleting.** Moving files into a folder is safer than removing them. If you do use `rmtree` or `unlink`, be very sure of the path.", "**Keep a record** of what you changed, even a simple printed list."),
    H("The program"),
    P("The program below creates its own practice folder with seven small files, sorts them by type into sub-folders, shows the final layout and removes the practice folder at the end. Read it before you run it."),
    C('python', code('l14_organise.py')),
    C('text', out('l14_organise.py')),
    H("What happens"),
    L("`folder.iterdir()` lists everything in the folder. We loop over `sorted(...)` so the order is the same on every computer. `item.is_file()` skips folders.", "`item.suffix` is the file ending, such as `.pdf`. `.lower()` makes `.JPG` and `.jpg` the same. A dictionary maps each ending to a group name. `groups.get(...)` returns `None` for unknown endings, like the file `README`, which is left alone.", "`target.mkdir(exist_ok=True)` creates the group folder if it does not exist, and does nothing if it does.", "Before moving, we check `destination.exists()`. If a file with that name is already there, the program skips it and says so, so nothing is overwritten.", "`shutil.move` moves the file. The name is made lower case in the new place, which is why `photo2.JPG` became `photo2.jpg`.", "`folder.rglob(\"*\")` walks through all files and folders below, and `relative_to` shortens the printed paths."),
    H("Turning it into a real tool"),
    P("To use the idea on a real folder, change the `folder` line to the path you want, for example `Path.home() / \"Downloads\"`, remove the lines that create the practice files and the final `rmtree`, and add the dry-run switch below. Run it in dry-run mode first and read the plan."),
    C('python', `DRY_RUN = True   # change to False only after you have read the plan

if DRY_RUN:
    print(f"Would move {item.name} -> {target_name}/")
else:
    target.mkdir(exist_ok=True)
    shutil.move(str(item), destination)
    print(f"Moved {item.name} -> {target_name}/")`),
    H("More ideas for automation"),
    L("**Rename in bulk:** add a date to file names, replace spaces with underscores, or number photos in order. Use `item.rename(new_path)` or `item.with_name(new_name)`.", "**Find files:** `folder.rglob(\"*.pdf\")` finds every PDF in all sub-folders.", "**Merge CSV files:** loop over files with `rglob`, read each with `csv`, and write one combined file.", "**Clean old files:** list files older than 90 days using `item.stat().st_mtime`. Print them first, and move them to an archive folder before deciding to delete.", "**Make backups:** `shutil.copytree` copies a whole folder, and `shutil.make_archive` makes a zip."),
    H("Running a script on a schedule"),
    P("Once a script works, you can have the computer run it automatically. On Windows, Task Scheduler does this. On macOS and Linux, `cron` does it. First make sure that the script works when it is started from any folder, which means using full paths, and that it writes a log file, so you can see what happened while you were away."),
    H("Working with spreadsheets and documents"),
    P("Python can also read and write Excel files with the `openpyxl` package, and Word files with `python-docx`. They need installing with pip inside a virtual environment, as shown in lesson 10. The idea is the same as with CSV: read the data, process it with loops and dictionaries, and write a result. Check each package's own documentation, because details change between versions."),
    N("Even a small mistake in a file script can move many files to the wrong place. That is the reason for dry runs and for practising on copies. If you ever move files by mistake, do not run the script again. Stop and look at what changed first."),
    ...task("Run the practice program and compare the printed layout with the output above.", "Add the endings `.docx` and `.pptx` to a group called `documents`, and `.zip` to a group called `archives`.", "Add the `DRY_RUN` switch. Run once with `True` and once with `False`.", "Write a second script that lists all `.txt` files below a folder and prints their size in kilobytes."),
    ...check("Your layout shows documents, images and spreadsheets folders with the files inside.", "In dry-run mode, no file moves and the messages start with `Would move`.", "A file whose name already exists in the target is skipped with a message."),
  ], A('Tidy a folder safely', [
    n('mess', 'Messy folder', 'cv.pdf, photo.jpg...', 0, 0, 'data'), n('rule', 'Sort by ending', '.pdf = documents', 1, 0, 'check'),
    n('safe', 'Check first', 'dry run, no overwrite', 2, 0, 'tool'), n('tidy', 'Tidy folders', 'documents, images', 3, 0, 'out'),
  ], [
    { say: 'A folder fills up with mixed files, such as documents, photos and spreadsheets.', on: ['mess'] },
    { say: 'The program looks at the ending of each file name and chooses a group for it.', flow: ['mess>rule:look at suffix'] },
    { say: 'Before moving, it checks the destination and can run in dry-run mode, so nothing is overwritten by mistake.', flow: ['rule>safe:check'] },
    { say: 'Files are moved into tidy sub-folders, and unknown files are left alone.', flow: ['safe>tidy:move'] },
  ]), [
    faq('Is it safe to let Python move and delete files?', 'It is safe if you test on copies, run a dry run first, avoid overwriting, and move files to an archive instead of deleting them. A mistake in a script can change many files at once.'),
    faq('What is the difference between pathlib and os.path?', 'pathlib is the newer, object-based way to work with paths, and it is easier to read. os.path is the older function-based way. Both work, and new code usually prefers pathlib.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S3, 'final-project-expense-tracker-and-next-steps', 'Final Project: A Command Line Expense Tracker, Tests and Next Steps', 'Python Final Project: Expense Tracker',
    'Build a complete command line expense tracker with argparse, JSON storage, error handling and unit tests, then plan your next steps in Python.', [
    P("In this last lesson, you join everything into one useful program: an expense tracker that you run from the terminal. It adds expenses, lists them and shows totals by category. It saves data in a JSON file, checks the input, reports errors in a friendly way and has unit tests. The program uses functions, dictionaries, files, exceptions and the standard library, which are the skills you practised in the earlier lessons."),
    H("Plan before you code"),
    O("**Data:** a list of expenses, each a dictionary with an id, an amount, a category and a note. Stored in a JSON file.", "**Commands:** `add`, `list`, `total`.", "**Functions:** `load` and `save` for the file, `add_expense` to check and add, `totals_by_category` to calculate, and `main` to connect the command line to these.", "**Rules:** an amount must be above zero. Category names are stored in title case, so `food` and `Food` are the same.", "**Safety:** a missing file means an empty list, and bad input gives a clear message, not a traceback."),
    H("The program"),
    P("Notice that most of the logic is in small functions that do not print anything. That makes them easy to test. The `main` function is the only one that talks to the user."),
    C('python', code('l15_tracker.py')),
    H("Understanding argparse"),
    L("`argparse` reads the command line and builds the help text for you. Run `python l15_tracker.py --help` to see it.", "`add_subparsers` creates commands. Each command, `add`, `list` and `total`, has its own arguments.", "`type=float` makes argparse convert the amount and show an error if it is not a number. That is input validation that you did not have to write.", "`nargs=\"?\"` makes the note optional, with an empty text as the default.", "`--file` lets you choose where the data is kept. We use it in the test run below, so it does not touch your real data."),
    H("Run it"),
    C('text', out('l15_run')),
    L("The first call shows `No expenses yet`, because the file does not exist yet, and `load` returned an empty list.", "Each `add` prints the id and the saved values. The category `food` was saved as `Food`.", "The `list` output is aligned with f-string formatting. The `total` output is sorted from the biggest to the smallest, with an `All` line that you can check by hand: 349.00 plus 120.50 is 469.50.", "A negative amount is rejected by our own check, and the exit code is 1. A non-number is rejected by `argparse` with exit code 2. Exit codes let other programs tell whether yours worked."),
    H("Test it with unittest"),
    P("Tests are small programs that check your code. When you change the code later, you run the tests, and they tell you quickly if you broke something. `unittest` is part of the standard library. Each method that starts with `test` is one check. `assertEqual` compares an actual value with the one you expect. `assertRaises` checks that an error happens when it should."),
    C('python', code('test_l15_tracker.py')),
    C('bash', `python -m unittest -v test_l15_tracker`),
    C('text', `test_add_expense_sets_id_and_title_case ... ok
test_totals_are_grouped_and_sorted ... ok
test_zero_amount_is_rejected ... ok

Ran 3 tests

OK`),
    P("The real output also shows the timing and slightly longer test names, and the order is alphabetical. The tests work because the logic is in functions that do not print. This is the main lesson of the project: separate the thinking from the talking."),
    H("Ideas to extend the project"),
    L("Add a `delete` command, and a `--month` option for `list`.", "Add the date to each expense with `datetime.date.today().isoformat()`.", "Export a CSV report with the `csv` module.", "Store the data in SQLite with the `sqlite3` module instead of a JSON file.", "Make a small web version with Flask or FastAPI. Both are installed with pip."),
    H("Where to go next"),
    P("Choose a direction and build one real project in it. For **data and analysis**, learn `pandas`, `matplotlib` and basic statistics, and our [SQL course](/learn/sql-for-beginners) is a good companion because most data is in databases. For **web back ends**, learn Flask or FastAPI, and our [Node.js and Express course](/learn/nodejs-express-course) shows the same ideas in another language. For **automation and testing**, learn more about files, scheduling, and a test tool such as `pytest`. Our [career roadmaps](/roadmaps) show how these skills fit into jobs. Whatever you choose, build small projects regularly, read other people's code, and read the official Python documentation, which is clear and free."),
    N("Learning a language takes time, and the pace differs for everyone. Regular practice for a short time every day beats a long session once a week. No course, including this one, can promise a job. What it can do is give you real skills and projects that you can show."),
    ...task("Type in `l15_tracker.py` and the test file. Run the commands from the output above with a `--file` of your own.", "Add the `delete` command: it takes an id and removes that expense, with an error message if the id does not exist. Write a test for it.", "Write a test that checks `totals_by_category` for an empty list.", "Write down what you want to build next, and what you need to learn to build it."),
    ...check("The commands produce the same output as shown, apart from your own data.", "All your unit tests pass, including the new ones.", "A wrong command, such as a negative amount, gives a clear message and no traceback."),
  ], A('Expense tracker flow', [
    n('cli', 'Command line', 'add 250 food', 0, 0, 'user'), n('arg', 'argparse', 'checks the command', 1, 0, 'check'),
    n('fn', 'Functions', 'add_expense, totals', 2, 0, 'app'), n('json', 'expenses.json', 'saved data', 3, 0, 'data'),
  ], [
    { say: 'You type a command, such as add 250 food, in the terminal.', on: ['cli'] },
    { say: 'argparse reads it, converts the amount to a number and shows help or an error for wrong input.', flow: ['cli>arg:read'] },
    { say: 'Small functions check the rules, add the expense or work out the totals. They are easy to test.', flow: ['arg>fn:call'] },
    { say: 'The data is saved to a JSON file, so it is still there the next time you run the program.', flow: ['fn>json:save'] },
  ]), [
    faq('Why keep the logic in functions that do not print?', 'Functions that only take values and return results are easy to test and reuse. Put printing and user interaction in a thin outer layer such as main.'),
    faq('What should I learn after these basics?', 'Pick a direction: data (pandas), web (Flask or FastAPI), or automation and testing (pytest). Build one real project in it and read the official documentation.'),
  ]),
];
