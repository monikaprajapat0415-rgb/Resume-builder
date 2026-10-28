import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S4 = 'Organising and Reporting';
const S5 = 'Work Skills';

export const lessons = [
  // ---------------------------------------------------------------- 12
  les(S4, 'excel-charts-and-simple-dashboard', 'Excel Charts: Show Your Numbers in a Picture', 'Excel Charts for Reports and Dashboards',
    'Choose the right chart, build column, line and pie charts, make them readable, and combine a pivot table, charts and slicers into a dashboard.', [
    P("Numbers in a table are exact, but a chart shows a pattern at a glance. Which region is strongest? Did sales rise during the week? A good chart answers a question in a few seconds, and a bad one confuses people. This lesson shows how to build the common charts in a few clicks, and how to make them clear. We use the regional totals from the earlier lessons: North 7800, South 7750 and East 4600."),
    H("Choose the chart for the question"),
    L("**Column or bar chart.** Compares amounts between groups, such as sales by region or by item. Use bars (horizontal) when category names are long. This is the most useful chart.", "**Line chart.** Shows change over time, such as daily or monthly sales. Dates go along the bottom.", "**Pie or doughnut chart.** Shows parts of a whole, only when there are a few slices (up to five) and the parts add up to 100%. Pies are hard to read when slices are similar, so a bar chart is often better.", "**Scatter chart.** Shows the relationship between two numbers, such as advertising spend and sales.", "**Combination chart.** Columns plus a line, for example sales and target."),
    P("Ask first: what do I want the reader to notice? Then pick the simplest chart that shows it."),
    H("Build your first chart"),
    O("Make a small summary table on a sheet: regions in one column and totals next to them (use `SUMIF` from lesson 6, or copy the pivot table values).", "Select the table including the headings.", "Go to **Insert, Recommended Charts** and look at the suggestions, or choose **Insert, Column Chart, Clustered Column**.", "The chart appears on the sheet. Drag it to move, and drag a corner to resize."),
    P("You get three bars, one for each region, with the North and South bars almost equal and the East bar clearly lower. That is the story of the data, visible in a second."),
    H("Make it clear"),
    P("Click the chart, and use the **plus** button beside it (Chart Elements) and the **brush** button (Styles). A clear chart has these parts."),
    L("**A title that says something.** Instead of Chart Title, write Sales by region, first week of June. Even better, state the message: North and South lead, East is behind.", "**Axis labels with units** if they are not obvious, such as Amount (rupees), using your own currency.", "**Data labels** showing the values on the bars, so nobody has to guess. Delete the gridlines if you add labels.", "**No legend** if there is only one series. Keep it when there are several.", "**Sorted bars.** Sort the table from largest to smallest before charting, unless the order has a meaning, such as time.", "**A starting point of zero** on the vertical axis for bar charts. A bar chart that starts at a high number exaggerates differences.", "**Few colours.** One colour for ordinary bars and one highlight colour for the point you want people to notice."),
    H("A line chart for time"),
    P("To show sales per day, make a small table with the dates down one column and the daily totals next to it. Select it and choose **Insert, Line Chart**. The dates run along the bottom. A line suits data that is in sequence. If the dates have gaps, such as weekends with no data, Excel may treat the axis as a timeline with empty days. In **Format Axis**, choose Text axis if you prefer to show only the dates you have."),
    H("Pie chart, when it is right"),
    P("For the three regions, a pie shows North 38.7%, South 38.5% and East 22.8%. Add data labels with percentages. A pie works here because there are only three slices, and the question is about shares of the total. Do not use a pie for values that do not add up to a whole, or for more than five or six groups."),
    H("Charts from a pivot table"),
    P("Click in the pivot table and choose **PivotChart** (Insert, PivotChart). The chart is linked to the pivot table. Add a slicer, and when you click a staff member, the table and the chart change together. Refresh after the data changes (lesson 11)."),
    H("Chart mistakes to avoid"),
    L("Too many categories or series, so the chart looks crowded.", "3D effects, shadows and bright backgrounds that distract from the data.", "A truncated axis that makes a small difference look big.", "Colours that are hard to tell apart, or that rely on red and green alone. Some readers cannot tell them apart.", "A title like Sheet1 Chart.", "Copying a chart as a picture and forgetting to update it later."),
    H("A simple dashboard"),
    P("A dashboard puts the most important numbers and charts on one page. Keep it simple."),
    O("Create a sheet named `Dashboard`.", "Add three or four headline numbers at the top, such as Total sales (`SUM`), Number of orders (`COUNT`) and Best region. Make them large and bold, in cells with a light background.", "Place two or three charts underneath: sales by region, sales by item and sales by day.", "Add slicers for Region and Staff, and connect them to the pivot tables behind the charts (right-click the slicer, Report Connections).", "Turn off gridlines on that sheet (View, untick Gridlines), align the charts neatly, and set the page to print on one page."),
    P("Do not put every possible number on it. Choose what the manager needs for decisions. A page that is tidy and quick to read is more useful than a busy one."),
    H("Copy a chart to a report"),
    P("Select the chart and press Ctrl+C. In Word or PowerPoint, use Paste Special and choose Picture, if you do not want it to change, or paste with the destination theme if you want it to match. You can also right-click the chart and choose **Save as Picture** to get an image file."),
    N("Check your chart against the numbers before you share it. A wrong range can silently leave out the last row. Click the chart, and Excel highlights the source range on the sheet."),
    ...task("Make a summary table of sales by region and build a clustered column chart. Add a clear title and data labels.", "Make a line chart of daily total sales for 1 to 8 June.", "Create a pie chart for the three regions with percentage labels, and decide whether the column chart or the pie tells the story better.", "Build a one-page dashboard with three headline numbers, two charts and a slicer."),
    ...check("The column chart shows North 7800, South 7750 and East 4600, with the title and the labels.", "The vertical axis of the bar chart starts at zero.", "The dashboard fits on one printed page."),
  ], A('From numbers to a clear chart', [
    n('q', 'Your question', 'which region leads?', 0, 0, 'user'), n('type', 'Choose chart', 'bars, lines, pie', 1, 0, 'tool'),
    n('tidy', 'Tidy it', 'title, labels, zero axis', 2, 0, 'check'), n('dash', 'Dashboard', 'a few numbers and charts', 3, 0, 'out'),
  ], [
    { say: 'Start with the question you want the chart to answer.', on: ['q'] },
    { say: 'Pick the simplest chart for it: bars to compare, lines for time, a pie only for a few parts of a whole.', flow: ['q>type:pick'] },
    { say: 'Make it readable: a clear title, data labels, a zero start on bar charts and few colours.', flow: ['type>tidy:improve'] },
    { say: 'Combine a few headline numbers and two or three charts on one tidy dashboard page.', flow: ['tidy>dash:combine'] },
  ]), [
    faq('When should I use a pie chart?', 'Only when you show parts of a whole with up to five or so slices. For comparing similar values, a bar chart is easier to read.'),
    faq('Why should a bar chart start at zero?', 'A bar represents its length. If the axis starts at a high number, small differences look large and the chart misleads the reader.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S5, 'data-validation-conditional-formatting-protection', 'Data Validation, Conditional Formatting and Protecting Your Sheet', 'Excel Validation and Conditional Formatting',
    'Stop wrong entries with drop-down lists and rules, highlight what matters with conditional formatting, and protect formulas from accidental changes.', [
    P("A sheet that only you use can be rough. A sheet that other people fill in needs rules. Otherwise someone types Nortth for North, enters a negative quantity, or overwrites a formula, and the totals quietly go wrong. Three features help: **data validation** to control what can be typed, **conditional formatting** to make important values stand out, and **protection** to guard the cells that must not change. These are the features that make a workbook look professional and trustworthy."),
    H("Data validation: only allow good entries"),
    P("Select the cells, then choose **Data, Data Validation**. In the Settings tab you pick what is allowed."),
    L("**Whole number or Decimal** between limits. For Qty, whole numbers from 1 to 1000.", "**List.** The user picks from a drop-down. Type the items separated by commas (North,South,East) or point to a range on another sheet.", "**Date** within a range, such as not before the start of the year.", "**Text length**, for example a code that must be 6 characters.", "**Custom** with a formula. For example `=COUNTIF($A$2:$A$100, A2)=1` allows each value only once."),
    P("A drop-down list is the best fix for the problem of spelling differences. Select C2:C11, choose Data Validation, List, and type `North,South,East`. Each cell now shows an arrow and offers only those three values. Anything else is rejected."),
    P("Use the other two tabs well. **Input Message** shows a short help note when the cell is selected, such as Pick a region. **Error Alert** gives the message and the style when someone breaks the rule. Style Stop blocks the entry. Warning and Information allow the person to continue. Write messages in plain words: Please choose North, South or East from the list."),
    N("Validation is not perfect. Pasted data can bypass the rules, and people can still write over a cell. Use **Data, Data Validation, Circle Invalid Data** to find entries that already break the rule."),
    H("A list that grows"),
    P("If the list of allowed values changes over time, put them in a Table (lesson 10) on a `Lists` sheet. Select the list cells, give them a name in the Name Box (for example `RegionList`), and type `=RegionList` as the validation source. A simpler way is to store the list in a column and refer to it with an absolute range that has some empty space at the end."),
    H("Conditional formatting: colour by rule"),
    P("Select the cells and choose **Home, Conditional Formatting**. Excel changes the look of a cell depending on its value, and the formatting follows when the values change."),
    L("**Highlight Cells Rules.** Greater Than, Less Than, Between, Equal To, Text that Contains, Duplicate Values. Select Amount, choose Greater Than 2500, and pick a fill colour. The 2800 amounts are highlighted.", "**Top/Bottom Rules.** Top 3 items, above average, bottom 10%.", "**Data Bars.** A small bar inside each cell shows the size of the value.", "**Colour Scales.** A gradient from low to high.", "**Icon Sets.** Arrows or traffic lights."),
    P("Use these sparingly. Too many colours hide the message. A good rule: highlight the exceptions, such as overdue items, low stock and errors, and keep the rest plain."),
    H("Formula-based rules"),
    P("Choose **New Rule, Use a formula to determine which cells to format**. Write a formula that is true for the first cell in the selected range. Excel applies it to the rest in the same pattern. To shade the whole row when the region is North:"),
    C('text', `Applies to:  =$A$2:$G$11
Formula:     =$C2="North"`),
    P("The dollar sign in front of C fixes the column, and the missing dollar sign before 2 lets the row change. This is the mixed reference from lesson 3, and it is the key to row highlighting. More examples:"),
    C('text', `=$G2>=2500                      big sales
=AND($D2<5, $C2="East")         small East orders
=$A2<TODAY()-30                 more than 30 days old
=COUNTIF($B$2:$B$11,$B2)>1      duplicates
=MOD(ROW(),2)=0                 shade every second row`),
    P("To remove or edit rules, use **Conditional Formatting, Manage Rules** and choose to show rules for This Worksheet."),
    H("Protect cells and sheets"),
    P("By default every cell is **locked**, but locking does nothing until you protect the sheet. The recipe: first unlock the cells that people should be able to change, then protect the sheet."),
    O("Select the input cells, such as Qty, Price and Staff. Press Ctrl+1, open the **Protection** tab and untick **Locked**.", "Choose **Review, Protect Sheet**. You can set a password, or leave it blank for protection against accidents only.", "Tick the actions you still want to allow, such as selecting cells, sorting or using filters.", "Press OK. Now only the unlocked cells can be edited, and the formulas are safe."),
    P("Be honest about what protection is. Sheet protection and workbook passwords are meant to prevent mistakes. They are not strong security, and passwords on sheets can be removed with widely known methods. Never rely on them for confidential data. For that, use proper file permissions, encryption and access controls. If you set a password, keep it in a safe place. If you lose it, you may not be able to edit your own sheet."),
    H("Hide and show"),
    L("Hide a column or row with right-click, Hide. Unhide by selecting around it, right-click, Unhide.", "Hide a sheet from the tab right-click menu. Hidden items are not secure. Anyone can unhide them.", "Never hide something just to look tidy if someone else needs to check it. Say it is there."),
    H("Check your workbook before sharing"),
    O("**Review, Check Accessibility** and fix the main problems, such as missing headings.", "**File, Info, Check for Issues, Inspect Document** to find hidden data, comments and personal information that you may not want to share.", "Look for errors with **Formulas, Error Checking**.", "Have someone else try the workbook with fresh eyes."),
    ...task("Add a drop-down list for Region (North, South, East) with an input message and a stop alert. Try to type another value.", "Add a rule so Qty must be a whole number between 1 and 1000.", "Highlight Amount values of 2500 or more, and shade whole rows where Region is North with a formula rule.", "Unlock only Qty, Price and Staff, then protect the sheet and check you cannot overwrite a formula."),
    ...check("A mistyped region is rejected, and the drop-down offers the three valid values.", "Two amounts (2800) are highlighted by the Greater Than 2500 rule.", "Clicking a formula cell on the protected sheet gives a warning that it is protected."),
  ], A('Rules, signals and guards', [
    n('dv', 'Data validation', 'drop-down, limits', 0, 0, 'check'), n('data', 'Good data', 'no typos, valid numbers', 1, 0, 'data'),
    n('cf', 'Conditional format', 'colour the exceptions', 2, 0, 'tool'), n('prot', 'Protect sheet', 'formulas stay safe', 3, 0, 'out'),
  ], [
    { say: 'Data validation limits what can be typed: a drop-down list, a number range or a date range.', on: ['dv'] },
    { say: 'The result is cleaner data, with no spelling variations or impossible numbers.', flow: ['dv>data:rules'] },
    { say: 'Conditional formatting colours the cells that matter, such as big sales or overdue items.', flow: ['data>cf:highlight'] },
    { say: 'Protecting the sheet locks the formulas, and leaves only the input cells open for editing.', flow: ['cf>prot:protect'] },
  ]), [
    faq('Is Excel sheet protection secure?', 'No. It prevents accidental changes, but sheet passwords can be removed with common tools. Do not rely on it for confidential data. Use file permissions or encryption instead.'),
    faq('How do I highlight a whole row based on one cell?', 'Use a formula rule with a mixed reference, such as =$C2="North", applied to the whole table range. The dollar sign fixes the column and lets the row change.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S5, 'print-share-and-keyboard-shortcuts', 'Print, Share and Work Faster: Page Setup and Shortcuts', 'Excel Printing, Sharing and Shortcuts',
    'Print a sheet properly on one page, save as PDF, share safely, add comments, and learn the keyboard shortcuts that make you visibly faster at work.', [
    P("A workbook is only useful if people can read and use it. Often that means printing it, sending a PDF, or sharing a file with colleagues. Many Excel files look fine on screen and print badly: columns cut off, a second page with only one column on it, no headings on page two. This lesson fixes those problems, covers sharing safely, and then gives you the keyboard shortcuts that make people think you are very good at Excel."),
    H("Print properly"),
    O("Open **File, Print**, or press **Ctrl+P**, and look at the preview first.", "Set the **orientation**. Choose Landscape for wide tables.", "Choose **Fit All Columns on One Page** in the scaling options. This is the most useful print setting. If the text becomes tiny, reduce the columns, or allow two pages across.", "Select the paper size, such as A4 or Letter, to match your printer and country.", "Check the page margins, and use **Custom Margins** if needed."),
    P("For more control, go to **Page Layout** and open the Page Setup window with the small arrow in the corner."),
    L("**Print Area.** Select a range, then Page Layout, Print Area, Set Print Area, so that only that part is printed.", "**Print Titles.** Under Sheet, set Rows to repeat at top to `$1:$1` so the heading row appears on every page of a long list.", "**Header and Footer.** Add page numbers (Page 1 of 3), the file name, the date, or a company name.", "**Gridlines and headings.** Tick Print Gridlines if the data has no borders.", "**Page Break Preview** (View tab) shows the page boundaries as blue lines, which you can drag."),
    P("Before printing a long report, always look at the preview and check the last page. Printing 40 pages by mistake wastes paper and time."),
    H("Save as PDF"),
    P("A PDF looks the same on every device and cannot be changed by accident. Choose **File, Save As** or **Export** and pick PDF. Options let you publish only the selected range, the active sheet or the whole workbook. Check the preview first, as for printing. Sending a PDF is better than an Excel file when the person only needs to read the result."),
    H("Share the file"),
    L("**Email attachments.** Make sure the file name is meaningful and includes a date or version, such as `shop-sales-2024-06.xlsx`. Avoid names like `final-final2`.", "**Cloud sharing.** In Microsoft 365, OneDrive or SharePoint, use Share to give a link, and choose who can view and who can edit. Several people can edit at once, and the file keeps a version history. Google Sheets works the same way.", "**Check before you send.** Use Inspect Document (lesson 13) to remove hidden data and personal information. Look for hidden sheets. Make sure no confidential data is in a sheet that you did not intend to share.", "**Send the right version.** If your workbook has formulas that link to other files, the receiver may see errors. Convert to values, or send a PDF."),
    N("Treat spreadsheets with personal data, such as salaries, phone numbers or ID numbers, carefully. Share only with people who need to see them, protect the file, and delete copies you no longer need. Follow your employer's rules and the data protection laws of your country."),
    H("Comments and notes"),
    P("Right-click a cell and choose **New Comment** or **New Note** to leave a message for a colleague. Comments (threaded) let people reply, and notes are simple yellow sticky notes. Use them to explain unusual values or to ask a question, instead of putting text into the cell itself."),
    H("Version habits"),
    L("Save a new copy before a big change: `file-v2.xlsx`.", "Do not overwrite the only copy of raw data.", "Keep formulas visible and add a short Notes sheet saying where the data came from, what each sheet does and any assumptions. Your future self will thank you."),
    H("Keyboard shortcuts that save time"),
    P("These work on Windows. On a Mac, use Cmd in place of Ctrl in most cases. Learn two or three each week, until your hands remember them."),
    C('text', `Basics
Ctrl+C / Ctrl+X / Ctrl+V     copy / cut / paste
Ctrl+Z / Ctrl+Y              undo / redo
Ctrl+S                       save
Ctrl+F / Ctrl+H              find / replace
Ctrl+P                       print

Moving and selecting
Ctrl+Arrow                   jump to the edge of the data
Ctrl+Shift+Arrow             select to the edge of the data
Ctrl+Home                    go to A1
Ctrl+A                       select all (press twice inside a table)
Shift+Space / Ctrl+Space     select the row / the column

Editing
F2                           edit the cell
Ctrl+Enter                   fill the selected cells with what you typed
Ctrl+D / Ctrl+R              fill down / fill right
Alt+Enter                    new line inside a cell
Ctrl+; / Ctrl+Shift+;        today's date / current time
Ctrl+- / Ctrl+Shift++        delete / insert cells, rows or columns

Formulas
Alt+=                        AutoSum
F4                           toggle $ in a reference
Ctrl+\`                       show formulas

Format and data
Ctrl+1                       Format Cells
Ctrl+B / Ctrl+I / Ctrl+U     bold / italic / underline
Ctrl+T                       make a Table
Ctrl+Shift+L                 turn filters on and off
Alt, N, V                    insert a pivot table
Ctrl+PageUp / PageDown       previous / next sheet`),
    P("Practising them for five minutes a day works better than trying to memorise the list at once. When a skills test measures speed, shortcuts really help."),
    H("Other time savers"),
    L("**Paste Special** (Ctrl+Alt+V): paste only values, formats, formulas, or transpose rows into columns.", "**Format Painter** (the paintbrush on the Home tab): copy a format to other cells. Double-click it to apply it several times.", "**Quick Access Toolbar:** add the buttons you use most.", "**Name Box:** type a range such as `A1:G500` to select it quickly.", "**Templates:** save a workbook as a template (File, Save As, Excel Template) for invoices, attendance and the like."),
    ...task("Set up the Sales sheet to print on one landscape page with the heading row repeated on each page, page numbers in the footer and a header that says Shop sales, first week of June.", "Export it as a PDF, and look at the result.", "Use Inspect Document, and add a Notes sheet that says where the data came from.", "Choose five shortcuts from the list that you do not already use, and use only those for a day."),
    ...check("The print preview shows a single page with all columns, a heading and a page number.", "The PDF opens and looks the same as the preview.", "You used at least five new shortcuts without the mouse."),
  ], A('Get a sheet ready for others', [
    n('prev', 'Print preview', 'landscape, fit columns', 0, 0, 'check'), n('pdf', 'Save as PDF', 'same on every device', 1, 0, 'tool'),
    n('insp', 'Inspect', 'hidden data, errors', 2, 0, 'check'), n('send', 'Share', 'right people, right file', 3, 0, 'out'),
  ], [
    { say: 'Set the page up first: landscape, fit all columns, repeat the heading row, add page numbers.', on: ['prev'] },
    { say: 'Save as PDF when people only need to read the result.', flow: ['prev>pdf:export'] },
    { say: 'Before you send an Excel file, inspect it for hidden sheets, comments and personal data.', flow: ['pdf>insp:check'] },
    { say: 'Share only with the people who need it, and use a clear file name or a protected link.', flow: ['insp>send:share'] },
  ]), [
    faq('How do I print a heading row on every page?', 'Open Page Layout, Print Titles, and set Rows to repeat at top to the heading row, such as $1:$1.'),
    faq('Should I send an Excel file or a PDF?', 'Send a PDF if people only need to read the results, because it looks the same everywhere and cannot be changed by accident. Send Excel if they need to work with the data.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S5, 'excel-for-office-jobs-tests-and-next-steps', 'Excel for Office Jobs: Tests, Real Tasks and Next Steps', 'Excel Skills Tests and Office Job Tasks',
    'Practise the tasks that appear in Excel skills tests and real office jobs, describe your skills honestly on a resume, and plan what to learn next.', [
    P("You now have the main Excel skills that office, admin, accounts, sales support and data entry jobs need. This last lesson puts them to work. It shows the tasks that employers commonly give in Excel tests, practical mini-projects you can build for your portfolio, how to describe your Excel skills honestly on a resume, and where to go next."),
    H("What employers usually test"),
    P("An Excel test for a junior role is often a short practical task, 20 to 40 minutes, on a sample workbook. Typical items:"),
    L("Clean a list: trim spaces, fix capitals, remove duplicates (lesson 8).", "Calculate columns with correct formulas and absolute references (lessons 3 and 4).", "Use `IF`, `SUMIF` or `COUNTIF` for a result (lessons 5 and 6).", "Look up values from another table with `VLOOKUP`, `XLOOKUP` or `INDEX MATCH` (lesson 7).", "Sort, filter and format a table neatly (lessons 2 and 10).", "Build a pivot table and a chart (lessons 11 and 12).", "Print or set up a sheet for one page (lesson 14).", "Sometimes: data validation, conditional formatting or date calculations (lessons 9 and 13)."),
    P("The employer looks at three things: whether the answers are correct, whether you used sensible methods (formulas, not typed numbers), and whether the sheet looks tidy. Accuracy comes first."),
    H("A practice test you can do now"),
    P("Here is a mini-test using the shop data. Do it with a timer of 30 minutes, without looking at the lessons."),
    O("Put the Sales data into a Table named `Sales`.", "Add `Amount = Qty * Price` for each row, using a Table formula.", "Add a `Category` column from a price list with a lookup.", "Show total sales, number of orders, and the average order value in three cells.", "Make a summary of sales by region with `SUMIF`, and check that it adds up to the total.", "Add an `Overdue` or `Size` column with `IF`.", "Create a pivot table of sales by staff and a column chart from it.", "Highlight all amounts above 2500 and set the sheet to print on one page, landscape."),
    P("Then check yourself. Total sales 20150, 10 orders, average 2015, North 7800, South 7750, East 4600. If your numbers match, the key skills work."),
    H("Real office tasks you can model"),
    P("Build small, real workbooks. They prove your skills better than a certificate on its own, and they are good practice. Ideas:"),
    L("**An invoice template.** Customer details, line items with quantity and price, tax at a rate in one cell, a total, and the invoice number and due date. Use your own country's tax rules, which you should check from an official source.", "**An attendance sheet.** Names down, days across, P and A entries with a drop-down, a count of days present, and a percentage with conditional formatting under a limit.", "**A monthly expense tracker.** Date, category, amount, with a pivot table and a chart by category.", "**A stock register.** Items, opening stock, received, issued, closing stock by formula, and a flag when stock is under the reorder level.", "**A marks or results sheet.** Subject marks, total, percentage, a result with `IF`, and a rank with `RANK`.", "**A simple payroll calculation.** Hours, rate, overtime, deductions. Use plain test numbers, not real people's data, and check statutory rules with official guidance."),
    P("Keep the files neat, with a Notes sheet and sample data that is invented. Never use real names, salaries or phone numbers in a public portfolio."),
    H("Describe your Excel skills honestly"),
    P("Most resumes say “Proficient in MS Excel”. It means little. Be specific and truthful, and match it to the job advert. For example:"),
    C('text', `Weak:    MS Excel - advanced

Better:  Excel: formulas (IF, SUMIF, VLOOKUP), pivot tables, charts,
         data cleaning and validation. Built a stock register and
         monthly expense tracker (practice projects).`),
    L("Name the functions and features you can actually use.", "Mention a real task or project, without exaggeration.", "Say basic, intermediate or advanced honestly. An interviewer may test you.", "If a job asks for macros or Power Query and you have not used them, say you are learning them, and that you know the basics."),
    P("Our resume builder lets you list skills and projects clearly, and the ATS checker shows how a reading program sees your file. Both are free to try. Use the job advert's exact wording where it is true, for example `pivot tables` or `VLOOKUP`."),
    H("Common mistakes in Excel tests"),
    L("Typing a number that should be calculated by a formula.", "Forgetting absolute references and getting wrong results when copying.", "Not checking totals against a simple second method.", "Leaving the sheet untidy: no headings, mixed formats, columns too narrow.", "Running out of time on one hard question. Do the easy items first.", "Saving in the wrong format or place. Read the instructions on how to submit."),
    H("What to learn next"),
    L("**More lookups and dynamic arrays:** `XLOOKUP`, `FILTER`, `SORT`, `UNIQUE` (Microsoft 365).", "**Power Query** (Get and Transform data) for cleaning and combining data from files without formulas. It is very valuable.", "**Power Pivot and the data model** for larger analysis.", "**Macros and VBA** to automate repeated tasks, or Office Scripts.", "**Google Sheets and LibreOffice**, since many workplaces use them.", "**SQL** for databases, in our SQL for Beginners course, when your data outgrows spreadsheets.", "**Python with pandas** for larger or repeated analysis, in our Python course."),
    P("The best way to improve is to use Excel for real things: your budget, a family business list, a club's accounts, a study timetable. Each small project teaches you something new. Keep a list of the questions you could not answer, and look them up."),
    N("Spreadsheet mistakes are common and can be expensive in real organisations. Whenever the numbers matter, check them a second way and ask a colleague to review them. Care and a habit of checking are as valuable as any function."),
    ...task("Do the practice test in 30 minutes and compare your results with the numbers given.", "Build one of the practice projects, such as the invoice template or the attendance sheet, with invented sample data.", "Write the Excel line of your resume in the Better style, using only skills you really have.", "Choose one item from the learn-next list and plan two hours for it this week."),
    ...check("Your results match: total 20150, 10 orders, average 2015, North 7800, South 7750, East 4600.", "Your project uses formulas, not typed totals, and has a Notes sheet.", "Your resume line names specific features and has no exaggerated claims."),
  ], A('From practice to a job-ready skill', [
    n('learn', 'Learn the tools', 'formulas, lookups, pivots', 0, 0, 'app'), n('build', 'Build real files', 'invoice, attendance, stock', 1, 0, 'tool'),
    n('test', 'Practise tests', 'timed tasks', 2, 0, 'check'), n('job', 'Show it honestly', 'resume and interview', 3, 0, 'out'),
  ], [
    { say: 'You have learned the core Excel tools: formulas, lookups, tables, pivots and charts.', on: ['learn'] },
    { say: 'Build small real files, such as an invoice, an attendance sheet or a stock register, with invented data.', flow: ['learn>build:apply'] },
    { say: 'Practise a timed test on a sample workbook, and check your numbers a second way.', flow: ['build>test:practise'] },
    { say: 'Describe your skills honestly, naming the functions and projects, and be ready to show them.', flow: ['test>job:present'] },
  ]), [
    faq('What Excel skills do office jobs usually ask for?', 'Common asks are formulas such as SUM, IF, SUMIF and VLOOKUP, sorting and filtering, pivot tables, charts, formatting and printing. Check the job advert for the exact list.'),
    faq('How should I write Excel on my resume?', 'Name the specific functions and features you can use, and mention a real task or project. Avoid vague labels like advanced unless you can demonstrate them.'),
  ]),
];
