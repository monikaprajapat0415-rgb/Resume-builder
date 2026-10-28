import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S1 = 'Start Here';
const S2 = 'Formulas';

const SALES = `   A          B          C       D     E       F       G
1  Date       Item       Region  Qty   Price   Staff   Amount
2  01-Jun     Notebook   North   10    120     Asha
3  01-Jun     Pen pack   South   25    80      Ben
4  02-Jun     Backpack   North   2     1400    Asha
5  03-Jun     Notebook   East    15    120     Chidi
6  03-Jun     Desk lamp  South   3     650     Ben
7  04-Jun     Mouse      East    4     700     Chidi
8  05-Jun     Pen pack   North   30    80      Asha
9  06-Jun     Backpack   South   1     1400    Ben
10 07-Jun     Notebook   South   20    120     Ben
11 08-Jun     Mouse      North   2     700     Asha`;

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'excel-screen-cells-first-sheet', 'Excel for Beginners: The Screen, Cells and Your First Sheet', 'Excel for Beginners: Screen and Cells',
    'Learn the Excel screen, cells, rows, columns and ranges, enter data, save your file and meet the shortcuts you will use every day. No experience needed.', [
    P("Excel is a program for working with tables of numbers and text. If you have ever kept a list of expenses in a notebook, written marks in rows and columns, or made a price list, you already understand what Excel is for. The difference is that Excel can add, count, sort, search and draw charts for you, instantly and without mistakes in the arithmetic. In nearly every office, shop, school, hospital and factory that uses computers, someone uses Excel. That is why job adverts for office, admin, accounts, sales support and data entry roles so often mention it."),
    P("This course uses one small shop's sales sheet from start to finish, so every lesson builds on the last. You can follow with any recent version of Microsoft Excel. The free Excel for the web, Google Sheets and LibreOffice Calc work almost the same for the basics, and small differences are mentioned where they matter. If your computer is a Mac, use the Cmd key wherever the lesson says Ctrl."),
    H("The parts of the screen"),
    L("**Workbook and worksheet.** The whole file is a **workbook**. Inside it are **worksheets**, also called sheets, shown as tabs at the bottom. A new workbook starts with one or more sheets, and you can add more with the plus button.", "**Cells.** The boxes in the grid. Each cell has an address made from its column letter and row number. The cell in column B and row 3 is **B3**.", "**Rows and columns.** Rows run across and are numbered 1, 2, 3. Columns run down and are lettered A, B, C. A sheet has over a million rows and more than sixteen thousand columns, far more than you will need.", "**Range.** A group of cells, written with a colon: **A1:C5** means the block from A1 to C5.", "**The formula bar.** Above the grid. It shows what is really inside the selected cell. A cell may show 20150 while the formula bar shows `=SUM(G2:G11)`.", "**The ribbon.** The tabs at the top (Home, Insert, Formulas, Data, View) with buttons grouped by task.", "**The Name Box.** To the left of the formula bar. It shows the selected cell's address, and you can type an address to jump there."),
    H("Your first sheet"),
    P("Open a new blank workbook. Click cell A1 and type `Date`, then press **Tab** to move right and type `Item`, and so on. Press **Enter** to go down. In this way you can type a row of headings and then rows of data without touching the mouse. Type the following table, starting at A1. Leave the Amount column empty for now, because you will fill it with a formula in lesson 3."),
    C('text', SALES),
    P("These ten rows are the sales of a small shop in the first week of June. Qty is how many were sold and Price is the price of one. We will use this table in all the lessons. Save the file now as `shop-sales.xlsx` using **File, Save As**, or press **Ctrl+S**. Choose a folder you can find again. Save often. Excel can lose work if your computer switches off, and while newer versions have AutoSave for files kept online, you should not rely on it."),
    H("Selecting and moving"),
    L("**Click** a cell to select it, or click and drag to select a range.", "**Click a column letter or row number** to select the entire column or row.", "**Arrow keys** move one cell. **Ctrl+Arrow** jumps to the end of a block of data, which is a huge time saver on long lists.", "**Ctrl+Shift+Arrow** selects from the current cell to the end of the block.", "**Ctrl+A** selects everything. **Ctrl+Home** goes to A1.", "**Tab** moves right, **Shift+Tab** moves left, and **Enter** moves down after typing."),
    H("Entering, changing and deleting"),
    L("Type into a cell and press Enter to store it.", "To change a cell, select it and press **F2**, or double-click it. Press **Esc** to cancel an edit.", "Press **Delete** to clear the contents of selected cells.", "To delete a whole row, right-click its number and choose Delete. To insert one, right-click and choose Insert.", "**Ctrl+Z** undoes the last action and **Ctrl+Y** redoes it. Do not be afraid to try things. Undo is your friend."),
    H("Copy, cut and paste"),
    P("**Ctrl+C** copies, **Ctrl+X** cuts and **Ctrl+V** pastes. Copying a cell with a formula adjusts it for the new position, which you will study in lesson 3. A small clipboard icon appears after pasting, and its options let you paste only values, only formats or only formulas. A very useful trick is **Ctrl+D**, which fills down. Select a cell with data and the cells below it, press Ctrl+D, and the top cell is copied into all of them."),
    H("Rename and add sheets"),
    P("Double-click a sheet tab to rename it, for example to `Sales`. Right-click a tab to move, copy, delete or colour it. Give sheets clear names. Months or purposes such as `Jan`, `Feb` and `Summary` are much easier to understand than `Sheet1` and `Sheet2`."),
    H("Two habits that make you look professional"),
    O("**One table, one purpose.** Put headings in the first row, data underneath, no empty rows or columns inside the table, and no merged cells in the data area. Tools like sorting, filtering and pivot tables need this tidy shape.", "**Never type a number as text with letters mixed in.** Write `120`, not `Rs. 120` or `120 rupees` in the same cell. You can show currency symbols with formatting (lesson 2). Text in a number column breaks the arithmetic."),
    N("Excel works with many languages and regions. In some countries the list separator in formulas is a semicolon instead of a comma, and decimals use a comma. If a formula in this course does not work, try replacing commas with semicolons."),
    H("What you can do with Excel at work"),
    L("**Lists:** attendance, stock, customers, tasks, contacts.", "**Calculations:** totals, averages, percentages, GST or VAT, commission and discounts.", "**Reports:** monthly sales, expenses, marks, production counts.", "**Checking:** finding duplicates, missing values and mistakes in data.", "**Charts:** turning numbers into a picture for a manager."),
    ...task("Create the workbook and type the sales table into A1:F11. Save it as `shop-sales.xlsx`.", "Rename the sheet to `Sales`.", "Practise: jump to the end of the table with Ctrl+Down, return with Ctrl+Home, and select the whole Qty column data with Ctrl+Shift+Down.", "Change the Mouse price in F7 to `750`, check it in the formula bar, then undo it with Ctrl+Z."),
    ...check("The table fills A1:F11, with headings in row 1 and ten rows of data.", "You can say the address of the cell holding `Backpack` in the first Backpack row: B4.", "The file is saved, and you know where."),
  ], A('Parts of a worksheet', [
    n('wb', 'Workbook', 'the whole file', 0, 0, 'store'), n('sheet', 'Worksheet', 'a tab such as Sales', 1, 0, 'app'),
    n('cell', 'Cell', 'B3 = column B, row 3', 2, 0, 'data'), n('rng', 'Range', 'A1:C5, a block', 3, 0, 'out'),
  ], [
    { say: 'A workbook is the Excel file. It holds one or more worksheets.', on: ['wb'] },
    { say: 'A worksheet is a grid of rows and columns, shown as a tab at the bottom.', flow: ['wb>sheet:contains'] },
    { say: 'Each box in the grid is a cell. Its address is the column letter and the row number, such as B3.', flow: ['sheet>cell:made of'] },
    { say: 'A group of cells is a range, written with a colon, such as A1:C5.', flow: ['cell>rng:grouped'] },
  ]), [
    faq('Do I need to buy Microsoft Excel to follow this course?', 'No. The basics work in Excel for the web, Google Sheets and LibreOffice Calc, which are free. A few features, such as XLOOKUP, differ between programs.'),
    faq('Why does Excel say a formula is wrong when it looks right?', 'Some countries use a semicolon instead of a comma in formulas. Try replacing the commas with semicolons.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'enter-and-format-data', 'Enter and Format Data: Numbers, Dates, Text and Tidy Tables', 'Excel: Format Numbers, Dates and Tables',
    'Understand how Excel treats numbers, text and dates, fix the common problems (numbers stored as text, broken dates), and format a table so it is easy to read.', [
    P("Many Excel problems that look mysterious are really data problems. A total that does not add up, a date that will not sort, a column that refuses to calculate: very often the cause is that Excel is reading a value as the wrong type. This lesson teaches you how Excel sees data, so you can enter it correctly and fix it when it goes wrong. Then you will format your sales table so a manager can read it at a glance."),
    H("Three kinds of values"),
    L("**Numbers.** Can be added, averaged and compared. By default they are aligned to the right of the cell.", "**Text.** Words and anything that is not a number, such as names and codes. Aligned to the left by default.", "**Dates and times.** Excel stores a date as a number: the count of days since the start of 1900. So 1 June 2024 is a number that Excel shows as a date. This is why you can subtract two dates to get the days between them. A time is a fraction of a day."),
    P("This left and right alignment is a quick test. If a number sits on the left of its cell, Excel is probably treating it as text, and it will not add up."),
    H("Numbers stored as text: the classic problem"),
    P("Sometimes numbers arrive as text. For example, a column copied from a website or an accounting program, or a number typed with an apostrophe in front. Signs: the number is left-aligned, there is a small green triangle in the corner of the cell, and `SUM` ignores it. How to fix it:"),
    O("Select the cells with the problem.", "Click the yellow warning icon that appears and choose **Convert to Number**.", "If there is no icon, try multiplying: type `1` in an empty cell, copy it, select the problem cells, choose **Paste Special, Multiply**, then delete the helper cell.", "Another approach is **Data, Text to Columns, Finish** on the selected column, which re-reads each cell."),
    P("The opposite issue also happens. Codes like `007` or phone numbers with a leading zero lose the zero because Excel treats them as numbers. Format those cells as **Text** before typing, or type an apostrophe first: `'007`."),
    H("Dates"),
    P("Dates are tricky because countries write them differently. `03/04/2024` is 3 April in India, the UK and most of Africa, but 4 March in the United States. Excel follows the regional setting of your computer. To avoid confusion in shared files, enter dates in a clear form such as `03-Apr-2024`, or use the unambiguous `2024-04-03`."),
    L("If a date is left-aligned, Excel did not recognise it, and it is text. Retype it in a form your computer accepts, or use **Text to Columns, Date** to convert a whole column.", "To show the same date in a different style, change the format (below), not the value.", "Press **Ctrl+;** (Ctrl and semicolon) to enter today's date as a fixed value."),
    H("Number formats"),
    P("A format changes how a value looks, not what it is. A cell holding 0.18 can show as `0.18`, `18%` or `18.00%` without changing the number. Select cells, press **Ctrl+1** to open Format Cells, and choose a category."),
    L("**Number** with a set number of decimals and an optional thousands separator.", "**Currency or Accounting** with a symbol such as ₹, £, $ or any other. It only changes the look. Excel does not convert between currencies.", "**Percentage.** Typing `18%` stores 0.18. Applying the percent format to 0.18 shows 18%.", "**Date** in many styles, and **Time**.", "**Text** to keep exactly what you type."),
    P("A useful rule: store the number, format the look. Do not type `Rs. 1,200` into a cell. Type `1200` and apply a format. Then the cell can still be added."),
    H("Make a table easy to read"),
    P("Good formatting is not decoration. It makes a table quick to read and shows that you care about details. Apply these to your sales table."),
    O("Select the headings in row 1 and make them **bold** with Ctrl+B. Give them a fill colour from the Home tab, and centre them.", "Select the Price and Amount columns, press Ctrl+1 and choose Number with 0 decimals and a thousands separator. Use the style your region uses.", "Select the Date column and choose a date format like `01-Jun`.", "Double-click the line between two column letters to **auto-fit** the width to the longest entry. Do this for every column.", "Add thin borders around the table: Home, Borders, All Borders.", "**Freeze the heading row** so it stays visible when you scroll: View, Freeze Panes, Freeze Top Row."),
    H("Things to avoid"),
    L("**Merged cells in your data.** Merging cells for a title is fine above the table, but not inside it, because sorting and filtering break. Use **Center Across Selection** (in Format Cells, Alignment) instead.", "**Blank rows and columns inside a table.** They split it into pieces.", "**Several tables stacked on one sheet** with no space between. Keep one table per sheet or leave an empty row and column between them.", "**Too many colours and fonts.** Two or three colours is enough.", "**Hidden rows or columns you forgot.** They can hide errors."),
    H("The AutoFill handle"),
    P("In the bottom right corner of a selected cell is a small square called the fill handle. Drag it to copy a value or continue a pattern. If you type `Monday` and drag, you get Tuesday, Wednesday and so on. If you type `1` and `2` in two cells, select both and drag, you get 3, 4, 5. Double-click the handle to fill down as far as the data in the next column goes. This is very handy for formulas."),
    N("Data entry jobs often require speed and accuracy. Learn to type numbers with the number pad, use Tab and Enter to move without the mouse, and check your work by reading it once aloud or comparing the total to the source."),
    ...task("Format your sales table as described: bold coloured headings, auto-fit columns, number format on Price and Qty, borders and a frozen top row.", "Type the text `007` in a new cell and see what happens. Then format a cell as Text and type it again.", "Type `3/4/2024` in a cell. Check if it reads as 3 April or 4 March. Change the format to show the month name.", "Use the fill handle to produce the days Monday to Sunday."),
    ...check("Headings are bold and the top row stays visible when you scroll.", "You can tell which cells hold numbers and which hold text by looking at their alignment.", "You can explain why a date should be entered in an unambiguous form."),
  ], A('Value or look?', [
    n('val', 'What is stored', '0.18 is a number', 0, 0, 'data'), n('fmt', 'Format', 'percentage, currency, date', 1, 0, 'tool'),
    n('show', 'What you see', '18%', 2, 0, 'out'), n('text', 'Stored as text?', 'green triangle, left side', 1, 1, 'check'),
  ], [
    { say: 'Excel stores a number, a date as a number of days, or text.', on: ['val'] },
    { say: 'A number format changes how the value looks. It does not change the value.', flow: ['val>fmt:apply format'] },
    { say: 'So 0.18 can appear as 18%. The calculations still use 0.18.', flow: ['fmt>show:display'] },
    { say: 'If a number is left-aligned with a green triangle, it is stored as text. Convert it to a number so that it can be added.', flow: ['val>text:problem'] },
  ]), [
    faq('Why does SUM ignore some of my numbers?', 'Those numbers are probably stored as text. Look for left alignment and a green triangle, and use Convert to Number or Text to Columns.'),
    faq('How do I keep a leading zero?', 'Format the cells as Text before typing, or type an apostrophe first, such as 007.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S2, 'first-formulas-and-cell-references', 'Your First Formulas: Cell References and the $ Sign', 'Excel Formulas and Cell References',
    'Write formulas with +, -, *, /, copy them correctly, and understand relative and absolute references ($). Fill the Amount column of the sales table.', [
    P("A formula is what makes Excel more than a table. Instead of typing a total, you tell Excel how to work it out, and it recalculates when the data changes. If you change a price, every amount that depends on it updates at once. This lesson teaches the rules of formulas and the single most important idea in Excel: cell references, including the dollar sign that confuses so many beginners."),
    H("The basics"),
    L("A formula always starts with an equals sign `=`.", "Use the operators `+` add, `-` subtract, `*` multiply, `/` divide and `^` power.", "Excel does multiplication and division before addition and subtraction. Use brackets to control the order, like in school maths: `=(A1+A2)*3`.", "Refer to other cells by their address instead of typing the numbers: `=D2*E2`."),
    P("Click cell G2 in the sales sheet, type the following and press Enter."),
    C('text', `=D2*E2`),
    P("It multiplies the Qty (10) by the Price (120), and G2 shows 1200. Now click G2 again and look at the formula bar. The cell shows the result, and the formula bar shows the formula. If you change D2 to 12, G2 becomes 1440 immediately."),
    H("Typing with the mouse"),
    P("You do not have to type the addresses. Type `=`, click D2, type `*`, click E2, and press Enter. Excel writes `=D2*E2` for you. This is faster and avoids typing mistakes. You can also use the arrow keys."),
    H("Copy the formula down"),
    P("You need an amount for all ten rows. Do not retype. Select G2 and double-click the fill handle (the small square in the bottom right corner), or drag it down to G11. Excel copies the formula, and adjusts it for each row."),
    C('text', `G2:  =D2*E2   -> 1200
G3:  =D3*E3   -> 2000
G4:  =D4*E4   -> 2800
...
G11: =D11*E11 -> 1400`),
    P("This is called a **relative reference**. When you copy a formula down by one row, every row number in it goes up by one. When you copy it right by one column, every column letter shifts by one. The formula remembers the relationship, “the two cells to my left”, rather than the exact addresses. This is what makes copying formulas so powerful."),
    H("Absolute references: the dollar sign"),
    P("Sometimes you want a reference to stay fixed when you copy. Suppose a tax rate of 5% sits in cell J1 and you want a Tax column with `=G2*J1`. Copy that down and in row 3 it becomes `=G3*J2`, which points to an empty cell. The rate must not move."),
    P("Put dollar signs in front of the column letter and row number: `$J$1`. The formula `=G2*$J$1` is copied down as `=G3*$J$1`, `=G4*$J$1` and so on. This is an **absolute reference**."),
    C('text', `Relative:   J1     moves when copied
Absolute:   $J$1   never moves
Mixed:      $J1    column fixed, row moves
            J$1    row fixed, column moves`),
    P("There is a shortcut. Click inside the reference in the formula bar and press **F4** (Cmd+T on a Mac). Each press cycles through `J1`, `$J$1`, `J$1` and `$J1`. Use the one you need."),
    N("Mini rule: if a formula refers to a single input cell, such as a tax rate, a discount or an exchange rate, make that reference absolute. Type such values in a labelled cell, not inside the formula. That way you can change the rate in one place, and nobody has to hunt for a hidden number."),
    H("Practice: a tax column"),
    P("Add a label `Tax rate` in I1 and the value `5%` in J1. Add a heading `Tax` in H1. In H2 type `=G2*$J$1` and copy it down. For the first row, 1200 times 5% gives 60. Use the tax rate of your own country and product when you build a real sheet. The 5% here is only an example."),
    H("Formulas that point to other sheets"),
    P("You can refer to a cell on another sheet by putting the sheet name and an exclamation mark in front: `=Sales!G2`. If the sheet name has spaces, put it in quotes: `='Jan sales'!G2`. Click the other sheet while typing the formula and Excel writes it for you."),
    H("Seeing and checking formulas"),
    L("Press **Ctrl+`** (the key above Tab, called the grave accent or backtick) to show all formulas on the sheet instead of results. Press it again to go back.", "Select a cell and use **Formulas, Trace Precedents** to see arrows to the cells it uses.", "Click a cell with a formula and press **F2**. Excel colour-codes the referenced cells so you can see which ones are used."),
    H("Common mistakes"),
    L("**Forgetting the equals sign.** Typing `D2*E2` shows the text, not the answer.", "**Typing numbers inside formulas.** `=D2*120` works until the price changes. Refer to the cell.", "**Forgetting the dollar sign** and getting wrong results lower down a copied formula.", "**Mixing text and numbers**, for example a number with “pcs” attached. The formula returns a `#VALUE!` error.", "**Deleting a cell that formulas use**, which gives `#REF!`."),
    ...task("Fill G2:G11 with `=D2*E2` and copy it down.", "Add the tax-rate cell and a Tax column with an absolute reference, as described.", "Change the Notebook price in E2 to 150 and see G2 and H2 change.", "Show all formulas with Ctrl+` and then switch back."),
    ...check("G2 = 1200, G3 = 2000, G4 = 2800, G5 = 1800, G6 = 1950, G7 = 2800, G8 = 2400, G9 = 1400, G10 = 2400 and G11 = 1400 (with the original prices).", "Every row of the Tax column points to $J$1.", "You can say in one sentence the difference between J1 and $J$1."),
  ], A('Relative and absolute references', [
    n('f', 'Formula in G2', '=D2*E2', 0, 0, 'app'), n('copy', 'Copy down', 'drag the fill handle', 1, 0, 'tool'),
    n('rel', 'Relative', 'D3*E3, D4*E4 ...', 2, 0, 'data'), n('abs', 'Absolute', '$J$1 never moves', 2, 1, 'check'),
  ], [
    { say: 'You type a formula in G2. It multiplies the cells two and three places to its left.', on: ['f'] },
    { say: 'Copy it down with the fill handle.', flow: ['f>copy:copy'] },
    { say: 'A relative reference changes with the row: row 3 uses D3 and E3, row 4 uses D4 and E4.', flow: ['copy>rel:adjusts'] },
    { say: 'A reference with dollar signs, such as $J$1, stays on the same cell, which is right for a tax rate.', flow: ['copy>abs:stays fixed'] },
  ]), [
    faq('What does the dollar sign mean in Excel?', 'It locks part of a cell reference so it does not change when you copy the formula. $J$1 always points to J1. Press F4 to add or remove the dollar signs.'),
    faq('Why does my formula show as text instead of a result?', 'The cell may be formatted as Text, or the formula may be missing the equals sign. Change the format to General, and retype with = at the start.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S2, 'sum-average-count-min-max', 'SUM, AVERAGE, COUNT, MIN and MAX: The Everyday Functions', 'Excel SUM, AVERAGE, COUNT, MIN, MAX',
    'Use the functions that every office job needs: SUM, AVERAGE, COUNT, COUNTA, MIN, MAX, ROUND and AutoSum, with ranges and the status bar shortcut.', [
    P("A **function** is a ready-made formula with a name. Instead of writing `=G2+G3+G4+...` for a hundred cells, you write `=SUM(G2:G101)`. Excel has hundreds of functions, but a small handful does most of the work in real jobs. This lesson covers the ones you will use every single day."),
    H("The shape of a function"),
    C('text', `=FUNCTIONNAME(argument1, argument2, ...)`),
    P("A function starts with `=`, then its name, then brackets holding the **arguments**, the values or ranges it works on, separated by commas. When you type a function name, Excel shows a tooltip with its arguments. Use the **Tab** key to accept the suggested function, and always close the bracket."),
    H("SUM"),
    P("`SUM` adds numbers. Click an empty cell below the table, say G13, and type:"),
    C('text', `=SUM(G2:G11)`),
    P("With the original data the answer is **20150**, the total sales for the week. You can give `SUM` several ranges or numbers: `=SUM(G2:G5, G9)`. Cells containing text are ignored."),
    P("**AutoSum** is a shortcut. Select the cell under a column of numbers and press **Alt+=**. Excel guesses the range and enters `SUM` for you. Check that the range is right before pressing Enter."),
    H("AVERAGE"),
    C('text', `=AVERAGE(G2:G11)      -> 2015`),
    P("It adds the numbers and divides by how many there are. Twenty thousand one hundred fifty divided by ten is 2015. Empty cells and text are skipped. A zero is counted, though, which can lower the average. Be careful with blanks that are really zeros."),
    H("COUNT and COUNTA"),
    L("`COUNT(range)` counts cells that contain **numbers**. `=COUNT(D2:D11)` returns 10.", "`COUNTA(range)` counts cells that are **not empty**, including text. `=COUNTA(B2:B11)` returns 10 because there are ten items.", "`COUNTBLANK(range)` counts empty cells, which is useful for finding missing data."),
    P("Use `COUNTA` to count how many entries are in a list of names. Use `COUNT` to count numeric entries."),
    H("MIN and MAX"),
    C('text', `=MIN(G2:G11)   -> 1200   (smallest sale)
=MAX(G2:G11)   -> 2800   (largest sale)`),
    P("Smallest and largest values. They also work with dates: the earliest and latest date in a column."),
    H("The status bar"),
    P("When you select a range of numbers, the bar at the bottom of the window shows the average, count and sum immediately, with no formula needed. Select G2:G11 and look. It is perfect for a quick check. Right-click the status bar to add more such as Min and Max."),
    H("ROUND, ROUNDUP and ROUNDDOWN"),
    P("Money often needs rounding. Use `ROUND(number, digits)`."),
    C('text', `=ROUND(2015.678, 2)    -> 2015.68
=ROUND(2015.678, 0)    -> 2016
=ROUND(2015.678, -1)   -> 2020   (to the nearest ten)
=ROUNDUP(2015.1, 0)    -> 2016
=ROUNDDOWN(2015.9, 0)  -> 2015`),
    P("Formatting to two decimals only changes how a number looks, and the real value underneath remains long. When a result must be exactly rounded, for example prices that are paid in cash, use `ROUND` in the formula."),
    H("Percentages of a total"),
    P("A common task is what share each item makes of the total. In H2 write `=G2/$G$13` where G13 holds the total, and copy down. Format the column as a percentage. For the first row, 1200 out of 20150 is about 6%. The dollar signs keep the total fixed, as you learned in the last lesson."),
    H("Using whole columns"),
    P("`=SUM(G:G)` adds the entire column G, so new rows are included automatically. This is convenient for sheets that keep growing, but be careful not to include your own total cell in the range, or Excel complains about a circular reference. Keep totals above the data, on a separate sheet, or use a range that stops before them."),
    H("Common errors"),
    L("`#DIV/0!` means you divided by zero or by an empty cell. Check the denominator, or wrap with `IFERROR` (next lesson).", "`#NAME?` means Excel does not recognise a name. You mistyped a function name.", "`#VALUE!` means a value is the wrong type, such as text where a number is needed.", "`#REF!` means a cell the formula used was deleted.", "`####` in a cell is not an error in the formula. The column is too narrow to show the number. Widen it."),
    H("Check your answer"),
    P("Always sanity-check results. Do the totals look sensible? Is the average between the minimum and the maximum? Does the count equal the number of rows you can see? If a total looks odd, click the cell, press F2 and see which cells the formula includes. Most mistakes come from a range that is one row too short or too long."),
    ...task("Add these cells below your table, with labels in column F: total with `SUM`, average with `AVERAGE`, count with `COUNT`, smallest and largest sale.", "Use AutoSum (Alt+=) to total the Qty column. The answer is 112.", "Add a column showing each row's share of the total, formatted as a percentage.", "Use `ROUND` to show the average to 1 decimal place."),
    ...check("Total = 20150, average = 2015, count = 10, min = 1200, max = 2800 and total Qty = 112.", "The percentage column adds up to 100%.", "You can explain what `#DIV/0!` and `####` mean."),
  ], A('Functions do the heavy work', [
    n('rng', 'A range', 'G2:G11', 0, 0, 'data'), n('fn', 'A function', 'SUM, AVERAGE, MIN, MAX', 1, 0, 'tool'),
    n('res', 'One result', '20150', 2, 0, 'out'), n('bar', 'Status bar', 'quick check, no formula', 1, 1, 'check'),
  ], [
    { say: 'You select a range of cells, such as the ten amounts in G2:G11.', on: ['rng'] },
    { say: 'A function such as SUM, AVERAGE, MIN or MAX works on every number in the range.', flow: ['rng>fn:range'] },
    { say: 'It returns a single result. The total of the ten sales is 20150.', flow: ['fn>res:result'] },
    { say: 'For a quick check, the status bar shows the sum, average and count of selected cells with no formula.', flow: ['rng>bar:select cells'] },
  ]), [
    faq('What is the difference between COUNT and COUNTA?', 'COUNT counts cells with numbers. COUNTA counts all cells that are not empty, including text.'),
    faq('Why does the cell show #### instead of a number?', 'The column is too narrow. Double-click the line between column letters to auto-fit the width.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'if-and-or-iferror-logic', 'IF, AND, OR and IFERROR: Making Excel Decide', 'Excel IF, AND, OR and IFERROR Functions',
    'Make formulas that make decisions with IF, combine tests with AND and OR, nest IFs sensibly and hide errors with IFERROR. Examples for commission and results.', [
    P("So far Excel has only calculated. Now it will decide. The `IF` function lets a formula choose between two results depending on a test, for example “if the sale is big, show Large, otherwise show Small”. Office jobs use `IF` all the time: pass or fail, late or on time, bonus or no bonus, stock low or okay. This lesson teaches it clearly, with the other logic functions that go with it."),
    H("The IF function"),
    C('text', `=IF(test, value_if_true, value_if_false)`),
    P("The **test** is a comparison that is either true or false. You build it with the signs `=`, `<>` (not equal), `>`, `<`, `>=` and `<=`. In the sales table, add a heading `Size` in column L (leave I to K for the tax rate from lesson 3) and type in L2:"),
    C('text', `=IF(G2>=2000, "Large", "Small")`),
    P("Row 2 has an amount of 1200, which is less than 2000, so it shows `Small`. Copy it down. Rows with amounts 2000, 2800, 2800, 2400 and 2400 show `Large`, and the rest show `Small`. Text inside a formula goes in double quotes. Numbers do not."),
    H("Using cell references in the test"),
    P("Never hide the threshold inside a formula where nobody can see it. Put 2000 in a labelled cell, say O1 with the label `Large from` in N1, and write `=IF(G2>=$O$1, \"Large\", \"Small\")`. Now a manager can change the limit and the whole column updates."),
    H("Calculating inside IF"),
    P("The results can be calculations, not just words. A shop gives a 10% discount on amounts of 2000 or more:"),
    C('text', `=IF(G2>=2000, G2*0.9, G2)`),
    P("With G2 = 2000 the result is 1800. With 1200 it stays 1200. Again, a real sheet should keep the 0.9 or the 10% in a labelled cell."),
    H("Testing text"),
    C('text', `=IF(C2="North", "Head office", "Branch")`),
    P("Text comparisons in Excel ignore upper and lower case, so `\"north\"` also matches. Spelling and extra spaces matter, so “North ” with a trailing space will not equal “North”. Lesson 8 shows how to remove stray spaces."),
    H("AND and OR: more than one condition"),
    L("`AND(test1, test2)` is true only if **all** the tests are true.", "`OR(test1, test2)` is true if **any** of the tests is true.", "`NOT(test)` reverses a test."),
    P("They are used inside `IF`. For example, a bonus is paid if the sale is at least 2000 and the region is North:"),
    C('text', `=IF(AND(G2>=2000, C2="North"), "Bonus", "No bonus")
=IF(OR(C2="North", C2="East"), "Priority", "Normal")`),
    P("In our data the only North row with an amount of 2000 or more is row 4 (the Backpack, 2800) and row 8 (the pens, 2400), so those two show `Bonus`."),
    H("Nested IF: more than two outcomes"),
    P("When you have three or more outcomes, put one `IF` inside another. Grade a sale as High, Medium or Low."),
    C('text', `=IF(G2>=2500, "High", IF(G2>=1500, "Medium", "Low"))`),
    P("Excel checks the first test. If it is true you get “High”. If not, it goes to the second `IF` inside. Rows are checked from the top, so put the strictest condition first. Rows 4 and 7 (2800) show High. Rows 3, 5, 6, 8 and 10 (2000, 1800, 1950, 2400 and 2400) show Medium, and the other three show Low."),
    P("Nested IFs get hard to read after three levels. Newer Excel versions (2019 and 365) have `IFS`, which lists conditions in turn, and `SWITCH` for exact matches. A lookup table (lesson 7) is the cleanest choice when there are many bands."),
    C('text', `=IFS(G2>=2500, "High", G2>=1500, "Medium", TRUE, "Low")`),
    H("IFERROR: tidy up errors"),
    P("A formula that hits an error shows ugly codes like `#DIV/0!`. `IFERROR(value, value_if_error)` replaces the error with something friendly."),
    C('text', `=IFERROR(G2/D2, 0)
=IFERROR(VLOOKUP(B2, Prices, 2, FALSE), "Not found")`),
    P("Use it with care. It can hide real mistakes. Prefer to handle expected cases (an empty denominator, a missing code) and let unexpected errors show, so that you notice them."),
    H("A realistic example: pass or fail"),
    P("A training centre records marks out of 100. Pass is 40 or more in each of two papers. A formula in the result column:"),
    C('text', `=IF(AND(B2>=40, C2>=40), "Pass", "Fail")`),
    P("The same idea works for attendance (`IF(days>=75%...)`), overdue invoices (`IF(TODAY()>due, \"Overdue\", \"OK\")`) and low stock (`IF(stock<=reorder, \"Order\", \"OK\")`)."),
    H("Common mistakes"),
    L("Forgetting quotes around text results. `=IF(A1>5, Yes, No)` gives `#NAME?`.", "Using a comma where your region wants a semicolon.", "Putting the conditions in the wrong order in a nested IF, so an earlier test catches everything.", "Comparing text that has extra spaces or different spelling.", "Counting brackets wrongly. Click in the formula and Excel highlights matching brackets."),
    ...task("Add a `Size` column with `IF` (Large from 2000), using a labelled threshold cell.", "Add a `Grade` column with a nested `IF` or `IFS` for High, Medium and Low.", "Add a `Bonus` column that uses `AND` for North and 2000 or more.", "Add a column `Qty per rupee` = `IFERROR(D2/E2, 0)` and think about when this might fail."),
    ...check("Size shows Large on five rows (3, 4, 7, 8 and 10, the amounts 2000, 2800, 2800, 2400 and 2400) and Small on the other five.", "Bonus shows on rows 4 and 8 only.", "You can explain why the order of conditions matters in a nested IF."),
  ], A('A formula that decides', [
    n('test', 'Test', 'G2 >= 2000 ?', 0, 0, 'check'), n('yes', 'If true', '"Large"', 1, 0, 'out'),
    n('no', 'If false', '"Small"', 1, 1, 'data'), n('col', 'Whole column', 'copy it down', 2, 0, 'app'),
  ], [
    { say: 'IF starts with a test, such as: is the amount 2000 or more?', on: ['test'] },
    { say: 'If the test is true, the formula returns the first result, for example the word Large.', flow: ['test>yes:true'] },
    { say: 'If the test is false, it returns the second result, for example Small.', flow: ['test>no:false'] },
    { say: 'Copy the formula down and every row makes its own decision.', flow: ['yes>col:all rows', 'no>col:all rows'] },
  ]), [
    faq('How many IFs can I nest in Excel?', 'Modern Excel allows many levels, but more than three become hard to read. Use IFS, SWITCH or a lookup table when there are many outcomes.'),
    faq('Why does IFERROR sometimes cause problems?', 'It hides every error, including real mistakes. Use it for expected cases such as division by zero, and keep unexpected errors visible so you can fix them.'),
  ]),

  // ---------------------------------------------------------------- 6
  les(S2, 'sumif-countif-averageif-sumifs', 'SUMIF, COUNTIF and SUMIFS: Totals for Each Group', 'Excel SUMIF, COUNTIF and SUMIFS',
    'Total, count and average only the rows that match a condition: sales per region, per person or per item, with one or several conditions.', [
    P("Totals for the whole sheet are useful, but managers ask more precise questions. How much did the North region sell? How many orders did Ben handle? What was the total for Notebooks in the South? The `IF` family of functions answers these in one cell, without sorting or filtering. They are some of the most used functions in real offices."),
    P("We use the sales table from earlier, with Amount in column G. If you did not finish the Amount column, fill it with `=D2*E2` first."),
    H("SUMIF: add numbers that meet a condition"),
    C('text', `=SUMIF(range_to_check, condition, range_to_add)`),
    P("To get the total sales of the North region:"),
    C('text', `=SUMIF(C2:C11, "North", G2:G11)     -> 7800`),
    P("Excel looks down C2:C11 for rows where the region equals North, and adds the matching amounts from G2:G11. The North rows are 1200, 2800, 2400 and 1400, which add up to 7800. The ranges must have the same size. You can put the condition in a cell instead of in quotes. If I1 contains `South`, use `=SUMIF(C2:C11, I1, G2:G11)`, and change I1 to see another answer."),
    P("Similarly, per staff member and per item:"),
    C('text', `=SUMIF(F2:F11, "Ben", G2:G11)         -> 7750
=SUMIF(B2:B11, "Notebook", G2:G11)    -> 5400`),
    H("Conditions with signs"),
    P("A condition can be a comparison, written as text in quotes."),
    C('text', `=SUMIF(G2:G11, ">=2000")        -> adds the amounts of 2000 or more
=SUMIF(D2:D11, "<5", G2:G11)    -> amounts where Qty is below 5
=SUMIF(B2:B11, "<>Mouse", G2:G11) -> everything except mouse sales`),
    P("When you leave out the last argument, `SUMIF` adds the cells it is checking. The first example adds 2000, 2800, 2800, 2400 and 2400 for a total of 12400. The other two are the same shape and are easy to test yourself."),
    H("Wildcards"),
    P("In conditions, `*` stands for any text and `?` for one character. `=SUMIF(B2:B11, \"Note*\", G2:G11)` totals every item starting with “Note”. `\"*pack\"` finds items ending in pack."),
    H("COUNTIF: count the matching rows"),
    C('text', `=COUNTIF(C2:C11, "North")     -> 4
=COUNTIF(G2:G11, ">=2000")    -> 5
=COUNTIF(F2:F11, "Ben")       -> 4`),
    P("Four sales were in the North, five sales were 2000 or more, and Ben handled four sales. `COUNTIF` is also the quick way to find duplicates: `=COUNTIF(A:A, A2)` returns how many times the value in A2 appears. If it is more than 1, it is a duplicate."),
    H("AVERAGEIF"),
    C('text', `=AVERAGEIF(C2:C11, "North", G2:G11)    -> 1950`),
    P("The average North sale: 7800 divided by 4 equals 1950."),
    H("SUMIFS, COUNTIFS and AVERAGEIFS: more than one condition"),
    P("When you need several conditions together, add an **S** to the name. All conditions must be true. Notice that in `SUMIFS` the range to add comes **first**. This is the opposite of `SUMIF`, and a common source of mistakes."),
    C('text', `=SUMIFS(G2:G11, C2:C11, "South", B2:B11, "Notebook")   -> 2400
=COUNTIFS(C2:C11, "North", G2:G11, ">=2000")           -> 2
=AVERAGEIFS(G2:G11, F2:F11, "Ben", C2:C11, "South")    -> 1937.5`),
    P("In the first example, the only South Notebook row is row 10, which is 2400. The second asks for North sales of 2000 or more, and there are two (2800 and 2400). In the third, Ben's four sales are all in the South: 2000, 1950, 1400 and 2400, with a total of 7750 and an average of 1937.5."),
    H("Build a small summary table"),
    P("These functions make a neat report. On a new sheet called `Summary`, list the regions in A2:A4 (North, South, East) and write in B2:"),
    C('text', `=SUMIF(Sales!$C$2:$C$11, A2, Sales!$G$2:$G$11)`),
    P("Copy it down. The dollar signs keep the ranges fixed while `A2` moves to A3 and A4. You get North 7800, South 7750 and East 4600, which together equal the total of 20150. Always check that the parts add up to the total, so you can be sure that no rows are missed because of a spelling difference."),
    H("Why a total might be missing rows"),
    L("A region is spelled “Noth” or has a trailing space. The `IF` family needs an exact match apart from capitals.", "Numbers stored as text in the range to add (lesson 2).", "The ranges are different sizes or do not line up.", "New rows were added below the range. Use a Table (lesson 10), which grows automatically, or whole-column references."),
    ...task("Build a `Summary` sheet with totals per region, per staff member and per item using `SUMIF`.", "Add counts with `COUNTIF` for each region.", "Use `SUMIFS` to find the total for Pen packs in the North (2400).", "Check that your regional totals add up to 20150."),
    ...check("North = 7800, South = 7750 and East = 4600.", "By staff: Asha = 7800, Ben = 7750 and Chidi = 4600.", "By item: Notebook = 5400, Pen pack = 4400, Backpack = 4200, Desk lamp = 1950 and Mouse = 4200."),
  ], A('Add only what matches', [
    n('rng', 'Region column', 'C2:C11', 0, 0, 'data'), n('cond', 'Condition', '"North"', 1, 0, 'check'),
    n('add', 'Amount column', 'G2:G11', 1, 1, 'data'), n('res', 'SUMIF result', '7800', 2, 0, 'out'),
  ], [
    { say: 'SUMIF looks down one column, here the Region column, for rows that meet a condition.', on: ['rng'] },
    { say: 'The condition is North. Rows with a different region are skipped.', flow: ['rng>cond:test each row'] },
    { say: 'For each matching row, it takes the number from the amount column in the same row.', flow: ['cond>add:matching rows'] },
    { say: 'It adds them up: 1200 + 2800 + 2400 + 1400 = 7800.', flow: ['add>res:total'] },
  ]), [
    faq('What is the difference between SUMIF and SUMIFS?', 'SUMIF has one condition and takes the range to add last. SUMIFS allows many conditions and takes the range to add first.'),
    faq('Why does SUMIF give 0 when I can see matching rows?', 'The text probably differs slightly, for example by a trailing space or a spelling difference, or the numbers are stored as text. Clean the data and try again.'),
  ]),
];
