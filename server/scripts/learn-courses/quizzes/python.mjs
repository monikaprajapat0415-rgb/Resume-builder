const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'python-for-beginners-course';
export const quizzes = {
  'what-is-python-install-and-first-program': [
    Q('Which major version of Python does the course use?', ['Python 2', 'Python 3', 'Either one'], 1, 'Python 2 is very old and no longer supported.'),
    Q('On Windows the terminal says Python was not found. What was probably missed?', ['Add python.exe to PATH in the installer', 'Restarting the keyboard', 'Installing a browser'], 0, 'Run the installer again and choose Modify or Repair.'),
    Q('How does Python run your file?', ['From the top to the bottom, one line at a time', 'From the bottom to the top', 'All lines at the same moment'], 0),
  ],
  'variables-numbers-strings-and-input': [
    Q('What does input() always return?', ['Text, even if the user typed a number', 'A number', 'A boolean'], 0, 'Convert it with int() or float() when you need a number.'),
    Q('What happens with "25" + 1?', ['It gives 26', 'It stops with a TypeError', 'It gives "251"'], 1, 'Python will not guess. Convert on purpose.'),
    Q('What does the single equals sign mean in Python?', ['Store this value under this name', 'Is equal to', 'Not equal to'], 0),
  ],
  'making-decisions-with-if-elif-else': [
    Q('Which operator compares two values for equality?', ['=', '==', '=>'], 1, 'One equals sign stores, two compare.'),
    Q('Which of these counts as false in a condition?', ['The empty list []', 'The text "False"', 'The number 5'], 0),
    Q('If several conditions in an if/elif chain are true, what runs?', ['Only the first one that is true', 'All of them', 'The last one'], 0),
  ],
  'lists-and-loops-for-while': [
    Q('What is the index of the first item in a list?', ['0', '1', '-1'], 0),
    Q('What does range(3) give?', ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3'], 0, 'It stops before the number you give.'),
    Q('What does break do in a loop?', ['Stops the loop completely', 'Skips to the next item', 'Restarts the program'], 0),
  ],
  'dictionaries-tuples-and-sets': [
    Q('What does product["colour"] do if the key does not exist?', ['Raises a KeyError', 'Returns None', 'Adds the key'], 0, 'Use product.get("colour", "default") to avoid the error.'),
    Q('What is a tuple?', ['Like a list that cannot be changed after it is made', 'A kind of dictionary', 'A loop'], 0),
    Q('What does counts.get(word, 0) + 1 do when word is new?', ['Starts the count at 1', 'Raises an error', 'Gives 0'], 0),
  ],
  'functions-in-python': [
    Q('What does return do?', ['Sends a value back to the code that called the function', 'Prints the value', 'Ends the whole program'], 0),
    Q('What is wrong with def add(item, items=[])?', ['The default list is made once and shared between calls', 'Nothing', 'Lists cannot be defaults'], 0, 'This is the mutable default trap.'),
    Q('A variable created inside a function is…', ['local to that function', 'global to the whole program', 'always None'], 0),
  ],
  'working-with-text-strings-in-python': [
    Q('What does title[::-1] do?', ['Reverses the text', 'Deletes the last letter', 'Capitalises the text'], 0),
    Q('What does line.split(",") return?', ['A list of the parts between commas', 'A number', 'The text without commas as one string'], 0),
    Q('Why does .title() make mistakes with names like McDonald?', ['It capitalises each word in a simple way', 'It cannot handle capitals', 'It only works on numbers'], 0),
  ],
  'read-and-write-files-csv-and-json': [
    Q('Why use with open(...) as f:?', ['Python closes the file for you, even if an error happens', 'It makes the file bigger', 'It is the only way to read text'], 0),
    Q('A relative path such as "notes.txt" is relative to…', ['the current folder of the terminal', 'the folder of the script', 'the desktop'], 0, 'This surprises many beginners.'),
    Q('Which is better for reading a very large file?', ['for line in f (one line at a time)', 'f.read() for the whole file', 'Both use the same memory'], 0),
  ],
  'handling-errors-with-try-except': [
    Q('Why avoid a bare except:?', ['It hides every problem, including your own mistakes', 'It is a syntax error', 'It is slower'], 0),
    Q('What does a finally block do?', ['Always runs, whether or not an error happened', 'Runs only on errors', 'Runs only without errors'], 0),
    Q('What should go inside a try block?', ['Only the lines that might fail', 'The whole program', 'Only comments'], 0),
  ],
  'modules-pip-and-virtual-environments': [
    Q('What is a module?', ['A Python file whose code you can use from another file', 'A kind of variable', 'A virus scanner'], 0),
    Q('What does if __name__ == "__main__": do?', ['Runs that code only when the file is started directly', 'Runs it every time it is imported', 'Stops the program'], 0),
    Q('What is a virtual environment for?', ['Keeping the packages of one project separate from others', 'Making Python faster', 'Running Python on the web'], 0),
  ],
  'classes-and-objects-in-python': [
    Q('What is the relationship between a class and an object?', ['A class is the blueprint; an object is made from it', 'They are the same', 'An object is a blueprint for classes'], 0),
    Q('What does __init__ do?', ['It runs when a new object is created', 'It deletes the object', 'It prints the object'], 0),
    Q('What does the @dataclass decorator write for you?', ['The boring __init__ and other methods for a simple record', 'A database', 'A web page'], 0),
  ],
  'useful-python-standard-library': [
    Q('What does Counter(votes).most_common(2) give?', ['The two most frequent values with their counts', 'The two smallest votes', 'A sorted list of all votes'], 0),
    Q('Why is the median sometimes better than the mean?', ['It gives a better picture of a typical value when some values are extreme', 'It is always bigger', 'It is easier to type'], 0),
    Q('What does defaultdict(list) do the first time you use a new key?', ['Creates an empty list for it', 'Raises a KeyError', 'Creates 0'], 0),
  ],
  'analyse-a-csv-file-with-python': [
    Q('Why does the program convert the amount from text?', ['Values read from a CSV are text until you convert them', 'To make it shorter', 'CSV files hold only numbers'], 0),
    Q('How can you check a report that looks neat but may be wrong?', ['Add up the amounts a second way, such as by hand or in a spreadsheet', 'Trust it', 'Run it twice'], 0),
    Q('What does defaultdict(float) do for the totals?', ['Starts each new category at 0.0', 'Rounds the totals', 'Sorts the categories'], 0),
  ],
  'automate-files-and-folders-with-python': [
    Q('What is a dry run?', ['Showing what would be done without changing anything', 'Deleting files', 'Running without Python'], 0),
    Q('What is the safest place to practise file automation?', ['On a copy or on practice files', 'On your only copy of important files', 'On the system folder'], 0),
    Q('Which part of a path gives the file ending, such as .pdf?', ['.suffix', '.mkdir', '.iterdir'], 0),
  ],
  'final-project-expense-tracker-and-next-steps': [
    Q('Why is most of the logic in small functions that do not print anything?', ['They are easy to test', 'Python forbids printing in functions', 'It uses less memory'], 0),
    Q('What does argparse do?', ['Reads the command line and builds the help text', 'Reads a database', 'Draws charts'], 0),
    Q('Where does the tracker store its data?', ['In a JSON file', 'In an Excel workbook', 'Only in memory'], 0),
  ],
};
