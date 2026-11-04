import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { kt, file } from './files.js';

const S = 'Building Real Apps';
const HONEST = "The code in this course was syntax-checked with a Kotlin parser. It was not compiled or run on a device while the course was written, so type it in, build it in Android Studio and fix any small differences your tool versions show. Library versions move quickly: accept the newer versions Android Studio suggests.";

export const lessons = [
  // 6
  les(S, 'project-3-unit-converter-dropdown-menus-and-validation', 'Project 3: Unit Converter with Dropdown Menus', 'Project 3: Unit Converter with Menus',
    'Build an Android unit converter in Compose with dropdown menus, length, weight and temperature categories, validation and clean Kotlin logic.', [
    P("The unit converter is a small app with a clear job: turn 5 kilometres into miles, or 100 degrees Celsius into Fahrenheit. It is useful for learning because it forces you to think about data design. How do you store dozens of units without writing a huge `if` chain? The answer is a table of data, and it is a lesson you will reuse in every later project: when you feel yourself copying code, describe the differences as data instead."),
    H("Concepts in this project"),
    L("**Data-driven design**: each unit is a small object with two functions, `toBase` and `fromBase`. To convert A to B, change A to the base unit, then change the base unit to B. With N units you write N pairs of formulas, not N times N.", "**Dropdown menus**: `ExposedDropdownMenuBox` or a `DropdownMenu` anchored to a button, with items that call a lambda when chosen.", "**Validation**: the input is text, so it may be empty or invalid. The code must show a clear message and never crash.", "**Pure functions**: the conversion has no Android code, so you can test it with no phone."),
    H("Create the project"),
    O("New Empty Activity project `Converter`, package `com.example.converter`. No extra libraries are needed.", "Add `Units.kt` and `ConverterScreen.kt`, and replace `MainActivity.kt`."),
    C('text', `Converter/app/src/main/java/com/example/converter/
  MainActivity.kt      shows ConverterScreen
  Units.kt             unit definitions and the convert function
  ConverterScreen.kt   input, two pickers, result`),
    H("The code"),
    ...kt('p3', 'Units.kt', 'converter'),
    P("Look at temperature. Celsius is the base unit, so `toBase` for Fahrenheit is `(f - 32) * 5 / 9` and `fromBase` is `c * 9 / 5 + 32`. Length and weight units just multiply by a factor. Because every unit follows the same shape, the screen needs no special cases at all."),
    ...kt('p3', 'ConverterScreen.kt', 'converter'),
    ...kt('p3', 'MainActivity.kt', 'converter'),
    H("How it works"),
    L("The category chips choose a list of units. When the category changes, both pickers are reset to sensible units from the new list.", "`Picker` is a reusable composable: it shows the current unit, opens a menu when tapped and reports the choice through `onPick`. Its own `expanded` state is local, because nobody else cares whether a menu is open.", "The result is recomputed from the typed text. If the text is not a number, no result is shown instead of an error."),
    H("Expected output"),
    P("Choose Length, type 5, from Kilometres to Miles: the result reads about 3.107. Choose Temperature, type 100, from Celsius to Fahrenheit: 212. Type 0 from Celsius to Fahrenheit: 32. Type 72 from Fahrenheit to Celsius: about 22.22. Swapping the two units gives the reverse conversion."),
    N(HONEST),
    ...task("Build the app and check the four example conversions.", "Add a swap button between the two pickers that exchanges the units.", "Add a new category, Speed, with metres per second, kilometres per hour and miles per hour.", "Round the output to four decimal places with `\"%.4f\".format(value)`."),
    ...check("Every example above matches.", "Typing letters or leaving the box empty never crashes.", "Adding Speed needed changes to the data only, not the screen."),
  ], A('Convert through a base unit', [
    n('in', 'Input', '5 km', 0, 0, 'user'), n('base', 'Base unit', 'metres', 1, 0, 'store'),
    n('out', 'Target unit', 'miles', 2, 0, 'tool'), n('res', 'Result', '3.107', 3, 0, 'out'),
  ], [
    { say: 'The user picks 5 kilometres and a target unit of miles.', on: ['in'] },
    { say: 'toBase turns kilometres into metres: 5000.', flow: ['in>base:toBase'] },
    { say: 'fromBase turns metres into miles using the miles factor.', flow: ['base>out:fromBase'] },
    { say: 'The screen shows the number, about 3.107.', flow: ['out>res:show'] },
  ]), [
    faq('Why convert through a base unit?', 'It needs only two formulas per unit. Converting directly between every pair of units would need a formula for each pair, which grows very fast.'),
    faq('How do I keep the menu state?', 'Keep it local with remember when only that composable needs it. Lift it up only if another part of the screen must read or control it.'),
    faq('Is Double accurate enough for money?', 'No. Double is fine for measurements, but money should be stored as whole cents in a Long or in BigDecimal. Project 7 does exactly that.'),
  ]),

  // 7
  les(S, 'project-4-quiz-app-navigation-compose-and-multiple-screens', 'Project 4: Quiz App with Navigation Compose', 'Project 4: Quiz App with Navigation',
    'Build a multi-screen quiz app with Navigation Compose: routes, arguments, the back stack and rememberSaveable state, with full source code.', [
    P("Almost every real app has more than one screen. A shopping app has a list, a product page, a cart and a checkout. In Compose you do not create many Activities for this. You keep one Activity and use **Navigation Compose**, a library that swaps which composable is shown and keeps a back stack, so the system Back button works as users expect."),
    H("Concepts in this project"),
    L("**NavController**: remembers where you are and moves between screens.", "**NavHost**: the place on screen where the current destination is drawn. It lists all the routes.", "**Routes with arguments**: a route such as `result/{score}/{total}` carries values to the next screen.", "**rememberSaveable**: keeps the quiz position through rotation.", "**Back stack**: after the result screen you pop back to home so Back does not return to the last question."),
    H("Create the project"),
    O("New Empty Activity project `QuizApp`, package `com.example.quizapp`.", "Add the Navigation Compose line to the dependencies and sync.", "Create `Questions.kt` and `QuizApp.kt`, and replace `MainActivity.kt`."),
    ...file('gradle/p1-p4.txt', 'app/build.gradle.kts (dependencies)', 'text'),
    C('text', `QuizApp/app/src/main/java/com/example/quizapp/
  MainActivity.kt   starts the app
  Questions.kt      the quiz data
  QuizApp.kt        NavHost and the three screens`),
    H("The code"),
    ...kt('p4', 'Questions.kt', 'quizapp'),
    ...kt('p4', 'QuizApp.kt', 'quizapp'),
    ...kt('p4', 'MainActivity.kt', 'quizapp'),
    H("How it works"),
    L("`NavHost` starts at `home`. Pressing Start calls `navigate(\"quiz\")`.", "The quiz screen keeps `index`, `score` and the chosen answer in `rememberSaveable`, so rotating the phone does not restart the quiz.", "After the last question it navigates to `result/{score}/{total}` and removes the quiz from the back stack with `popUpTo`.", "The result screen reads the two numbers from the route arguments and offers Play again, which returns to home."),
    H("Expected output"),
    P("The home screen shows the quiz title and a Start button. Each question screen shows Question 1 of N, the question and four answer buttons. After an answer is tapped, the correct one turns green and a wrong choice turns red, and a Next button appears. After the last question the result screen says, for example, \"You scored 4 out of 5\". Pressing Back on the result screen leaves the app rather than reopening the last question."),
    N(HONEST),
    ...task("Build the app and play through once, then rotate the phone mid-quiz.", "Add three more questions to `Questions.kt`.", "Show a message on the result screen that depends on the score, such as a different line for a perfect score.", "Add a Settings screen reachable from home and test that Back returns to home."),
    ...check("Rotation keeps the current question and score.", "Back from the result screen leaves the quiz instead of re-entering it.", "You can explain what a route and a back stack are."),
  ], A('Navigation Compose', [
    n('home', 'Home', 'route: home', 0, 0, 'app'), n('quiz', 'Quiz', 'route: quiz', 1, 0, 'app'),
    n('res', 'Result', 'result/4/5', 2, 0, 'out'), n('stack', 'Back stack', 'screens in order', 3, 0, 'store'),
  ], [
    { say: 'The app opens on the home route.', on: ['home'] },
    { say: 'Start navigates to the quiz route. The back stack now holds home and quiz.', flow: ['home>quiz:navigate'] },
    { say: 'At the end the quiz sends the score as route arguments.', flow: ['quiz>res:score, total'] },
    { say: 'popUpTo removes the quiz from the stack, so Back does not return to it.', flow: ['res>stack:popUpTo'] },
  ]), [
    faq('Why use one Activity?', 'Compose navigation switches composables inside one Activity. It is lighter, shares one ViewModel store easily and animates between screens more simply than many Activities.'),
    faq('How do I pass a big object between screens?', 'Pass only an ID in the route and load the object from a ViewModel or database on the next screen. Large objects in routes break easily.'),
    faq('What does popUpTo do?', 'It removes screens from the back stack while navigating. It stops the user from going Back into a screen that no longer makes sense, like a finished quiz.'),
  ]),

  // 8
  les(S, 'project-5-notes-app-room-database-dao-and-flow', 'Project 5: Notes App with a Room Database', 'Project 5: Notes App with Room Database',
    'Build a notes app that saves data on the phone with Room: entity, DAO, Flow and a searchable ViewModel, with add, edit and delete in Compose.', [
    P("So far every app forgot its data when closed. Real apps need to store information on the device. Android has SQLite built in, a small database in a file, and the **Room** library makes it pleasant to use from Kotlin. You describe your table as a class, write queries as functions, and Room generates all the boring code and checks your SQL when the app is built."),
    H("Concepts in this project"),
    L("**Entity**: a data class marked `@Entity`. One class is one table and one object is one row.", "**DAO** (data access object): an interface with functions marked `@Query`, `@Upsert` and `@Delete`. You write the SQL, Room writes the code.", "**Database**: an abstract class marked `@Database` that lists the entities and gives you the DAOs.", "**Flow**: a DAO function that returns `Flow<List<Note>>` emits a new list every time the table changes. The screen updates by itself, with no refresh code.", "**KSP**: a build tool that Room uses to generate its code. You add it as a plugin."),
    H("Create the project"),
    O("New Empty Activity project `Notes`, package `com.example.notes`.", "Add the KSP plugin and the Room, ViewModel and lifecycle libraries from the snippet below, then sync.", "Create the six files."),
    ...file('gradle/p5-p7.txt', 'Gradle additions for projects 5 to 7', 'text'),
    C('text', `Notes/app/src/main/java/com/example/notes/
  Note.kt           the entity (the table)
  NoteDao.kt        queries
  AppDatabase.kt    the database
  NotesViewModel.kt search + data for the screen
  NotesScreen.kt    list, search box, add/edit dialog
  MainActivity.kt   creates the database and shows the screen`),
    H("The code"),
    ...kt('p5', 'Note.kt', 'notes'),
    ...kt('p5', 'NoteDao.kt', 'notes'),
    P("`@Upsert` inserts a new note or updates an existing one with the same ID, so one function covers both Add and Edit. The search query uses `LIKE` with percent signs on either side to match text anywhere in the title or body."),
    ...kt('p5', 'AppDatabase.kt', 'notes'),
    ...kt('p5', 'NotesViewModel.kt', 'notes'),
    P("The ViewModel holds the search text as a `StateFlow`. `flatMapLatest` switches to a fresh database query each time the text changes and drops the old one. The database work runs off the main thread automatically, because Room Flow queries do."),
    ...kt('p5', 'NotesScreen.kt', 'notes'),
    ...kt('p5', 'MainActivity.kt', 'notes'),
    H("Expected output"),
    P("You see a search box, an empty-list message and a floating + button. Tap + and a dialog asks for a title and text. Save, and the note appears in the list at once. Tap a note to edit it. Long-press or use the delete icon to remove it. Type in the search box and the list narrows as you type. Close the app completely and reopen it: the notes are still there, which is the whole point of Room."),
    N("If you change an entity (add a column), raise the database `version` and add a migration, or uninstall the app during development. Production apps must migrate, or users lose their data."),
    N(HONEST),
    ...task("Build the app, add three notes and check that they survive closing the app.", "Add a `createdAt` column and show the date under each title. Raise the version number and remember to uninstall the old build.", "Sort notes with the newest first using `ORDER BY`.", "Add a pin flag and show pinned notes above the others."),
    ...check("Notes persist after the app is killed.", "Search narrows the list as you type.", "You can explain what an entity, a DAO and a Flow are."),
  ], A('Room keeps data on the phone', [
    n('ui', 'NotesScreen', 'shows the list', 0, 0, 'app'), n('vm', 'ViewModel', 'search + actions', 1, 0, 'tool'),
    n('dao', 'DAO', 'SQL queries', 2, 0, 'tool'), n('db', 'SQLite file', 'on the phone', 3, 0, 'store'),
  ], [
    { say: 'The user saves a note. The screen calls the ViewModel.', flow: ['ui>vm:save'] },
    { say: 'The ViewModel calls the DAO, which runs the SQL.', flow: ['vm>dao:upsert'] },
    { say: 'The row is written to the SQLite file on the phone and stays there.', flow: ['dao>db:write'] },
    { say: 'Because the list is a Flow, the database sends the new list back and the screen redraws.', on: ['ui'] },
  ]), [
    faq('Why does Room use Flow?', 'A Flow query keeps watching the table. Whenever a row changes it sends the new result, so the screen stays up to date without any manual refresh.'),
    faq('What is a migration?', 'A migration is code that upgrades an old database to the new table layout without deleting the user\'s data. You need one every time you change an entity in a released app.'),
    faq('Can I run Room queries on the main thread?', 'Not by default, and you should not. Suspend functions and Flow queries run on a background thread for you.'),
  ]),

  // 9
  les(S, 'project-6-weather-app-retrofit-coroutines-and-api-calls', 'Project 6: Weather App with Retrofit and Coroutines', 'Project 6: Weather App with Retrofit',
    'Build a weather app that loads live data from a free API with Retrofit, kotlinx serialization and coroutines, with loading, success and error states in Compose.', [
    P("Most apps talk to a server. Weather, maps, shopping, banking and chat all load data from the internet. Doing this well on a phone is harder than it sounds: the network is slow, it fails, and the app must stay smooth while it waits. In Android you solve this with three tools. **Retrofit** turns a web API into a Kotlin interface. **kotlinx.serialization** turns JSON into Kotlin objects. **Coroutines** let you wait for the network without freezing the screen."),
    H("Concepts in this project"),
    L("**REST API and JSON**: you send an HTTP request to a URL and get back text in JSON form.", "**Retrofit**: you declare `@GET(\"forecast\") suspend fun ...` and it builds the HTTP call.", "**Coroutines and `suspend`**: a suspend function can pause without blocking a thread. `viewModelScope.launch` starts one that is cancelled when the ViewModel goes away.", "**UI state**: a sealed class with Loading, Success and Error. The screen shows one of the three, so every case is handled.", "**Repository**: a class between the ViewModel and the network, which hides where data comes from.", "**Permission**: the app needs `INTERNET` in the manifest."),
    P("This project uses **Open-Meteo**, a free weather API that needs no key, plus its free geocoding endpoint to turn a city name into coordinates. Check its current terms and URL on its website, because public APIs can change."),
    H("Create the project"),
    O("New Empty Activity project `Weather`, package `com.example.weather`.", "Add the Retrofit, serialization and lifecycle libraries and the serialization plugin, then sync.", "Add `<uses-permission android:name=\"android.permission.INTERNET\"/>` to the manifest.", "Create the files below."),
    ...file('gradle/p5-p7.txt', 'Gradle additions (Retrofit and serialization are in this snippet)', 'text'),
    ...file('p6/AndroidManifest.xml', 'app/src/main/AndroidManifest.xml', 'xml'),
    C('text', `Weather/app/src/main/java/com/example/weather/
  WeatherApi.kt         DTOs + Retrofit interfaces
  WeatherRepository.kt  calls the API, maps results
  WeatherViewModel.kt   UiState and search action
  WeatherScreen.kt      search box + result card
  MainActivity.kt`),
    H("The code"),
    ...kt('p6', 'WeatherApi.kt', 'weather'),
    P("The `@Serializable` classes describe only the JSON fields you care about. `ignoreUnknownKeys` in the converter setup tells the parser to skip everything else, so a new field on the server does not break your app."),
    ...kt('p6', 'WeatherRepository.kt', 'weather'),
    ...kt('p6', 'WeatherViewModel.kt', 'weather'),
    P("`UiState` is a sealed interface. The `when` in the screen must cover Loading, Success and Error, and the compiler warns you if you forget one. Errors from `try/catch` become an Error state with a message the screen can show."),
    ...kt('p6', 'WeatherScreen.kt', 'weather'),
    ...kt('p6', 'MainActivity.kt', 'weather'),
    H("Expected output"),
    P("The app opens with a search box and a Search button. Type a city such as London and press Search. A progress circle shows briefly, then a card appears with the city name, the temperature in degrees Celsius, a short text such as Partly cloudy and the wind speed. The numbers are live and will differ from any example here. Type a nonsense word and the app shows a friendly \"City not found\" message. Switch on airplane mode and search again: an error message appears and the app does not crash."),
    N("Never put secret API keys in your app code, because anyone can extract them from the APK. This project avoids the problem by using a keyless API. If you use a keyed service later, call it through your own server."),
    N(HONEST),
    ...task("Build the app and search for three cities.", "Test the error path with airplane mode and with a nonsense city.", "Show the weather description with an emoji chosen by a `when` on the code.", "Remember the last searched city using `rememberSaveable`, and load it when the app opens."),
    ...check("A real city shows live data.", "Airplane mode shows a message, not a crash.", "You can explain what a suspend function is and why the network call must not run on the main thread."),
  ], A('Loading data from the internet', [
    n('ui', 'Screen', 'search box', 0, 0, 'app'), n('vm', 'ViewModel', 'UiState', 1, 0, 'tool'),
    n('api', 'Retrofit', 'HTTP + JSON', 2, 0, 'tool'), n('srv', 'Weather API', 'Open-Meteo', 3, 0, 'cloud'),
  ], [
    { say: 'The user types a city and presses Search. The ViewModel sets the state to Loading.', flow: ['ui>vm:search'] },
    { say: 'A coroutine calls the repository and Retrofit without blocking the screen.', flow: ['vm>api:suspend call'] },
    { say: 'Retrofit sends an HTTPS request and the server answers with JSON.', flow: ['api>srv:GET'] },
    { say: 'The JSON becomes Kotlin objects, the state becomes Success or Error, and the screen draws it.', on: ['vm'] },
  ]), [
    faq('What is a coroutine?', 'A coroutine is a task that can pause and resume without blocking a thread. It lets you write network code that looks like normal step-by-step code while the screen stays responsive.'),
    faq('Why use a sealed class for UI state?', 'It lists every possible state in one place and the compiler makes sure you handle them all. That removes bugs like a spinner that never goes away.'),
    faq('Where should I keep an API key?', 'Not in the app. Anything inside an APK can be extracted. Use keyless APIs while learning, and a small server of your own for keyed services in real products.'),
  ]),

  // 10
  les(S, 'project-7-expense-tracker-room-sql-totals-and-money', 'Project 7: Expense Tracker with Room Totals', 'Project 7: Expense Tracker with Room',
    'Build an expense tracker that stores money as cents, groups spending by category with SQL and shows live totals with Flow in Compose.', [
    P("An expense tracker looks simple, but it teaches two things that matter in every serious app: how to handle money correctly and how to get answers from a database instead of from loops in your code. You will use Room again, now with sums and groups."),
    H("Concepts in this project"),
    L("**Money as whole cents**: `0.1 + 0.2` is not exactly `0.3` in floating-point numbers. Store money as an integer number of cents in a `Long`, and only format it as dollars or rupees for display.", "**SQL aggregates**: `SUM(amountCents)` and `GROUP BY category` let the database do the totals quickly.", "**Flow for totals**: the total is a Flow too, so it updates the moment you add or remove an expense.", "**Flow rows and chips**: `FilterChip` lets the user pick a category, and `FlowRow` wraps the chips onto several lines.", "**Reuse**: this project follows the same layers as project 5, so you can see the pattern settle: entity, DAO, database, ViewModel, screen."),
    H("Create the project"),
    O("New Empty Activity project `Expenses`, package `com.example.expenses`. Use the same Gradle additions as project 5.", "Create the six files below."),
    ...file('gradle/p5-p7.txt', 'Gradle additions (same as project 5)', 'text'),
    C('text', `Expenses/app/src/main/java/com/example/expenses/
  Expense.kt           entity, category list, money helpers
  ExpenseDao.kt        list, total, totals per category
  ExpenseDatabase.kt
  ExpenseViewModel.kt
  ExpenseScreen.kt
  MainActivity.kt`),
    H("The code"),
    ...kt('p7', 'Expense.kt', 'expenses'),
    P("`parseCents` accepts text like \"12.50\" and returns 1250, or null when the text is invalid. `asMoney` does the reverse for display. All the money rules live in these two functions, so there is one place to fix or test them."),
    ...kt('p7', 'ExpenseDao.kt', 'expenses'),
    ...kt('p7', 'ExpenseDatabase.kt', 'expenses'),
    ...kt('p7', 'ExpenseViewModel.kt', 'expenses'),
    ...kt('p7', 'ExpenseScreen.kt', 'expenses'),
    ...kt('p7', 'MainActivity.kt', 'expenses'),
    H("Expected output"),
    P("The top of the screen shows a big total, 0.00 at first. Below it, a form has a title box, an amount box and category chips. Add Lunch 12.50 in Food, then Bus 3.20 in Travel, then Coffee 4.00 in Food. The total reads 19.70. A summary shows Food 16.50 and Travel 3.20. The list shows all three expenses. Delete Coffee and the total changes to 15.70 immediately. Invalid amounts such as abc or an empty box are refused with a short message."),
    N(HONEST),
    ...task("Build the app and reproduce the numbers above exactly.", "Add a `date` column and a screen that lists this month only, using a `WHERE` clause with a range.", "Add a monthly budget setting and colour the total red when it is above the budget.", "Write a unit test for `parseCents` with cases such as \"12\", \"12.5\", \"12.50\", \"abc\" and \"-3\"."),
    ...check("Totals always equal the sum of the list.", "No amount ever shows floating-point errors like 19.700000001.", "You can explain why money is stored as cents."),
  ], A('Let the database add it up', [
    n('form', 'Form', 'title, amount, chip', 0, 0, 'user'), n('dao', 'DAO', 'INSERT, SUM, GROUP BY', 1, 0, 'tool'),
    n('db', 'Room table', 'amounts in cents', 2, 0, 'store'), n('ui', 'Screen', 'total + groups', 3, 0, 'out'),
  ], [
    { say: 'The user adds Lunch 12.50. The text becomes 1250 cents.', on: ['form'] },
    { say: 'The DAO inserts the row into the table.', flow: ['form>dao:insert', 'dao>db:write'] },
    { say: 'The SUM and GROUP BY queries are Flows, so they run again after the change.', on: ['dao'] },
    { say: 'The screen receives the new total and category sums and redraws.', flow: ['db>ui:Flow'] },
  ]), [
    faq('Why not use Double for money?', 'Binary floating-point cannot store many decimal fractions exactly, so small errors appear. Whole cents in a Long are exact and fast.'),
    faq('Is SQL faster than loops in Kotlin?', 'For totals over many rows, usually yes. The database is built for sums and groups and only returns the answer, not every row.'),
    faq('How do I support several currencies?', 'Store the amount in the smallest unit plus a currency code, for example 1250 and INR. Convert only when displaying, using a rate source you trust.'),
  ]),
];
