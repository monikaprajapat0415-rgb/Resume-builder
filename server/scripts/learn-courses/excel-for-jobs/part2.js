import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S3 = 'Lookups, Text and Dates';
const S4 = 'Organising and Reporting';

export const lessons = [
  // ---------------------------------------------------------------- 7
  les(S3, 'vlookup-xlookup-index-match', 'VLOOKUP, XLOOKUP and INDEX MATCH: Find Data in Another Table', 'Excel VLOOKUP, XLOOKUP and INDEX MATCH',
    'Look up a price, name or code from another table. Learn VLOOKUP with exact match, XLOOKUP in newer Excel and INDEX MATCH, plus the #N/A error.', [
    P("Imagine a price list with a hundred products, and a sales sheet where you type the product name and want the price to appear by itself. Or an employee list, and an attendance sheet where you type an ID and the name appears. This job, finding a value in a table by looking for a key, is called a **lookup**. It is among the most valuable Excel skills for office, accounts and data entry jobs, and it often appears in Excel tests."),
    H("Set up a price list"),
    P("Add a new sheet called `Prices` with this table in A1:C6."),
    C('text', `   A          B           C
1  Item       Category    Price
2  Notebook   Stationery  120
3  Pen pack   Stationery  80
4  Backpack   Bags        1400
5  Desk lamp  Home        650
6  Mouse      Office      700`),
    P("In the `Sales` sheet we want the Price column (E) to be found from the item name in column B, so that the price is typed once, in one place, and never copied by hand. If a price changes, you change it in the price list only."),
    H("VLOOKUP"),
    P("`VLOOKUP` is the classic lookup. The V stands for vertical, because it looks down a column."),
    C('text', `=VLOOKUP(lookup_value, table_range, column_number, FALSE)`),
    L("**lookup_value**: what to find, such as the item name in B2.", "**table_range**: the table to search. The thing you search for must be in the **first column** of this range.", "**column_number**: which column of the table holds the answer, counting from 1 at the left of the range.", "**FALSE**: means exact match. Always use FALSE (or 0) when looking up names and codes."),
    P("In Sales!E2:"),
    C('text', `=VLOOKUP(B2, Prices!$A$2:$C$6, 3, FALSE)`),
    P("Excel finds `Notebook` in the first column of the price table, then returns the value from the third column of the same row: 120. Copy it down. The dollar signs keep the table range fixed, as in lesson 3. Every row finds its own price, so the Amount column still works."),
    P("To find the category instead, change the column number to 2: `=VLOOKUP(B2, Prices!$A$2:$C$6, 2, FALSE)` gives Stationery for Notebook."),
    N("Always use `FALSE` at the end. Leaving it out, or using `TRUE`, switches to approximate matching, which assumes a sorted list and can quietly return a wrong answer. Approximate match is meant for bands such as tax slabs or grade boundaries (see below)."),
    H("The #N/A error"),
    P("`#N/A` means “not available”: the lookup value was not found. The cause is often a small difference, such as a trailing space, a spelling mistake, or a number stored as text in one table and as a number in the other. Check by comparing the two cells with `=B2=Prices!A2`. Use `TRIM` (next lesson) to remove spaces. If missing values are normal, wrap the lookup:"),
    C('text', `=IFERROR(VLOOKUP(B2, Prices!$A$2:$C$6, 3, FALSE), "Not in price list")`),
    H("VLOOKUP's limits"),
    L("It can only look to the **right**. The search column must be the leftmost column of the table.", "The column number is typed by hand. If someone inserts a column in the table, your answer may change without warning.", "It returns only the first match."),
    P("These limits are why many people moved to XLOOKUP or INDEX MATCH."),
    H("XLOOKUP (Excel 2021 and Microsoft 365)"),
    P("`XLOOKUP` fixes those problems and reads more naturally."),
    C('text', `=XLOOKUP(lookup_value, lookup_range, return_range, "Not found")`),
    C('text', `=XLOOKUP(B2, Prices!$A$2:$A$6, Prices!$C$2:$C$6, "Not found")`),
    P("It means: find B2 in the item column, and return the matching cell from the price column. It does exact matching by default, looks in any direction, and you can give a result for “not found” right inside it. XLOOKUP is not in Excel 2019 or older, and not in some other programs, so if your workplace uses an older Excel, use VLOOKUP or INDEX MATCH. Google Sheets also has XLOOKUP now, and LibreOffice has recently added it too, but check your version."),
    H("INDEX and MATCH: the all-version alternative"),
    P("Two functions that work together in every version of Excel."),
    L("`MATCH(value, range, 0)` finds the **position** of the value in a range. `MATCH(\"Backpack\", Prices!A2:A6, 0)` returns 3.", "`INDEX(range, position)` returns the item at that position. `INDEX(Prices!C2:C6, 3)` returns 1400."),
    P("Put them together:"),
    C('text', `=INDEX(Prices!$C$2:$C$6, MATCH(B2, Prices!$A$2:$A$6, 0))`),
    P("It reads: from the Price column, give me the item at the position where B2 is found in the Item column. It can look left or right, and it does not break when columns are inserted. Many experienced users prefer it."),
    H("Approximate match for bands"),
    P("When you want to put a number into a band, such as a commission rate by sales amount or a grade by marks, approximate match is the right tool. Build a table sorted from smallest to largest, with the start of each band:"),
    C('text', `   A           B
1  Sales from  Commission
2  0           0%
3  1500        2%
4  2500        4%`),
    C('text', `=VLOOKUP(G2, $A$2:$B$4, 2, TRUE)`),
    P("With `TRUE`, Excel finds the largest value that is less than or equal to G2. An amount of 2000 falls in the band that starts at 1500, so it returns 2%. An amount of 2800 returns 4%. The table must be sorted from small to large. This replaces long nested IF formulas with a table that anyone can read and change."),
    H("Lookups across sheets and files"),
    P("A lookup table can sit on another sheet, as here, or in another file. When the table is in another workbook, Excel writes the file name into the formula, and the other workbook needs to be available when you open the file. For files you share, it is safer to keep the lookup table in the same workbook."),
    H("A checklist when a lookup fails"),
    O("Is the lookup value in the first column of the range (VLOOKUP)?", "Is the table range fixed with dollar signs and big enough to include every row?", "Are there extra spaces, or different spelling or capitals? (Capitals do not matter, spaces do.)", "Are the numbers stored as text in one of the tables?", "Did you use FALSE for exact match?"),
    ...task("Create the Prices sheet and replace the typed prices in Sales column E with a lookup formula. Choose VLOOKUP, XLOOKUP or INDEX MATCH.", "Add a Category column to Sales using the same price table.", "Type a misspelled item such as `Notebok` in B2 and see the error. Then wrap the lookup with `IFERROR`. Fix the spelling afterwards.", "Create a commission band table and use an approximate match to find the commission rate for each amount."),
    ...check("Amount in G2 is still 1200 after you replaced the prices with the lookup.", "Backpack rows show a price of 1400 and category Bags.", "You can explain why FALSE is used for exact match."),
  ], A('Look up a value', [
    n('key', 'Lookup value', 'Notebook in B2', 0, 0, 'user'), n('tab', 'Price list', 'first column holds the item', 1, 0, 'store'),
    n('row', 'Matching row', 'Notebook, Stationery, 120', 2, 0, 'check'), n('ans', 'Answer', '120', 3, 0, 'out'),
  ], [
    { say: 'You give the lookup function a value to find, such as Notebook.', on: ['key'] },
    { say: 'It searches the first column of the price list for that value.', flow: ['key>tab:search'] },
    { say: 'It finds the matching row and goes to the column you asked for.', flow: ['tab>row:found'] },
    { say: 'It returns the price from that row, 120, and updates if the price list changes.', flow: ['row>ans:return'] },
  ]), [
    faq('Should I use VLOOKUP or XLOOKUP?', 'Use XLOOKUP if everyone who will open the file has Excel 2021 or Microsoft 365. Otherwise use VLOOKUP with FALSE, or INDEX and MATCH, which work in every version.'),
    faq('Why do I get #N/A in a lookup?', 'The value was not found. Check spelling, extra spaces, numbers stored as text, and that the search value is in the first column of the table for VLOOKUP.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S3, 'text-functions-and-cleaning-data', 'Clean Messy Data: TRIM, LEFT, MID, CONCAT, Text to Columns', 'Excel Text Functions and Data Cleaning',
    'Fix messy data: extra spaces, wrong capitals, joined or split names, duplicates and blanks, using text functions, Flash Fill and Remove Duplicates.', [
    P("In real work, data rarely arrives clean. A list of customers copied from an email has extra spaces. Names are all capitals. A full name sits in one cell and you need first and last separately. The same customer appears three times. Cleaning data takes up a large part of an office worker's day, and people who can do it fast are valued. This lesson gives you the tools."),
    P("We will practise on a small messy list. Type it into a new sheet called `Clean`, starting at A1."),
    C('text', `   A
1  Name
2    asha RAO
3  BEN carter
4  chidi  okafor
5  Divya Nair
6  Asha Rao`),
    P("Row 2 has spaces at the start, row 4 has two spaces between the words, and the capitals are mixed. Row 2 and row 6 are the same person."),
    H("TRIM: remove extra spaces"),
    C('text', `=TRIM(A2)`),
    P("`TRIM` removes spaces at the start and end, and reduces repeated spaces between words to one. Put it in B2 and copy down. Extra spaces are the number one hidden reason why lookups and `SUMIF` formulas fail, so make `TRIM` a habit when data comes from outside. Spaces that come from web pages can be a special kind that `TRIM` misses, which you can remove with `SUBSTITUTE(A2, CHAR(160), \" \")`."),
    H("PROPER, UPPER and LOWER: fix capitals"),
    C('text', `=PROPER(TRIM(A2))    -> Asha Rao
=UPPER(A2)           -> ASHA RAO
=LOWER(A2)           -> asha rao`),
    P("`PROPER` puts a capital letter at the start of each word. You can put one function inside another, as above. Excel works from the inside out. First TRIM, then PROPER. Be careful with names like “McDonald” or “van der Berg”, which `PROPER` will change. Check the result."),
    H("LEFT, RIGHT and MID: take part of a text"),
    L("`LEFT(text, n)` takes the first n characters.", "`RIGHT(text, n)` takes the last n characters.", "`MID(text, start, n)` takes n characters from a starting position."),
    C('text', `=LEFT("INV-2024-0042", 3)      -> INV
=MID("INV-2024-0042", 5, 4)    -> 2024
=RIGHT("INV-2024-0042", 4)     -> 0042`),
    P("Useful for invoice numbers, codes, phone numbers and similar fixed patterns. The result is text, even if it looks like a number. To use it in a calculation, convert it with `VALUE(...)` or multiply by 1."),
    H("FIND, SEARCH and LEN"),
    P("`LEN(text)` counts the characters. `FIND(\"-\", text)` returns the position of a character, and `SEARCH` does the same without caring about capitals. Combined with `LEFT`, they let you split text at a separator. To get the first name from `Asha Rao`:"),
    C('text', `=LEFT(B2, FIND(" ", B2) - 1)         -> Asha
=MID(B2, FIND(" ", B2) + 1, 50)         -> Rao`),
    P("`FIND` returns the position of the space, 5. `LEFT` takes four characters, one less than that. The `MID` formula starts one place after the space and takes up to 50 characters, which is more than enough for any surname."),
    H("Join text: &, CONCAT and TEXTJOIN"),
    L("The `&` sign joins text: `=B2&\" \"&C2` joins first name, a space and last name.", "`CONCAT(a, b, c)` joins many cells (Excel 2019 and later; older versions use `CONCATENATE`).", "`TEXTJOIN(\", \", TRUE, A2:A6)` joins a range with a separator and can skip blanks."),
    P("You can join text and numbers: `=\"Total: \"&G13` shows `Total: 20150`. To format a number inside text, use `TEXT`: `=\"Total: \"&TEXT(G13, \"#,##0\")`."),
    H("Text to Columns: split without formulas"),
    P("Select the column, then **Data, Text to Columns**. Choose **Delimited**, press Next, tick the separator that your data uses (space, comma, tab or something else), and Finish. Excel splits each cell into several columns. This is the fastest way to split full names, or the lines of a CSV that were pasted into one column. Make sure there are empty columns to the right, because Excel overwrites what is there."),
    H("Flash Fill: let Excel see the pattern"),
    P("Type the result you want for the first row next to your data, begin typing the second, and Excel often shows a grey preview of the rest. Press **Enter** to accept. Or use **Ctrl+E** (Flash Fill). It works with first names, initials, joining and many other simple patterns. It does not update later if the data changes, so use formulas for things that will change."),
    H("Find and Replace"),
    P("**Ctrl+H** opens Replace. Enter what to find and what to replace it with, then Replace All. You can find a special character, for example to remove all hyphens from phone numbers, by leaving the replace box empty. Use the **Options** button to match whole cells only and avoid changing too much. Always look at a few results before pressing Replace All, and remember Ctrl+Z."),
    H("Remove duplicates"),
    O("Make a copy of your sheet first.", "Click inside the data and choose **Data, Remove Duplicates**.", "Choose the columns that define a duplicate. If every column ticked is the same, the row is a duplicate.", "Press OK. Excel tells you how many duplicates it removed."),
    P("In the Clean list, after TRIM and PROPER, `Asha Rao` appears twice, in row 2 and row 6. Remove Duplicates would remove one of them, but only if you run it on the cleaned column, not the original with different spaces and capitals. Another way is to flag duplicates and check them by eye. Use `=COUNTIF(B$2:B$6, B2)>1` to mark them, or **Home, Conditional Formatting, Highlight Cells Rules, Duplicate Values**."),
    H("Handling blanks"),
    L("Filter a column and tick `(Blanks)` to find empty cells.", "**Ctrl+G, Special, Blanks** selects all empty cells in a range, so you can fill them or delete the rows.", "`=IF(A2=\"\", \"Missing\", A2)` marks missing values in a formula.", "`COUNTBLANK` counts them."),
    H("Convert formulas to values"),
    P("When you have cleaned data using formulas in column B, you often want to keep only the results. Copy column B, then right-click and choose **Paste Special, Values**. Now the cells hold fixed values, and you can delete the original column A. Do this carefully, and keep a copy of the original sheet so you can go back."),
    N("Golden rule of data cleaning: never clean your only copy. Keep the original data on one sheet and clean a copy. If something goes wrong, you can start again."),
    ...task("Type the Clean list. In column B, use `PROPER(TRIM(A2))` to fix it.", "Split the cleaned names into first and last name in two ways: with formulas, and with Text to Columns.", "Use `COUNTIF` to flag the duplicate, then remove it.", "Join first and last names back together with `&` and `TEXTJOIN`."),
    ...check("Row 2 and row 6 both show `Asha Rao` after cleaning, and the duplicate is detected.", "Row 4 shows `Chidi Okafor` with a single space.", "You can explain why you keep a copy of the original data."),
  ], A('Clean data in steps', [
    n('raw', 'Messy data', 'spaces, capitals', 0, 0, 'data'), n('trim', 'TRIM and PROPER', 'fix spaces and case', 1, 0, 'tool'),
    n('split', 'Split or join', 'LEFT, MID, Text to Columns', 2, 0, 'app'), n('dup', 'Remove duplicates', 'check first', 3, 0, 'check'),
  ], [
    { say: 'Data from emails and websites often has extra spaces and mixed capitals.', on: ['raw'] },
    { say: 'TRIM removes extra spaces and PROPER fixes the capital letters.', flow: ['raw>trim:clean'] },
    { say: 'Split full names with LEFT, MID or Text to Columns, or join pieces with the & sign.', flow: ['trim>split:reshape'] },
    { say: 'Then find and remove duplicates, on the cleaned data, and keep a copy of the original.', flow: ['split>dup:finish'] },
  ]), [
    faq('Why does my lookup fail even though the names look the same?', 'There may be extra spaces at the start or end, or a non-breaking space. Use TRIM, and SUBSTITUTE with CHAR(160) for spaces copied from web pages.'),
    faq('Does Flash Fill update when the data changes?', 'No. Flash Fill gives fixed results. Use formulas if the source data will change.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'excel-dates-and-times', 'Dates in Excel: TODAY, EDATE, NETWORKDAYS and Ageing', 'Excel Date Functions for Work',
    'Calculate due dates, days between dates, working days, ages and month ends with Excel date functions, and avoid the common date pitfalls.', [
    P("Dates are everywhere in office work: invoice due dates, attendance, leave, joining dates, contract ends, delivery times. Excel is very good at date maths, as long as you remember one thing from lesson 2: a date is a number. Once that clicks, date calculations are just ordinary arithmetic."),
    H("Dates are numbers"),
    P("Excel counts days. 1 January 1900 is day 1, and each following day is the next whole number. Excel shows the number as a date through the format. So if A2 holds 1-Jun-2024 and B2 holds 15-Jun-2024, then `=B2-A2` gives 14, the number of days between them. Format the answer cell as **General** or **Number**. Excel sometimes formats it as a date, and then you see a strange date instead of 14."),
    P("Add days the same way: `=A2+30` is thirty days after A2. This is the simplest way to calculate a payment due date for “30 days credit”."),
    H("TODAY and NOW"),
    L("`=TODAY()` returns today's date. It changes every day when the file opens or recalculates.", "`=NOW()` returns the date and the time.", "For a date that must not change, such as the date an invoice was written, type it with **Ctrl+;** instead of a formula."),
    P("A due-date warning: if the due date is in column C, `=IF(C2<TODAY(), \"Overdue\", \"OK\")` marks late invoices. Days overdue: `=MAX(0, TODAY()-C2)`."),
    H("Build a date from parts, and take parts out"),
    C('text', `=DATE(2024, 6, 15)     -> 15-Jun-2024
=YEAR(A2)             -> 2024
=MONTH(A2)            -> 6
=DAY(A2)              -> 1`),
    P("`DATE(year, month, day)` is the safe way to create a date from separate pieces, for example when a sheet holds the year, month and day in three columns. It even handles overflow: month 13 becomes January of the next year."),
    H("EDATE and EOMONTH: months"),
    C('text', `=EDATE(A2, 3)      -> the same day, 3 months later
=EDATE(A2, -1)     -> one month earlier
=EOMONTH(A2, 0)    -> the last day of the month of A2
=EOMONTH(A2, 1)    -> the last day of the next month`),
    P("Use `EDATE` for subscriptions, loan instalments and contract renewals. Use `EOMONTH` for month-end reports and for payment terms such as “end of the month”. If you see a number such as 45473 instead of a date, you only need to format the cell as a date."),
    H("Working days: NETWORKDAYS and WORKDAY"),
    L("`NETWORKDAYS(start, end)` counts the working days between two dates, Monday to Friday, both included.", "`NETWORKDAYS(start, end, holidays)` also skips a list of holiday dates.", "`WORKDAY(start, days, holidays)` gives the date after that many working days."),
    P("For example, an order is received on Monday 3 June 2024 and takes 5 working days. `=WORKDAY(DATE(2024,6,3), 5)` gives Monday 10 June, assuming no holidays. Some countries have a Sunday-only weekend or different weekend days. Use `NETWORKDAYS.INTL` and `WORKDAY.INTL`, where you choose which days are the weekend. Keep your public holidays on a separate list and name that range."),
    H("Age and length of service: DATEDIF"),
    P("`DATEDIF(start, end, unit)` returns whole years, months or days between two dates. It is an older function that Excel does not list in its help, but it works."),
    C('text', `=DATEDIF(B2, TODAY(), "Y")     -> complete years (age or service)
=DATEDIF(B2, TODAY(), "M")     -> complete months
=DATEDIF(B2, TODAY(), "YM")    -> months left over after full years`),
    P("A staff list with joining dates can show “3 years, 4 months” by joining the pieces: `=DATEDIF(B2,TODAY(),\"Y\")&\" years, \"&DATEDIF(B2,TODAY(),\"YM\")&\" months\"`. The simple `(TODAY()-B2)/365` is not exact, because of leap years. Use `YEARFRAC` or `DATEDIF` when exactness matters."),
    H("Weekday and week number"),
    C('text', `=WEEKDAY(A2, 2)       -> 1 for Monday to 7 for Sunday
=TEXT(A2, "dddd")      -> the day name, such as Saturday
=TEXT(A2, "mmmm yyyy") -> June 2024
=WEEKNUM(A2)           -> the week of the year`),
    P("`TEXT` turns a date into text in the style you choose, which is handy for headings and for grouping by month. The format codes follow your language settings in some countries, so test them."),
    H("Time"),
    P("Times are fractions of a day: 12:00 is 0.5. To find hours worked, subtract the start time from the end time, and format the result as `[h]:mm`. Square brackets let the total go above 24 hours when you add up a week. To get hours as a plain number, multiply by 24: `=(C2-B2)*24`. For shifts that end after midnight, add one day if the end is smaller: `=IF(C2<B2, C2+1, C2)-B2`."),
    H("Typical date problems"),
    L("**Text dates** that will not calculate. Check alignment, and convert them (lesson 2).", "**Day and month swapped** after importing data from a system with a different regional setting.", "**Two-digit years** such as 24, which Excel may read as a different century in some old files.", "**A date shows as a number.** Format as a date.", "**A result shows as a date** when you wanted days. Format as General."),
    ...task("Make a small invoice list with invoice dates and 30-day terms. Calculate the due date, and mark invoices that are overdue today.", "Add a staff list with joining dates and calculate complete years of service with `DATEDIF`.", "Find the number of working days between 3 June 2024 and 28 June 2024 with `NETWORKDAYS`. You should get 20.", "Use `EOMONTH` to show the month end of each invoice date."),
    ...check("Due date = invoice date + 30, formatted as a date.", "`NETWORKDAYS` for 3 to 28 June 2024 returns 20.", "You can explain why `TODAY()` changes every day and when you should avoid it."),
  ], A('Dates are just numbers', [
    n('d1', 'Start date', '1 Jun 2024', 0, 0, 'data'), n('calc', 'Date maths', '+30, EDATE, DATEDIF', 1, 0, 'tool'),
    n('wd', 'Working days', 'NETWORKDAYS', 2, 0, 'check'), n('res', 'Result', 'due date, age, days', 3, 0, 'out'),
  ], [
    { say: 'Excel stores a date as a number of days, so you can calculate with it.', on: ['d1'] },
    { say: 'Add days, add months with EDATE, or subtract two dates to get the days between them.', flow: ['d1>calc:date maths'] },
    { say: 'NETWORKDAYS and WORKDAY skip weekends and holidays when you need working days.', flow: ['calc>wd:working days'] },
    { say: 'You get due dates, ages and overdue days, which you format as dates or numbers.', flow: ['wd>res:result'] },
  ]), [
    faq('Why does my date subtraction show a date instead of days?', 'Excel formatted the result as a date. Change the cell format to General or Number.'),
    faq('How do I count working days excluding holidays?', 'Use NETWORKDAYS(start, end, holidays) with a list of holiday dates. For different weekend days use NETWORKDAYS.INTL.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S4, 'sort-filter-and-excel-tables', 'Sort, Filter and Excel Tables', 'Excel Sort, Filter and Tables',
    'Sort and filter data safely, turn a range into an Excel Table, use structured references and slicers, and keep formulas growing with your data.', [
    P("Once you have a list of data, you want to look at it in different ways: largest first, only one region, only this month. Sorting and filtering do this without changing the data itself. A useful partner is the **Excel Table**, a feature that turns a plain range into a smart list with automatic filters, formatting and formulas that grow as you add rows. Most professional workbooks use tables."),
    H("Sorting"),
    O("Click any cell inside your data, for example in the Amount column.", "Go to **Data, Sort A to Z** or **Sort Z to A**, or open **Data, Sort** for more options.", "For a custom sort, such as Region and then Amount, open the **Sort** window, add a level for each column and choose the order."),
    P("Excel sorts the whole table together, so rows stay intact, as long as there are no empty columns or rows splitting the data, and the headings are recognised (tick “My data has headers”). The classic disaster is sorting one column alone. If you select a single column and sort only that, the other columns stay behind and the rows no longer match. If Excel asks, “Expand the selection”, choose that. The safest approach is to click inside the data and let Excel find the whole range, or use a Table."),
    P("To keep an original order, add a helper column with numbers 1, 2, 3 before you sort. You can always sort by it to return to the original order."),
    H("Filtering"),
    P("Click inside the data and press **Ctrl+Shift+L**, or choose Data, Filter. Little arrows appear on each heading. Click one to see these options."),
    L("Tick or untick values to show only those rows.", "**Text Filters** such as Begins with, Contains, Does not contain.", "**Number Filters** such as Greater Than, Between, Top 10.", "**Date Filters** such as This Month, Last Week or a range.", "**Filter by Colour**, if cells are coloured."),
    P("Row numbers turn blue, and the status bar says how many rows are found. Use more than one filter to narrow down: Region equals North, and Amount greater than 2000. To remove filters, press Ctrl+Shift+L again, or choose Clear. Filtering only hides rows. It does not delete them. Be careful with a total over a filtered range: `SUM` still adds the hidden rows. Use `SUBTOTAL(109, G2:G11)`, which adds only visible rows."),
    H("Excel Tables"),
    P("Click inside the sales data and press **Ctrl+T**. Confirm the range and tick “My table has headers”. The range turns into a Table with banded rows, filter arrows and a **Table Design** tab. Give it a name on that tab, for example `Sales`."),
    P("Why use a table?"),
    L("**It grows.** Type under the last row, and the table extends and copies the formulas. Charts, pivot tables and formulas that use the table update by themselves.", "**Formulas fill down automatically.** Type a formula once in a column, and it fills the whole column.", "**Readable formulas.** You can use column names instead of cell addresses.", "**Filter and sort built in**, with the headings visible while you scroll.", "**Totals row.** Table Design, Total Row adds a row with a function of your choice for each column."),
    H("Structured references"),
    P("In a table named `Sales`, you can write:"),
    C('text', `=[@Qty]*[@Price]                       the Amount in each row
=SUM(Sales[Amount])                    the total of the Amount column
=SUMIF(Sales[Region], "North", Sales[Amount])`),
    P("`[@Qty]` means the Qty in this row. `Sales[Amount]` means the whole Amount column of the table. The formulas read like English and do not need to change when you add rows. If your formula looks strange when you click cells, it is because Excel turns clicks into these names. This is normal."),
    H("Slicers: filter with buttons"),
    P("With a cell in the table selected, choose **Table Design, Insert Slicer** and tick Region. A box with a button for each region appears. Click North, and the table shows only North. Hold Ctrl and click to select several. Slicers are easy for managers to use, and they also work with pivot tables (next lesson)."),
    H("Advanced filter and dynamic arrays"),
    P("Microsoft 365 and Excel 2021 have newer functions that do the work with a formula: `=FILTER(Sales, Sales[Region]=\"North\")` returns only North rows, `=SORT(...)` sorts and `=UNIQUE(...)` lists the different values. They update automatically. Older versions do not have them, so in shared files check what your colleagues use."),
    H("Good habits for lists of data"),
    L("One heading row, no merged cells, no blank rows, and one kind of data in each column.", "Do not put totals in the middle of the data. Put them above, or on another sheet.", "Name your tables and sheets clearly.", "Use a Table for data that keeps growing."),
    N("When you share a sorted or filtered sheet, say so. A colleague who sees only some rows may think the others are missing. Clear filters before you save the final file, unless the filter is the point."),
    ...task("Turn your sales data into a Table named `Sales` using Ctrl+T.", "Sort by Region and then by Amount, largest first.", "Filter to show only North rows with an amount of 2000 or more. Check the count in the status bar. It should show 2 of 10 records.", "Add a total row, and a slicer for Region. Add a new row at the bottom, and watch the table grow and fill its formulas."),
    ...check("The table shows banded rows and a name `Sales` in Table Design.", "The North, 2000 or more filter shows two rows (Backpack 2800 and Pen pack 2400).", "A new row is added to the table and the Amount formula appears by itself."),
  ], A('From a plain range to a smart table', [
    n('range', 'Plain range', 'A1:G11', 0, 0, 'data'), n('tbl', 'Table (Ctrl+T)', 'named Sales', 1, 0, 'tool'),
    n('view', 'Sort and filter', 'slicers, filter arrows', 2, 0, 'check'), n('grow', 'It grows', 'new rows join the table', 3, 0, 'out'),
  ], [
    { say: 'You have a plain range of data with a heading row.', on: ['range'] },
    { say: 'Press Ctrl+T to turn it into a Table and give it a name.', flow: ['range>tbl:Ctrl+T'] },
    { say: 'Filter arrows, sorting and slicers let you look at the data in different ways, without changing it.', flow: ['tbl>view:sort and filter'] },
    { say: 'When you add a row below, the table grows and formulas, charts and pivots follow.', flow: ['view>grow:add rows'] },
  ]), [
    faq('Why did sorting mess up my data?', 'Probably only one column was sorted, so the other columns did not move with it. Click inside the table, or use an Excel Table, so that Excel sorts all columns together.'),
    faq('Does filtering delete data?', 'No. Filtering only hides rows that do not match. Clear the filter to see everything. SUM still counts hidden rows, so use SUBTOTAL for visible rows only.'),
  ]),

  // ---------------------------------------------------------------- 11
  les(S4, 'pivot-tables-for-beginners', 'Pivot Tables for Beginners: Summaries in Seconds', 'Excel Pivot Tables for Beginners',
    'Build your first pivot table: totals by region, item and staff, with filters, grouping and refreshing. Summarise thousands of rows with a few clicks.', [
    P("In lesson 6 you built a summary with SUMIF formulas, one cell at a time. A **pivot table** does the same with a few clicks and goes much further. You can summarise thousands of rows by any column, rearrange the report by dragging fields, and add a filter or a chart. Pivot tables are a headline skill in Excel job adverts, and interviewers love to ask about them. They look hard, but the idea is simple, and you can learn to build one in ten minutes."),
    H("What a pivot table does"),
    P("It takes a table of detailed rows and creates a summary table that groups the rows by the values in one or more columns, and calculates something such as the total, count or average for each group. The original data is never changed."),
    H("Your first pivot table"),
    O("Click inside your Sales table (it should have headings and no blank rows).", "Choose **Insert, PivotTable**. Accept the range or the table name, and choose **New Worksheet**. Press OK.", "A new sheet appears with an empty report on the left and a **PivotTable Fields** panel on the right, listing your column headings.", "Drag **Region** into the **Rows** box.", "Drag **Amount** into the **Values** box."),
    P("The pivot table shows each region with its total sales."),
    C('text', `Row Labels   Sum of Amount
East               4600
North              7800
South              7750
Grand Total       20150`),
    P("Compare with lesson 6: the numbers match the `SUMIF` results, and the Grand Total is 20150. If you tick the field boxes instead of dragging, Excel makes a guess where to put them. Text fields go to Rows and number fields to Values."),
    H("The four areas"),
    L("**Rows**: the groups listed down the side.", "**Columns**: the groups listed across the top. Use it to compare two things.", "**Values**: what to calculate. Total, count, average, minimum or maximum.", "**Filters**: a drop-down at the top to look at part of the data, such as one staff member."),
    P("Drag **Staff** into Columns and you get a table of regions by staff member. Each cell shows the total amount for a region and person pair. Drag **Item** into Rows below Region and each region splits by item. Change the layout until it answers your question."),
    H("Change what is calculated"),
    P("Click the small arrow next to “Sum of Amount” in the Values box, choose **Value Field Settings**, and select Count, Average, Max or Min. To show a percentage, open the **Show Values As** tab and choose “% of Grand Total”. With the Region rows, North becomes about 38.7%, South 38.5% and East 22.8%. Check the percentages add up to 100."),
    P("You can drag the same field into Values twice and show a total and a count side by side. Rename a heading by clicking it and typing, for example `Total sales`."),
    H("Number formats and tidy layout"),
    P("Right-click a number in the pivot table, choose **Number Format**, and set a thousands separator. Formats set this way stay when you refresh. Formatting cells the normal way may be lost. Use **PivotTable Design** to choose a style and a report layout, such as Tabular, which looks more like a normal table."),
    H("Filters and slicers"),
    P("Drag **Staff** into the Filters box. A drop-down appears above the pivot table to choose one person. For a friendlier option, use **PivotTable Analyze, Insert Slicer** and tick a field. Buttons appear. Click one to filter the whole pivot table."),
    H("Group dates"),
    P("If your data has real dates, put the date field in Rows. Right-click a date in the pivot, choose **Group**, and select Months, Quarters or Years. A year of daily sales becomes twelve monthly lines. This works only if every date is a true date. A single text value in the column stops the grouping."),
    H("Refresh when the data changes"),
    P("A pivot table does not update by itself. After you change the source data or add rows, right-click the pivot table and choose **Refresh**, or use **Data, Refresh All**. If you add rows to a normal range outside a Table, the pivot may not include them. A source that is an Excel Table (lesson 10) grows automatically, so refreshing picks up the new rows. This is a good reason to build pivot tables from Tables."),
    H("Pivot charts"),
    P("With a cell in the pivot table selected, choose **Insert, PivotChart**. The chart follows the pivot table, and changes if you change the fields or use a slicer. The next lesson covers charts in more detail."),
    H("Rules for a pivot-friendly source table"),
    L("One heading row, with a name in every column heading. A blank heading causes an error.", "No blank rows or merged cells in the data.", "One kind of value in each column. Numbers should be real numbers, not text.", "No subtotals or grand totals mixed in with the data.", "Consistent spelling. “North” and “north ” will be counted as different groups if there are spaces."),
    H("Typical questions a pivot table answers"),
    L("Which product sells the most? (Item in Rows, Sum of Qty in Values, sort largest to smallest.)", "Which salesperson produces the most revenue? (Staff in Rows.)", "How do sales change month by month? (Date grouped by month.)", "How many orders did each region have? (Region in Rows, Count of Item.)"),
    N("If a number in a pivot table looks wrong, double-click it. Excel creates a new sheet with the rows behind that number, so you can see exactly what was added."),
    ...task("Build a pivot table with Region in Rows and the Sum of Amount in Values. Check it against the totals from lesson 6.", "Add Staff in Columns and see the totals for each pair.", "Create a second pivot with Item in Rows and the Sum of Qty. Sort so the largest is at the top. Pen pack should be first with 55.", "Change a price in the data, then refresh the pivot table and see the totals change."),
    ...check("The grand total is 20150.", "The Qty by item totals are Pen pack 55, Notebook 45, Mouse 6, Backpack 3 and Desk lamp 3.", "You know how to refresh a pivot table and why it does not update by itself."),
  ], A('From many rows to a summary', [
    n('data', 'Your table', 'detailed rows', 0, 0, 'data'), n('fields', 'Drag fields', 'Rows, Columns, Values', 1, 0, 'tool'),
    n('pivot', 'Pivot table', 'totals by group', 2, 0, 'app'), n('ref', 'Refresh', 'after data changes', 3, 0, 'check'),
  ], [
    { say: 'Start with a tidy table of detailed rows, such as every sale.', on: ['data'] },
    { say: 'In the PivotTable Fields panel, drag Region to Rows and Amount to Values.', flow: ['data>fields:choose fields'] },
    { say: 'Excel groups the rows and shows one line per region with its total, plus a grand total.', flow: ['fields>pivot:summarise'] },
    { say: 'If the data changes, press Refresh. Pivot tables do not update on their own.', flow: ['pivot>ref:refresh'] },
  ]), [
    faq('Why does my pivot table not show new data?', 'Pivot tables do not refresh automatically. Right-click the pivot and choose Refresh. If the source is a normal range, extend it, or better, use an Excel Table as the source.'),
    faq('Why will my dates not group by month?', 'At least one cell in the date column is text or blank. Convert them all to real dates first.'),
  ]),
];
