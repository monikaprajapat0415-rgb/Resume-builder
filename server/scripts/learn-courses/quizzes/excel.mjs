const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'excel-for-jobs-course';
export const quizzes = {
  'excel-screen-cells-first-sheet': [
    Q('What is the address of the cell in column C, row 4?', ['4C', 'C4', 'C-4'], 1, 'The column letter comes first, then the row number.'),
    Q('What is a whole Excel file called?', ['A workbook', 'A worksheet', 'A cell'], 0, 'A workbook holds one or more worksheets, shown as tabs.'),
    Q('Which keys move you right and then down while typing a table without the mouse?', ['Tab to move right, Enter to go down', 'Ctrl+C and Ctrl+V', 'Esc and Delete'], 0),
  ],
  'enter-and-format-data': [
    Q('A number sits on the left side of its cell and SUM ignores it. What is the most likely cause?', ['Excel is treating it as text', 'The column is too narrow', 'The file is too large'], 0, 'Numbers align right by default. Left-aligned numbers are often text.'),
    Q('How can you keep the leading zero in a code like 007?', ['Format the cells as Text before typing, or start with an apostrophe', 'Type it twice', 'It cannot be done'], 0),
    Q('Why can the date 03/04/2024 be read two ways?', ['Countries write day and month in a different order', 'Excel stores dates as text', 'Dates must always have a slash'], 0, 'It is 3 April in India, the UK and most of Africa, but 4 March in the US.'),
  ],
  'first-formulas-and-cell-references': [
    Q('Every formula starts with…', ['an equals sign =', 'a plus sign +', 'a quote mark'], 0),
    Q('When should you make a reference absolute, like $B$1?', ['When the formula must keep pointing at one input cell, such as a tax rate, after being copied', 'Never', 'When the cell contains text'], 0),
    Q('What does the fill handle (small square in the corner of a cell) do?', ['Copies the formula down and adjusts it for each row', 'Deletes the cell', 'Changes the font'], 0),
  ],
  'sum-average-count-min-max': [
    Q('What is the difference between COUNT and COUNTA?', ['COUNT counts cells with numbers; COUNTA counts cells that are not empty, including text', 'They are the same', 'COUNT counts text only'], 0),
    Q('What does #DIV/0! mean?', ['You divided by zero or an empty cell', 'The function name is misspelled', 'A cell was deleted'], 0),
    Q('Which shortcut enters AutoSum?', ['Alt+=', 'Ctrl+S', 'Shift+F4'], 0),
  ],
  'if-and-or-iferror-logic': [
    Q('Why does =IF(A1>5, Yes, No) give #NAME?', ['Text results need double quotes', 'IF cannot compare numbers', 'A1 is empty'], 0, 'Write =IF(A1>5, "Yes", "No").'),
    Q('When is AND(test1, test2) true?', ['Only when both tests are true', 'When either test is true', 'Never'], 0),
    Q('Why put a threshold like 2000 in a labelled cell instead of inside the formula?', ['So anyone can see and change it, and the whole column updates', 'Excel requires it', 'It makes the file smaller'], 0),
  ],
  'sumif-countif-averageif-sumifs': [
    Q('What does SUMIF do?', ['Adds only the numbers whose row meets a condition', 'Counts the rows', 'Sorts the data'], 0),
    Q('Which function adds with more than one condition?', ['SUMIFS', 'SUM', 'COUNT'], 0),
    Q('A SUMIF total is missing a row. A likely cause is…', ['The region is spelled with a typo or has a trailing space', 'The sheet is protected', 'The font is too small'], 0, 'The IF family needs an exact match apart from capitals.'),
  ],
  'vlookup-xlookup-index-match': [
    Q('What should you put at the end of VLOOKUP to find an exact match?', ['FALSE (or 0)', 'TRUE', 'Nothing'], 0, 'Leaving it out switches to approximate matching, which can quietly give a wrong answer.'),
    Q('Which is a limit of VLOOKUP?', ['It can only look to the right of the search column', 'It cannot return text', 'It only works on one sheet'], 0),
    Q('Which Excel versions have XLOOKUP, according to the lesson?', ['Excel 2021 and Microsoft 365', 'Every version', 'Only Excel 2003'], 0, 'INDEX and MATCH works in all versions.'),
  ],
  'text-functions-and-cleaning-data': [
    Q('What does TRIM do?', ['Removes extra spaces at the start and end and between words', 'Deletes the cell', 'Changes numbers to text'], 0),
    Q('Why is TRIM a good habit when data comes from outside?', ['Extra spaces are a hidden reason lookups and SUMIF fail', 'It makes the file faster', 'It changes the font'], 0),
    Q('What does LEFT(text, 3) return?', ['The first 3 characters', 'The last 3 characters', 'The middle 3 characters'], 0),
  ],
  'excel-dates-and-times': [
    Q('How does Excel store a date?', ['As a number of days', 'As a picture', 'Only as text'], 0, 'That is why B2-A2 gives the number of days between two dates.'),
    Q('What does =TODAY() return?', ['Today\'s date, updating when the file recalculates', 'A fixed date', 'The current time only'], 0),
    Q('Which function counts working days between two dates?', ['NETWORKDAYS', 'EDATE', 'TODAY'], 0),
  ],
  'sort-filter-and-excel-tables': [
    Q('What is the classic sorting disaster?', ['Sorting one column alone so rows no longer match', 'Sorting by date', 'Sorting twice'], 0),
    Q('Does filtering delete the rows that are not shown?', ['No, it only hides them', 'Yes, they are removed', 'Yes, until you save'], 0),
    Q('What is one benefit of an Excel Table?', ['It grows when you type under the last row and copies the formulas', 'It prints faster', 'It removes duplicates by itself'], 0),
  ],
  'pivot-tables-for-beginners': [
    Q('Does a pivot table change the original data?', ['No, the original data is never changed', 'Yes, it sorts it', 'Yes, it deletes duplicates'], 0),
    Q('Which pivot area holds what you calculate, such as the total?', ['Values', 'Rows', 'Filters'], 0),
    Q('Which areas list the groups down the side and across the top?', ['Rows and Columns', 'Values and Filters', 'Columns and Values'], 0),
  ],
  'excel-charts-and-simple-dashboard': [
    Q('Which chart is best for change over time, like daily sales?', ['Line chart', 'Pie chart', 'Scatter chart'], 0),
    Q('When is a pie chart a good choice?', ['A few slices that make up a whole', 'Twenty categories', 'Change over time'], 0),
    Q('What makes a chart title more useful?', ['It states what the reader should notice', 'It says Chart Title', 'It is left empty'], 0),
  ],
  'data-validation-conditional-formatting-protection': [
    Q('Which validation type gives a drop-down so people cannot misspell North?', ['List', 'Date', 'Text length'], 0),
    Q('Is validation perfect?', ['No, pasted data can bypass the rules', 'Yes, nothing can get past it', 'Only for numbers'], 0),
    Q('What does conditional formatting do?', ['Colours cells according to rules about their values', 'Locks the sheet', 'Adds a drop-down'], 0),
  ],
  'print-share-and-keyboard-shortcuts': [
    Q('Which print setting does the lesson call the most useful for wide tables?', ['Fit All Columns on One Page', 'Print in colour', 'Print the formulas'], 0),
    Q('What does setting Print Titles to repeat $1:$1 do?', ['Repeats the heading row on every page', 'Hides row 1', 'Prints only row 1'], 0),
    Q('Why save a PDF to send?', ['It looks the same on every device and cannot be changed by accident', 'It keeps formulas working', 'It is smaller than any other file'], 0),
  ],
  'excel-for-office-jobs-tests-and-next-steps': [
    Q('What do employers look at first in an Excel test?', ['Whether the answers are correct', 'How colourful the sheet is', 'How long it took to type'], 0, 'Then they look at sensible methods and tidiness.'),
    Q('Why use formulas and not typed numbers in a test?', ['Employers check that you used sensible methods', 'Typed numbers are not allowed in Excel', 'Formulas print better'], 0),
    Q('What is a good way to use the practice test?', ['Time yourself for 30 minutes without looking at the lessons', 'Copy the answers', 'Skip the checking step'], 0),
  ],
};
