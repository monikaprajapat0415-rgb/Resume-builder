import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { sw, other } from './files.js';

const SECTION = 'More Real-World iOS Projects';
const HONEST = "The Swift in this project was syntax-checked with a Swift parser. It was not compiled or run in Xcode or on an iPhone while the course was written. Type it in, build it, and fix any small differences your Xcode version shows. Apple changes frameworks every year, so accept newer suggestions from Xcode where they differ.";
const TARGET = "In Xcode choose File > New > Project > iOS > App. Set Interface to SwiftUI, Language to Swift, and Testing System to Swift Testing. Set the minimum deployment to iOS 17, because the code uses @Observable.";

// Builds one project lesson from its parts, so every project lesson has the same shape.
function project({ slug, title, meta, desc, intro, concepts, name, extraSetup = [], tree, files, walk, how, expected, extra = [], tasks, checks, anim, faqs }) {
  return les(SECTION, slug, title, meta, desc, [
    ...intro.map((t) => P(t)),
    H('Concepts in this project'),
    L(...concepts),
    H('Create the project'),
    O(TARGET + ' Name the product ' + name + '.', ...extraSetup, 'Delete the default ContentView.swift and the default @main file, then add the files below.'),
    C('text', tree),
    H('The code'),
    ...files,
    ...extra,
    H('Walkthrough'),
    ...walk.map((t) => P(t)),
    H('How it works'),
    L(...how),
    H('Expected output'),
    P(expected),
    N(HONEST),
    ...task(...tasks),
    ...check(...checks),
    P("Next, try the same idea on another platform with the [Android Development with Kotlin course](/learn/android-development-kotlin-course), or go deeper on iOS with the [Advanced iOS Development course](/learn/advanced-ios-development-course)."),
  ], anim, faqs);
}

export const lessons = [
  project({
    slug: 'project-2-calculator-app-expression-parser-and-swiftui-keypad',
    title: 'Project 2: Calculator App with an Expression Parser',
    meta: 'Project 2: Calculator App in SwiftUI',
    desc: 'Build a calculator in Swift and SwiftUI with its own expression parser, correct order of operations, error handling, a keypad grid and Swift Testing unit tests.',
    intro: [
      "A calculator looks like the easiest app there is, which makes it a good first project after the Expense Tracker. The screen is simple, but the logic is real: you must turn the text \"2+3*4\" into 14, not 20. Many beginners reach for a library. Here you write a small parser yourself, so you learn how text becomes a result, and you keep it in a plain Swift type that you can test without launching the Simulator.",
      "The screen is a grid of buttons, a display for the expression and a line for the result or an error. The state lives in an @Observable model, the same pattern as lesson 13, so the view only describes what to show.",
    ],
    concepts: [
      "**Tokenising**: splitting \"12+3.5*2\" into numbers and operators. A minus at the very start belongs to the first number.",
      "**Order of operations**: pass one handles * and /, pass two handles + and -. This matches mathematics.",
      "**Failing safely**: `evaluate` returns an optional. A nil means invalid input, and the screen shows a message instead of crashing.",
      "**Separating logic from UI**: `Calculator` is an enum with static functions and no SwiftUI import, so tests call it directly.",
      "**Button grids**: `ForEach` over rows of labels, `frame(maxWidth: .infinity)` so keys share the width.",
      "**Swift Testing**: `@Test` functions with `#expect`, one small fact per test.",
    ],
    name: 'PrimeCalc',
    tree: `PrimeCalc/
  CalculatorApp.swift     @main
  Calculator.swift        tokenise and evaluate
  CalculatorModel.swift   expression, result, error
  CalculatorView.swift    display and keypad
PrimeCalcTests/
  CalculatorTests.swift`,
    files: [...sw('calc', 'Calculator.swift'), ...sw('calc', 'CalculatorModel.swift'), ...sw('calc', 'CalculatorView.swift'), ...sw('calc', 'CalculatorApp.swift'), ...sw('calc', 'CalculatorTests.swift', 'CalculatorTests.swift (in the tests target)')],
    walk: [
      "Start with `tokens`. It walks through the text one character at a time and builds a number in a string called `current`. When it meets an operator it converts that string to a Double, stores it, then stores the operator. Spaces are skipped, and any other character makes the function return nil, so letters cannot get through. The special case is the minus sign: when `current` is empty and nothing has been stored yet, the minus is the start of a negative number, so it becomes the first character of `current`.",
      "`evaluate` then reads the tokens in pairs: an operator followed by a number. For * and / it changes the last number in the list straight away, which is how multiplication gets done before addition. For + and - it saves the operator and the next number for the second pass. Division by zero returns nil. The second pass is a plain loop that adds or subtracts from left to right.",
      "`CalculatorModel` is tiny on purpose. `press` handles five kinds of key: clear, backspace, equals, and everything else, which is appended to the expression. After a successful equals the expression becomes the result, so you can keep calculating. The model never draws anything, so you could reuse it in a Mac or watch app.",
      "In the view, `rows` is an array of arrays of strings. Two nested ForEach loops build the grid. `id: \\.self` is fine here because every label is unique. The colour function gives operators orange and the clear keys grey, which is a small touch that makes the keypad easier to read.",
    ],
    how: [
      "A key calls `model.press(key)`. The model changes `expression` or `result`, and SwiftUI redraws because the model is @Observable.",
      "`evaluate` tokenises, runs the multiplication and division pass, then the addition and subtraction pass.",
      "Any unexpected input returns nil, and the model sets `hasError` so the result line turns red.",
      "`format` prints 14.0 as 14 and keeps 3.75 as it is.",
    ],
    expected: "The screen shows 0 and the keypad. Press 2, +, 3, *, 4, =: the display shows 14. Press C, then 7, ., 5, /, 2, =: the display shows 3.75. Press 5, /, 0, =: the line under the display shows \"Invalid expression\" in red and the app keeps running. Press the backspace key to remove the last character. In the tests target, all six tests pass when you press Command+U.",
    tasks: ["Build the app and run each example above.", "Run the tests with Command+U.", "Add a percent key that divides the last number by 100.", "Add brackets by letting `evaluate` call itself on the text inside them."],
    checks: ["2+3*4 gives 14.", "Division by zero shows a message and does not crash.", "You can explain why the evaluator uses two passes."],
    anim: A('Text to answer', [
      n('text', 'Expression', '2+3*4', 0, 0, 'user'), n('tok', 'Tokens', '2 + 3 * 4', 1, 0, 'data'),
      n('mul', 'Pass 1', 'do * and /', 2, 0, 'tool'), n('add', 'Pass 2', 'do + and -', 3, 0, 'out'),
    ], [
      { say: 'The user types the expression with the keypad.', on: ['text'] },
      { say: 'The tokeniser cuts it into numbers and operators.', flow: ['text>tok:tokenise'] },
      { say: 'The first pass multiplies and divides: 3 * 4 becomes 12.', flow: ['tok>mul:first pass'] },
      { say: 'The second pass adds and subtracts: 2 + 12 is 14.', flow: ['mul>add:second pass'] },
    ]),
    faqs: [
      faq('Why not use NSExpression?', 'It can crash on bad input, and it hides how parsing works. Writing a small parser is safer and teaches you how text becomes a result.'),
      faq('Why return nil instead of throwing an error?', 'Bad input is normal in a calculator. An optional is simple and the caller must handle it. For richer messages you could throw a custom Error instead.'),
      faq('Is Double fine for money?', 'Not for real money. Use whole cents in an Int or Decimal, as the Expense Tracker and the shop project do.'),
    ],
  }),

  project({
    slug: 'project-3-to-do-app-with-swiftdata-search-filters-and-tests',
    title: 'Project 3: To-Do App with SwiftData, Filters and Tests',
    meta: 'Project 3: To-Do App with SwiftData',
    desc: 'Build a to-do app with SwiftData that saves tasks on the iPhone: a @Query list, swipe to delete, a segmented filter and tests with an in-memory store.',
    intro: [
      "A to-do list is the standard first app with a database, because it needs the four basic operations: create, read, update and delete. SwiftData makes this short. You mark a class with @Model, give the app a model container, and a @Query in the view always shows the current rows. When a task changes, the screen changes, and when the app is closed the tasks stay.",
      "This project also shows how to test SwiftData without touching real data. A test creates a container that lives only in memory, so each test starts empty and leaves nothing behind.",
    ],
    concepts: [
      "**@Model**: turns a class into a stored type. Plain properties become saved columns.",
      "**modelContainer(for:)**: set once on the scene. It creates the store and gives every view a model context.",
      "**@Query**: a property wrapper that fetches and keeps the list updated, with sorting built in.",
      "**Insert, change, delete**: `context.insert`, setting a property such as `isDone`, and `context.delete`. SwiftData saves automatically.",
      "**A filter enum**: `TodoFilter.apply(to:)` keeps the filtering rule in one testable place.",
      "**In-memory test store**: `ModelConfiguration(isStoredInMemoryOnly: true)`.",
    ],
    name: 'Todo',
    tree: `Todo/
  TodoApp.swift       @main with modelContainer
  TodoItem.swift      @Model and TodoFilter
  TodoListView.swift  add, list, toggle, delete
TodoTests/
  TodoTests.swift`,
    files: [...sw('todo', 'TodoItem.swift'), ...sw('todo', 'TodoListView.swift'), ...sw('todo', 'TodoApp.swift'), ...sw('todo', 'TodoTests.swift', 'TodoTests.swift (in the tests target)')],
    walk: [
      "`TodoItem` is a final class with three properties. The initialiser gives `isDone` and `createdAt` default values, so creating a task needs only a title. `@Model` is a macro, so you do not write any storage code yourself.",
      "In `TodoListView`, `@Environment(\\.modelContext)` gives the view the context it uses to insert and delete. `@Query(sort: \\TodoItem.createdAt, order: .reverse)` returns the newest tasks first. Because the wrapper observes the store, you never refresh the list by hand.",
      "The `add` function trims spaces, ignores empty titles, inserts a new item and clears the text field. The same function is used by the Add button and by pressing return, through `onSubmit`. Reusing one function keeps both paths identical.",
      "Delete needs care. Swipe-to-delete gives you positions in the list that is shown, which may be filtered, not positions in the full list. So `delete(at:)` applies the filter again and deletes the items at those positions in the filtered list. Using the unfiltered list here would delete the wrong task, which is a classic bug.",
      "The tests build a container with `isStoredInMemoryOnly: true`, save two items and fetch them back. The second test checks the filter without a database at all, because `TodoFilter.apply` is a plain function over an array.",
    ],
    how: [
      "The scene's `modelContainer(for: TodoItem.self)` creates the store and shares a context with every view.",
      "`@Query` fetches the items sorted by date, and redraws the list whenever they change.",
      "Tapping a row toggles `isDone`. Because the item is a model object, the change is saved.",
      "The segmented picker changes `filter`, and the list shows `filter.apply(to: items)`.",
    ],
    expected: "The screen shows a text box with an Add button, a segmented control with All, Open and Done, and a message \"Nothing here yet.\" Type \"Buy milk\" and press Add: it appears with an empty circle. Tap it: the circle fills and the text is crossed out. Choose Open: it disappears from the list. Swipe a row left and delete it. Quit the app from the app switcher and open it again: the remaining tasks are still there. Both tests pass.",
    tasks: ["Build the app, add five tasks and mark two done.", "Add a due date property and sort by it. Watch what happens to saved data when you change the model, then read lesson 12 again.", "Add a search field with `.searchable` that filters by title.", "Write a test that checks the order of `@Query` results with a FetchDescriptor and a sort."],
    checks: ["Tasks survive closing the app.", "Delete removes the task you swiped, even with a filter on.", "The tests use an in-memory store."],
    anim: A('SwiftData round trip', [
      n('view', 'Todo view', 'add / toggle / delete', 0, 0, 'app'), n('ctx', 'Model context', 'insert and delete', 1, 0, 'tool'),
      n('store', 'SwiftData store', 'saved on the phone', 2, 0, 'store'), n('query', '@Query', 'live list', 3, 0, 'out'),
    ], [
      { say: 'The user adds a task in the view.', on: ['view'] },
      { say: 'The view asks the model context to insert it.', flow: ['view>ctx:insert'] },
      { say: 'SwiftData saves it to the store on the phone.', flow: ['ctx>store:save'] },
      { say: '@Query notices the change and the list redraws.', flow: ['store>query:changed'] },
    ]),
    faqs: [
      faq('Do I call save() myself?', 'SwiftData saves automatically at sensible moments. You can call `try context.save()` when you need it saved at an exact time, as the test does.'),
      faq('Why test with an in-memory store?', 'Each test starts empty and leaves nothing on disk, so tests are fast and cannot affect each other or your real data.'),
      faq('What happens if I change the model later?', 'Adding a property with a default usually works. For other changes you need a migration, which the advanced iOS course covers.'),
    ],
  }),

  project({
    slug: 'project-4-habit-tracker-streaks-userdefaults-and-date-logic-tests',
    title: 'Project 4: Habit Tracker with Streaks and Date Logic',
    meta: 'Project 4: Habit Tracker with Streaks',
    desc: 'Build a habit tracker in SwiftUI that counts daily streaks, saves habits as JSON in UserDefaults, handles dates safely with Calendar and tests the streak rules.',
    intro: [
      "Habit apps look simple, but they teach one of the hardest parts of real software: dates. What is \"today\"? What is \"yesterday\" when the phone changes time zone? This project keeps the rules small and testable. Each day a habit is done is stored as a text key such as \"2026-11-10\", and the streak is the number of days in a row counted back from today.",
      "Storage is deliberately plain. The habits are encoded as JSON and saved in UserDefaults, which is enough for a small list and shows you how Codable works on its own. For larger data, use SwiftData, as in the previous project.",
    ],
    concepts: [
      "**Codable structs**: `Habit` becomes JSON with `JSONEncoder` and back with `JSONDecoder`.",
      "**Day keys**: a text such as 2026-11-10 avoids time-of-day and time zone surprises in sets and comparisons.",
      "**Calendar arithmetic**: `calendar.date(byAdding: .day, value: -1, to:)` instead of subtracting 86,400 seconds, which breaks on daylight saving days.",
      "**Streak rule**: count back from today. If today is not done yet, start from yesterday so the streak is not lost before the day ends.",
      "**Injected dependencies**: the functions take `today` and `calendar` parameters, so tests can use a fixed date and a fixed time zone.",
      "**didSet persistence**: the store saves whenever `habits` changes.",
    ],
    name: 'Habits',
    tree: `Habits/
  HabitApp.swift     @main
  Habit.swift        model, DayKey, streak rule
  HabitStore.swift   @Observable store saved as JSON
  HabitView.swift    list, add, tick today
HabitsTests/
  HabitTests.swift`,
    files: [...sw('habit', 'Habit.swift'), ...sw('habit', 'HabitStore.swift'), ...sw('habit', 'HabitView.swift'), ...sw('habit', 'HabitApp.swift'), ...sw('habit', 'HabitTests.swift', 'HabitTests.swift (in the tests target)')],
    walk: [
      "`Habit` stores its completed days in a `Set<String>`. A set gives fast lookups and cannot hold the same day twice. `DayKey.key(for:)` builds the text from the year, month and day parts of a date. Because it uses only those three parts, two moments on the same calendar day produce the same key.",
      "The streak function is the heart of the project. It first checks whether today is done. If not, it moves to yesterday, so a streak of 5 stays 5 until midnight passes without a tick. Then a loop counts days while each one is in the set, moving one day back each time. The loop stops at the first gap.",
      "Notice the default parameters `today: Date = .now` and `calendar: Calendar = .current`. In the app you never pass them. In tests you pass a fixed calendar in UTC and fixed dates, so the result is the same on every machine and in every time zone. This is the standard way to make time-dependent code testable.",
      "`HabitStore` loads in its initialiser and saves in `didSet`. `didSet` does not run during initialisation, which avoids saving the same data right after loading it. `toggleToday` finds the habit by id, then inserts or removes today's key. The view reads `habit.isDone(on: .now)` to choose the filled or empty circle.",
      "The tests cover the main rules: three days in a row, a streak that survives until today is done, a gap that breaks the streak, no days at all, and the padded key format. Five small tests like this catch almost every date bug before a user does.",
    ],
    how: [
      "The view shows each habit with its streak and a circle button for today.",
      "Tapping the circle calls `toggleToday`, which edits the set of day keys.",
      "`didSet` on `habits` encodes the list to JSON and writes it to UserDefaults.",
      "On the next launch the store decodes the JSON and the habits come back.",
    ],
    expected: "The screen shows a text box with an Add button and the message \"No habits yet.\" Add \"Read 10 pages\": it appears with \"Streak: 0 day(s)\". Tap the circle: it fills and the streak shows 1. Tap again: it empties and the streak returns to 0. Close and reopen the app: the habit is still there. Swipe to delete a habit. The five tests pass.",
    tasks: ["Build the app, add two habits and tick one.", "Change your Simulator date to tomorrow, reopen the app and see the streak still counts.", "Add a longest-streak value and a test for it.", "Move the storage to SwiftData and keep the same tests for the streak rule."],
    checks: ["A streak does not break before the day ends.", "Tests use a fixed calendar and time zone.", "You can explain why subtracting 86,400 seconds is not safe."],
    anim: A('Counting a streak', [
      n('set', 'Done days', 'set of day keys', 0, 0, 'store'), n('today', 'Is today done?', 'else start yesterday', 1, 0, 'check'),
      n('loop', 'Count back', 'one day at a time', 2, 0, 'tool'), n('num', 'Streak', 'stops at a gap', 3, 0, 'out'),
    ], [
      { say: 'Each completed day is stored as a text key in a set.', on: ['set'] },
      { say: 'The rule first checks today. If it is not done, it starts from yesterday.', flow: ['set>today:look up'] },
      { say: 'It then moves back one day at a time while each day is in the set.', flow: ['today>loop:count'] },
      { say: 'The first gap stops the count, and that number is the streak.', flow: ['loop>num:result'] },
    ]),
    faqs: [
      faq('Why store days as text?', 'A text such as 2026-11-10 means a whole calendar day. Dates carry a time of day, which makes equality checks unreliable.'),
      faq('Why not subtract 86,400 seconds for yesterday?', 'Some days have 23 or 25 hours because of daylight saving. Calendar arithmetic handles this correctly.'),
      faq('When should I use SwiftData instead of UserDefaults?', 'UserDefaults is for small settings and short lists. Use SwiftData when you have many records, need queries or want relationships.'),
    ],
  }),

  project({
    slug: 'project-5-quiz-app-game-state-with-observable-and-swift-testing',
    title: 'Project 5: Quiz App with Game State and Tests',
    meta: 'Project 5: Quiz App in SwiftUI',
    desc: 'Build a quiz app in SwiftUI with instant feedback, a score, a progress bar and a shuffled restart, using an @Observable engine and Swift Testing.',
    intro: [
      "A quiz is a small state machine. At any moment the app is showing one question, waiting for an answer, showing feedback, or showing the final score. If you write the rules in one place, the screen becomes easy. If you scatter them across buttons, you get bugs such as scoring twice when a user taps fast. This project puts every rule in a `QuizEngine` class and keeps the view free of logic.",
      "Because the engine is a plain @Observable class with no UI code, the tests can play a full game in a few lines. This is the same separation you used for the calculator, applied to a game.",
    ],
    concepts: [
      "**A state machine**: current question, selected answer, score and finished are enough to describe the whole game.",
      "**private(set)**: the view can read `score` and `index` but only the engine can change them.",
      "**Guarding rules**: `choose` ignores a second tap, and `next` does nothing before an answer.",
      "**Feedback colours**: green for the right answer, red for the chosen wrong answer, grey for the rest.",
      "**ProgressView**: shows how far through the quiz the user is.",
      "**Shuffling on restart**: `questions.shuffle()` gives a new order each time.",
    ],
    name: 'SwiftQuiz',
    tree: `SwiftQuiz/
  QuizApp.swift     @main
  Question.swift    model and sample questions
  QuizEngine.swift  rules and score
  QuizView.swift    question, feedback, result
SwiftQuizTests/
  QuizTests.swift`,
    files: [...sw('quiz', 'Question.swift'), ...sw('quiz', 'QuizEngine.swift'), ...sw('quiz', 'QuizView.swift'), ...sw('quiz', 'QuizApp.swift'), ...sw('quiz', 'QuizTests.swift', 'QuizTests.swift (in the tests target)')],
    walk: [
      "`Question` holds the text, the options, the index of the right option and a short explanation. Storing the answer as an index keeps the data small. The sample questions are plain Swift code, so you can see the shape of the data and replace it with your own or load it from JSON later.",
      "`QuizEngine` marks its properties `private(set)`. That is a useful habit: the view can show the score but cannot change it, so every change goes through `choose`, `next` or `restart`. In `choose`, the first guard returns if there is no current question or if an answer is already selected. That single line is what prevents double scoring.",
      "`next` also begins with a guard. Without a selected answer it does nothing, so the Next button cannot skip a question even if the view has a bug. This is defensive design: the engine protects its own rules instead of trusting the screen.",
      "The view uses an optional: `if let question = engine.current`. When the quiz is over, `current` is nil and the finished screen appears. This is a clean way to model two screens from one piece of state. The option buttons are disabled after an answer, and their tint comes from one small function that looks at the selected and correct indexes.",
      "The four tests describe the rules as sentences: a correct answer scores, a second tap is ignored, Next needs an answer, and the quiz finishes after the last question with the right score. If you ever change the engine, these tests tell you at once whether a rule broke.",
    ],
    how: [
      "The view asks the engine for `current`. If there is a question it draws it, otherwise it draws the result.",
      "A tap calls `choose`. The engine records the answer and adds to the score if it is right.",
      "The view sees `hasAnswered`, colours the buttons, shows the explanation and offers Next.",
      "After the last question, `isFinished` becomes true and the score screen appears. Play again shuffles and resets.",
    ],
    expected: "The first screen shows a progress bar, \"Question 1 of 5\" and three buttons. Tap the right one: it turns green with a check mark, the others turn grey, an explanation appears and a Next button shows. Tap a wrong answer on another question: it turns red and the right one turns green. After five questions you see \"You scored 4 out of 5\" (your number will vary) and a Play again button. All four tests pass.",
    tasks: ["Build the app and answer all five questions.", "Add five questions of your own about a topic you know.", "Load the questions from a JSON file in the app bundle with Codable.", "Add a timer for each question and treat running out of time as a wrong answer."],
    checks: ["A second tap on an answer does not change the score.", "Next does nothing before an answer is chosen.", "The final score matches the number of correct answers."],
    anim: A('Quiz state machine', [
      n('show', 'Show question', 'options enabled', 0, 0, 'app'), n('pick', 'Choose', 'first tap counts', 1, 0, 'user'),
      n('fb', 'Feedback', 'colours + explanation', 2, 0, 'check'), n('end', 'Result', 'score screen', 3, 0, 'out'),
    ], [
      { say: 'The engine exposes the current question and the view draws it.', on: ['show'] },
      { say: 'The user taps an option. The engine records the first tap only.', flow: ['show>pick:tap'] },
      { say: 'The view shows green and red feedback and an explanation. Next moves on.', flow: ['pick>fb:answered'] },
      { say: 'After the last question the engine is finished and the score screen shows.', flow: ['fb>end:finished'] },
    ]),
    faqs: [
      faq('Why put the rules in a separate class?', 'Rules in one place are easy to test and cannot be bypassed by a screen bug. The view only shows the state.'),
      faq('What does private(set) do?', 'It lets other code read a property but only the class itself can change it.'),
      faq('How do I load questions from a file?', 'Make Question Codable, add a JSON file to the app bundle, and decode it with Bundle.main.url and JSONDecoder.'),
    ],
  }),

  project({
    slug: 'project-6-recipe-book-app-search-themealdb-api-and-navigationstack',
    title: 'Project 6: Recipe Book App with Search and an API',
    meta: 'Project 6: Recipe Book with an API',
    desc: 'Build a recipe app that searches the free TheMealDB API with a debounce, shows loading, empty and error states and uses AsyncImage and NavigationStack.',
    intro: [
      "This project joins everything from the networking lesson: Codable models, an async service, a view model with clear states and a navigation list. The data comes from TheMealDB, a free recipe service with a public test key. The user types in a search box, the app waits a moment, and then it calls the service and shows the matching dishes. Tapping one opens the full instructions.",
      "Two details make the app feel professional. The first is a short wait (a debounce) so the app does not send a request for every key press. The second is a screen for every state: nothing searched yet, loading, no results, an error and the list. Many beginner apps show only the happy path.",
    ],
    concepts: [
      "**Codable with CodingKeys**: the service names fields such as strMeal, and the model renames them to name.",
      "**A null list**: the service answers `{\"meals\": null}` when nothing matches, so `meals` is optional.",
      "**Protocol for the service**: `RecipeService` lets tests use a fake instead of the network.",
      "**State enum**: idle, loading, loaded and failed make the screen simple to write.",
      "**Debounce with Task**: cancel the old search task and start a new one after a 400 millisecond sleep.",
      "**ContentUnavailableView**: ready-made empty and error screens in iOS 17.",
    ],
    name: 'RecipeBook',
    tree: `RecipeBook/
  RecipeApp.swift       @main
  Recipe.swift          model + response
  RecipeService.swift   protocol + MealDBService
  RecipeViewModel.swift states and search
  RecipeViews.swift     list, detail
RecipeBookTests/
  RecipeTests.swift`,
    files: [...sw('recipes', 'Recipe.swift'), ...sw('recipes', 'RecipeService.swift'), ...sw('recipes', 'RecipeViewModel.swift'), ...sw('recipes', 'RecipeViews.swift'), ...sw('recipes', 'RecipeApp.swift'), ...sw('recipes', 'RecipeTests.swift', 'RecipeTests.swift (in the tests target)')],
    walk: [
      "`Recipe` uses `CodingKeys` to connect the service's field names to clean Swift names. Most fields are optional because the service does not always fill them. `RecipeResponse` wraps the top-level object, with `meals` as an optional array. Decoding the null case into nil, then using `?? []`, turns \"no results\" into an empty list.",
      "`MealDBService` builds the address with `URLComponents` and `URLQueryItem`, which encodes the search text safely. Typing \"mac & cheese\" works because the ampersand is escaped for you. It then checks the status code before decoding, as in lesson 11.",
      "The view model is marked `@MainActor`, so changes to `state` happen on the main thread. `queryChanged` is the debounce: it cancels the previous task, ignores searches shorter than two letters, and starts a new task that sleeps for 400 milliseconds. If the user types another letter during that time, this task is cancelled and never calls the service. `load` handles the call and catches errors into the failed state.",
      "In the view, a `switch` on `model.state` chooses what to show. `searchable` adds the search field, and `onChange(of:)` calls `queryChanged`. `navigationDestination(for: Recipe.self)` connects a tapped row to the detail screen. `AsyncImage` loads the picture and shows a grey placeholder meanwhile.",
      "The tests do not use the network. They decode sample JSON, including the null case, and run the view model with a fake service that returns either a recipe or an error. Tests that depend on a real server fail when the server is slow or offline, so they are worse than useless.",
    ],
    how: [
      "The user types. `onChange` calls `queryChanged`, which waits 400 milliseconds before searching.",
      "`load` sets the loading state, calls the service and sets loaded or failed.",
      "The view draws the right screen for each state.",
      "Tapping a row pushes the detail view with the whole recipe.",
    ],
    expected: "On launch the screen says \"Search for a dish\". Type \"chicken\": a spinner shows briefly and then a list of dishes with small pictures, categories and countries appears. Type a nonsense word: \"No Results for ...\" appears. Tap a dish: a detail screen shows a large picture and the instructions. Turn on Airplane Mode and search again: the screen shows \"Could not load recipes\" with a message. The four tests pass.",
    tasks: ["Build the app and search for pasta, chicken and a nonsense word.", "Open the service address in a browser to compare the JSON with the model.", "Add a favourites list saved with SwiftData.", "Show the ingredients by combining the numbered fields the service provides."],
    checks: ["Every state has its own screen.", "The app does not search on every key press.", "Tests run with no network."],
    anim: A('Search with a pause', [
      n('type', 'Search box', 'user types', 0, 0, 'user'), n('wait', 'Wait 400 ms', 'cancel older search', 1, 0, 'tool'),
      n('api', 'TheMealDB', 'JSON answer', 2, 0, 'cloud'), n('list', 'Result list', 'or empty / error', 3, 0, 'out'),
    ], [
      { say: 'The user types in the search box.', on: ['type'] },
      { say: 'Each key cancels the previous search and starts a short wait.', flow: ['type>wait:changed'] },
      { say: 'If the user stops typing, the service is called and returns JSON.', flow: ['wait>api:request'] },
      { say: 'The view shows the list, a no-results message or an error.', flow: ['api>list:state'] },
    ]),
    faqs: [
      faq('What is a debounce?', 'A short delay that restarts on every new input, so the work only happens when the user pauses. It saves requests and battery.'),
      faq('Why is meals optional?', 'The service sends null instead of an empty list when nothing matches. An optional lets decoding succeed.'),
      faq('Can this service change or disappear?', 'Yes. It is a free public service. If it stops working, change the address and models to another recipe API.'),
    ],
  }),

  project({
    slug: 'project-7-shopping-app-products-cart-in-cents-and-demo-checkout',
    title: 'Project 7: Shopping App with Products and a Cart',
    meta: 'Project 7: Shopping App with a Cart',
    desc: 'Build a shopping app with products from the Fake Store API, a product grid, a saved cart in exact cents, quantity steppers and a demo checkout.',
    intro: [
      "Shopping apps are a favourite interview project because they combine a network list, images, shared state between two screens and exact money. This project builds the core of one. Products come from the Fake Store API, the cart is saved on the phone, and the checkout is a **demo** that empties the cart and takes no payment.",
      "A real shop needs a sign-in, addresses, a server that creates orders, a payment provider and legal pages. The lesson points to where each of these would go, but it does not pretend that a demo is a finished shop. Never put card numbers into your own screens. Use Apple Pay or a payment provider's hosted checkout and confirm the order on your server.",
    ],
    concepts: [
      "**Exact money**: prices become whole cents the moment a product enters the cart, and totals are sums of integers.",
      "**A shared store**: one `CartStore` object is passed to both tabs, so the badge, the list and the total always agree.",
      "**Computed values**: `totalCents` and `itemCount` are calculated from the lines, so they cannot go out of date.",
      "**TabView with a badge**: the Cart tab shows the number of items.",
      "**LazyVGrid with adaptive columns**: the grid fits two columns on a phone and more on an iPad.",
      "**Extension for formatting**: `Int.asMoney` turns 4990 into $49.90.",
    ],
    name: 'MiniShop',
    tree: `MiniShop/
  ShopApp.swift        @main
  Product.swift        Product, CartLine, money format
  CartStore.swift      cart saved as JSON
  ShopViewModel.swift  loading products
  ShopViews.swift      tabs, grid, cart
MiniShopTests/
  ShopTests.swift`,
    files: [...sw('shop', 'Product.swift'), ...sw('shop', 'CartStore.swift'), ...sw('shop', 'ShopViewModel.swift'), ...sw('shop', 'ShopViews.swift'), ...sw('shop', 'ShopApp.swift'), ...sw('shop', 'ShopTests.swift', 'ShopTests.swift (in the tests target)')],
    walk: [
      "`Product` mirrors the service's JSON, with the price as a Double because that is what the service sends. The computed property `priceCents` rounds `price * 100` to the nearest whole number. Rounding matters: 109.95 times 100 is not exactly 10995 in floating point, so you must round, not truncate. From that point on, the cart never touches a Double again.",
      "`CartLine` stores the product id, title, price in cents and quantity. It copies the title and price at the time of adding, which is how real carts work: a later price change should not silently change an order already in progress. `lineTotalCents` multiplies price by quantity.",
      "`CartStore` is an @Observable class. The `add` function either raises the quantity of an existing line or appends a new one. `change(_:by:)` adjusts a quantity and removes the line when it reaches zero. Every change to `lines` triggers `didSet`, which encodes the cart to JSON and saves it to UserDefaults, so the cart survives closing the app.",
      "In `ShopRootView`, both objects are created once with `@State` and passed down. `.task { await shop.load() }` loads the products when the view appears. The product grid reads the state with a `switch`: a spinner, a message with a Try again button, or the grid. `.badge(cart.itemCount)` puts the count on the Cart tab.",
      "The tests use a throwaway `UserDefaults` suite with a random name, so they never touch the real saved cart. They check the cent conversion, that adding twice raises the quantity, that going below one removes the line, and the money format. Money code deserves tests more than almost any other code.",
    ],
    how: [
      "`ShopViewModel.load` fetches and decodes the product list from the service.",
      "Add to cart calls `cart.add(product)`, which updates or creates a line and saves it.",
      "The cart screen reads `cart.lines` and shows steppers. Changes update the total at once.",
      "Place demo order clears the cart and shows a message. No money moves.",
    ],
    expected: "The Shop tab shows a grid of products with pictures, titles, prices and an Add to cart button. Add two products: the Cart tab shows a badge with 2. Open Cart: each row has a title, line price, a stepper and a quantity. Press the plus: the total rises. Reduce a line to zero: it disappears. Close the app and reopen it: the cart is still there. Place demo order: the cart empties and says \"Demo order placed. No payment was taken.\" Turn on Airplane Mode before first launch and the Shop tab shows an error with a Try again button.",
    tasks: ["Build the app and fill the cart with three products.", "Add a category filter built from the products' category field.", "Add a product detail screen with NavigationStack that shows the description.", "Save the cart with SwiftData instead of UserDefaults."],
    checks: ["Totals equal the sum of the lines.", "The cart survives closing the app.", "You can explain why payment must be confirmed on a server."],
    anim: A('Browse, add, pay on a server', [
      n('api', 'Product API', 'URLSession', 0, 0, 'cloud'), n('vm', 'View model', 'products', 1, 0, 'tool'),
      n('cart', 'CartStore', 'lines in cents', 2, 0, 'store'), n('srv', 'Your server', 'creates the order', 3, 0, 'cloud'),
    ], [
      { say: 'Products load from the API into the view model.', flow: ['api>vm:products'] },
      { say: 'Add to cart puts a line in the cart with the price in cents.', flow: ['vm>cart:add'] },
      { say: 'Both tabs read the same cart, so totals and the badge always agree.', on: ['cart'] },
      { say: 'In a real shop, checkout sends the cart to your server, which takes payment through a provider.', flow: ['cart>srv:checkout'] },
    ]),
    faqs: [
      faq('Why use cents?', 'Whole numbers add exactly. Floating point numbers can give totals such as 49.900000000000006.'),
      faq('Should the app decide the final price?', 'Only for display. The server must work out prices from its own data, because a changed app could send any price.'),
      faq('Can I take payments in this app?', 'Use Apple Pay or a payment provider and confirm the order on your server. Never collect or store card numbers yourself.'),
    ],
  }),

  project({
    slug: 'project-8-fitness-tracker-healthkit-steps-and-swift-charts',
    title: 'Project 8: Fitness Tracker with HealthKit and Swift Charts',
    meta: 'Project 8: Fitness Tracker with HealthKit',
    desc: 'Build a fitness tracker that reads daily steps from HealthKit, asks permission, draws a weekly bar chart with Swift Charts and tests the progress maths.',
    intro: [
      "iPhones record steps all day, and **HealthKit** is how an app reads them with the user's permission. This project reads the last seven days of steps, shows today's number with a progress bar toward a goal, and draws a bar chart with **Swift Charts**. Health data is private, so the lesson also shows how permission works and what your app can and cannot learn about the user's answer.",
      "The Simulator has no step data, so the project uses the same trick as the AI chat: a protocol with two implementations. `HealthKitService` talks to the real HealthKit on a device, and `FakeHealthService` returns made-up numbers so you can build and test the whole screen on any Mac.",
    ],
    concepts: [
      "**HealthKit capability and privacy text**: add the HealthKit capability and a usage description, or the app will crash when it asks for access.",
      "**Read authorisation**: `requestAuthorization(toShare:read:)`. For read access, iOS does not tell the app if the user said no, so a denied user simply sees zeros.",
      "**HKStatisticsCollectionQuery**: asks for one total per day over a date range.",
      "**Continuations**: `withCheckedThrowingContinuation` wraps a callback API so you can use `await`.",
      "**Swift Charts**: `BarMark` for each day and `RuleMark` for the goal line.",
      "**A fake service**: lets you build and test without a device.",
    ],
    name: 'StepTracker',
    extraSetup: ["Select the app target, open Signing & Capabilities, press + Capability and add HealthKit.", "In the Info tab add Privacy - Health Share Usage Description with a plain sentence about why you read steps (see the capabilities note below)."],
    tree: `StepTracker/
  FitnessApp.swift       @main
  HealthService.swift    protocol, HealthKit and fake services
  StepMath.swift         progress, average, goal days
  FitnessViewModel.swift loading state
  FitnessView.swift      summary and chart
StepTrackerTests/
  FitnessTests.swift`,
    files: [...sw('fitness', 'HealthService.swift'), ...sw('fitness', 'StepMath.swift'), ...sw('fitness', 'FitnessViewModel.swift'), ...sw('fitness', 'FitnessView.swift'), ...sw('fitness', 'FitnessApp.swift'), ...sw('fitness', 'FitnessTests.swift', 'FitnessTests.swift (in the tests target)')],
    extra: [...other('capabilities.txt', 'Capabilities and Info.plist notes for the projects that need them')],
    walk: [
      "`HealthService` is a protocol with two functions. The view model only knows the protocol, so it works the same with the real or the fake service. `HealthKitService.requestAccess` first checks `isHealthDataAvailable`, because some devices, such as certain iPads, have no Health data. Then it asks to read step counts. Apple deliberately hides whether the user allowed it, to protect privacy.",
      "`lastDays` works out a start date seven days back and an end date after today, using `Calendar` arithmetic, and builds a predicate for that range. `HKStatisticsCollectionQuery` with `.cumulativeSum` and a one-day interval returns one total per day. HealthKit uses callbacks, so the code wraps the query in a continuation: `initialResultsHandler` either throws the error or returns the list of days. The handler uses `enumerateStatistics` to turn each day's statistics into a `DaySteps`.",
      "`StepMath` holds the three small calculations as pure functions: a progress value that is clamped between 0 and 1, an average and the number of days that met the goal. Keeping them out of the view lets the tests check the edge cases, such as a goal of zero, which would otherwise divide by zero.",
      "The view model has a `State` enum and a `load` function that requests access and then fetches. If anything throws, it shows the error with a Try again button. `FitnessView` receives the service in its initialiser, so the app decides which one to use. In the Simulator, pass `FakeHealthService()`.",
      "In the chart, each `BarMark` uses the date with `unit: .day`, so the axis shows days, and the colour is green when the goal is met. The `RuleMark` draws a dashed orange line at the goal. The `accessibilityLabel` gives VoiceOver users a description of the chart, which is an easy accessibility win.",
    ],
    how: [
      "On appear the view calls `load`. The service asks for access and returns seven days of steps.",
      "The summary shows the last day as today, with a progress bar toward 8,000 steps.",
      "The chart draws seven bars and the goal line. Green bars met the goal.",
      "A line of text reports how many days met the goal and the average.",
    ],
    expected: "On a real iPhone, a Health permission sheet appears first, asking to read Steps. After you allow it, the screen shows today's step count in large type, a progress bar, \"Goal: 8000 steps\" and a bar chart for the last seven days with a dashed goal line. If you walk and reopen the app, today's number rises. With `FakeHealthService` in the Simulator, you see the numbers 4200, 8800 and so on, with the days that reach 8000 in green. The four tests pass.",
    tasks: ["Run with the fake service in the Simulator, then on a real iPhone with HealthKit.", "Add a goal setting stored with @AppStorage.", "Add distance walked using the distance walking and running type.", "Write the steps for a test user by adding sample data in the Health app on a device."],
    checks: ["The app asks permission before reading steps.", "The chart shows seven days with a goal line.", "You can explain why the app cannot know if the user denied access."],
    anim: A('Reading steps with permission', [
      n('ask', 'Ask permission', 'Health sheet', 0, 0, 'user'), n('hk', 'HealthKit', 'daily totals', 1, 0, 'store'),
      n('math', 'StepMath', 'progress, average', 2, 0, 'tool'), n('chart', 'Swift Charts', 'bars + goal line', 3, 0, 'out'),
    ], [
      { say: 'The app asks to read steps. The user decides in a system sheet.', on: ['ask'] },
      { say: 'A statistics query returns one total for each of the last seven days.', flow: ['ask>hk:query'] },
      { say: 'Pure functions work out progress, average and goal days.', flow: ['hk>math:days'] },
      { say: 'Swift Charts draws the bars and the dashed goal line.', flow: ['math>chart:values'] },
    ]),
    faqs: [
      faq('Why does the app not know if I denied access?', 'For privacy, iOS hides whether a read permission was granted. If access is denied, the query simply returns no data, so design the screen to handle zeros kindly.'),
      faq('Why use a protocol for the health service?', 'The Simulator has no step data and tests should not need a device. A fake service gives you data anywhere.'),
      faq('Is HealthKit data allowed on a server?', 'Be very careful. Health data is sensitive and has strict App Store rules. Keep it on the device unless you have a clear reason, consent and a privacy policy.'),
    ],
  }),

  project({
    slug: 'project-9-music-player-avplayer-now-playing-and-background-audio',
    title: 'Project 9: Music Player with AVPlayer and Background Audio',
    meta: 'Project 9: Music Player with AVPlayer',
    desc: 'Build a music player with AVPlayer, a playlist, a seek slider, lock screen controls and background audio using the playback audio session.',
    intro: [
      "A music app has one special need: the music must keep playing when the screen turns off or the user opens another app. On iOS this takes three pieces working together. An **audio session** with the playback category tells the system your app is a music app. The **Background Modes** capability allows audio to continue. And the **Now Playing** and **remote command** APIs show the title on the lock screen and make headphone buttons work.",
      "The player is an @Observable class that owns an `AVPlayer`, so the SwiftUI view only shows the state and sends commands. The track addresses are placeholders: you must supply audio you have the right to play, such as your own recordings or royalty-free music.",
    ],
    concepts: [
      "**AVPlayer and AVPlayerItem**: the player plays one item at a time. Replace the item to change track.",
      "**Audio session**: `.playback` lets audio continue with the silent switch on and in the background.",
      "**Periodic time observer**: reports the position twice a second for the slider.",
      "**Now Playing info**: title, artist, duration and position for the lock screen and Control Center.",
      "**Remote commands**: play, pause, next and previous from headphones, the lock screen and car systems.",
      "**Slider editing state**: while the user drags, show the drag position, and seek only when they let go.",
    ],
    name: 'MusicPlayer',
    extraSetup: ["Select the app target, open Signing & Capabilities, add Background Modes and tick Audio, AirPlay, and Picture in Picture.", "Open Track.swift and replace the placeholder addresses with audio you have the right to play."],
    tree: `MusicPlayer/
  MusicApp.swift     @main
  Track.swift        tracks and time format
  AudioPlayer.swift  AVPlayer, session, remote commands
  PlayerView.swift   artwork, slider, buttons
MusicPlayerTests/
  MusicTests.swift`,
    files: [...sw('music', 'Track.swift'), ...sw('music', 'AudioPlayer.swift'), ...sw('music', 'PlayerView.swift'), ...sw('music', 'MusicApp.swift'), ...sw('music', 'MusicTests.swift', 'MusicTests.swift (in the tests target)')],
    walk: [
      "`AudioPlayer` is created once by the view. Its initialiser sets up the audio session, registers the remote commands, starts the time observer and loads the first track. Everything about playback is in this one class, which keeps the view short.",
      "`load(index:)` creates an `AVPlayerItem` and gives it to the player. It also registers for the notification that the item has finished, so the next track starts automatically. The duration is read with `await item.asset.load(.duration)`, which is the modern asynchronous way. If loading fails, the player shows \"This track cannot be played right now.\" That is exactly what you will see until you replace the placeholder addresses.",
      "The periodic time observer runs on the main queue every half second and stores the current position. The slider is bound to that position, but while the user is dragging, the view shows a separate `dragPosition` value. Only when dragging ends does it call `seek`. Without this, the slider would jump back to the playing position under the user's finger.",
      "`configureRemoteCommands` connects the system's buttons to your methods. Each handler returns `.success`, and uses a Task on the main actor because the player is main-actor isolated. `updateNowPlaying` fills the dictionary that the lock screen reads. Update it when the track, duration or play state changes.",
      "The tests cover the time format, including bad values such as negative numbers, NaN and infinity, which AVFoundation can report while a stream is loading. Playback itself needs real audio and a device, so it is a manual test.",
    ],
    how: [
      "The view calls `toggle`, `next`, `previous` and `seek` on the player object.",
      "The player changes the AVPlayer and updates its own published state.",
      "The time observer feeds the slider and the Now Playing information.",
      "With Background Modes on, audio keeps playing when you lock the phone, and the lock screen shows controls.",
    ],
    expected: "With your own audio addresses: the screen shows the first title and artist, a slider, the times 0:00 and the track length, and Previous, Play and Next buttons. Press Play: sound starts and the slider moves. Lock the phone: the music continues and the lock screen shows the title with play and pause. Press Next on the headphones or the lock screen: the track changes. With the placeholder addresses, you see \"This track cannot be played right now.\" and nothing plays. The three tests pass.",
    tasks: ["Replace the track addresses and test background playback on a real iPhone.", "Add shuffle and repeat buttons.", "Show album art with MPMediaItemArtwork.", "Handle interruptions such as phone calls with AVAudioSession.interruptionNotification."],
    checks: ["Audio continues when the screen locks.", "Lock screen buttons control the app.", "You only play audio you have the right to use."],
    anim: A('Background audio', [
      n('ui', 'Player view', 'buttons + slider', 0, 0, 'app'), n('pl', 'AudioPlayer', 'owns AVPlayer', 1, 0, 'tool'),
      n('ses', 'Audio session', '.playback category', 2, 0, 'check'), n('lock', 'Lock screen', 'Now Playing + buttons', 3, 0, 'out'),
    ], [
      { say: 'The view sends commands to the AudioPlayer object.', flow: ['ui>pl:play / next'] },
      { say: 'The playback audio session tells iOS this is a music app.', flow: ['pl>ses:category'] },
      { say: 'With the background mode on, audio keeps playing when the screen locks.', on: ['ses'] },
      { say: 'Now Playing info and remote commands show controls on the lock screen.', flow: ['ses>lock:controls'] },
    ]),
    faqs: [
      faq('Why does my audio stop when I lock the phone?', 'You probably forgot the Audio background mode or the playback audio session category. Both are needed.'),
      faq('Can I stream any song I find online?', 'Only audio you have the right to use. Use your own files, licensed music or royalty-free sources.'),
      faq('Can I play video the same way?', 'Yes. AVPlayer plays video too. Project 12 uses it with the built-in VideoPlayer.'),
    ],
  }),

  project({
    slug: 'project-10-qr-code-scanner-visionkit-datascanner-and-safe-links',
    title: 'Project 10: QR Code Scanner with VisionKit',
    meta: 'Project 10: QR Scanner with VisionKit',
    desc: 'Build a QR scanner with VisionKit, wrapped for SwiftUI, with camera permission, a result classifier for links, Wi-Fi and text, and safe link handling.',
    intro: [
      "Scanning a QR code used to need a custom camera pipeline. Today iOS has **VisionKit**, which gives you `DataScannerViewController`: a ready-made camera screen that finds codes and text for you. It is a UIKit view controller, so this project also teaches the bridge between UIKit and SwiftUI: `UIViewControllerRepresentable`.",
      "The most important lesson here is not the camera. It is that **scanned content is untrusted input**. A QR code can contain any text, including a link to a harmful site. The app therefore classifies the result, shows it, warns the user and only opens a link when they tap Open. Scanning needs a real iPhone, because the Simulator has no camera.",
    ],
    concepts: [
      "**DataScannerViewController**: scans barcodes with highlighting, guidance and zoom built in. It needs iOS 16 or later and a supported device.",
      "**UIViewControllerRepresentable**: wraps a UIKit view controller for SwiftUI with `makeUIViewController` and `updateUIViewController`.",
      "**Coordinator**: the object that receives delegate callbacks from UIKit and passes them to SwiftUI.",
      "**Camera permission**: a usage description in Info.plist and a request with `AVCaptureDevice.requestAccess`.",
      "**Classifying results**: an enum with link, Wi-Fi and text cases and a pure `classify` function.",
      "**Only http and https**: other schemes such as javascript or tel are shown as plain text, never opened.",
    ],
    name: 'QRScanner',
    extraSetup: ["In the Info tab add Privacy - Camera Usage Description with a plain sentence about why you use the camera (see the capabilities note)."],
    tree: `QRScanner/
  QRApp.swift       @main
  QRResult.swift    result enum + classifier
  ScannerView.swift UIKit scanner wrapped for SwiftUI
  QRScreen.swift    permission, scanner, result card
QRScannerTests/
  QRTests.swift`,
    files: [...sw('qr', 'QRResult.swift'), ...sw('qr', 'ScannerView.swift'), ...sw('qr', 'QRScreen.swift'), ...sw('qr', 'QRApp.swift'), ...sw('qr', 'QRTests.swift', 'QRTests.swift (in the tests target)')],
    walk: [
      "`QRClassifier.classify` is the safety layer. It trims the text. If the text starts with WIFI: it reads the network name and security type from the fields. Otherwise it tries to make a URL and accepts it only when the scheme is http or https and a host exists. Everything else, including `javascript:` and `tel:` text, becomes plain text. Because the function is pure, three of the four tests need no camera at all.",
      "`ScannerView` conforms to `UIViewControllerRepresentable`. `makeUIViewController` builds the scanner for QR codes only, with guidance and highlighting on, and sets the coordinator as its delegate. `updateUIViewController` starts scanning if it is not already running. SwiftUI calls it whenever the view's state changes, so the `isScanning` check prevents starting twice.",
      "The `Coordinator` implements `DataScannerViewControllerDelegate`. When items are added, it looks for a barcode with a text payload, stops scanning and calls `onFound`. Stopping first matters: otherwise the same code could be reported again and again while it stays in view.",
      "`QRScreen` decides what to show with a chain of conditions. If the device is not supported it says so. If there is a result it shows the card. If the camera is allowed it shows the scanner. Otherwise it explains why the camera is needed and offers an Allow camera button. Explaining before asking improves the chance the user says yes.",
      "On the result card, links show the full address, a reminder to open only trusted links and an Open button that calls `openURL`. Showing the address lets a careful user spot a lookalike domain. Scan again clears the result, which removes the card and brings back the scanner.",
    ],
    how: [
      "The screen checks support and permission, then shows the scanner.",
      "The scanner reports the first QR code and stops scanning.",
      "`classify` turns the text into a link, a Wi-Fi description or text.",
      "The card shows the result. A link opens only after a tap.",
    ],
    expected: "On a real iPhone, the first launch asks to allow the camera. After you allow it, you see the live camera with a highlight guide and the line \"Point the camera at a QR code\". Hold a QR code that contains a web address in front of it: the camera stops and a card titled Link appears with the address, the reminder, an Open button and Scan again. A QR code with plain words shows a Text card. In the Simulator the screen says the device cannot scan codes. The four tests pass on any Mac.",
    tasks: ["Build on a real iPhone and scan a link, plain text and a Wi-Fi code.", "Add a history list saved with SwiftData.", "Add the torch with AVCaptureDevice.torchMode.", "Scan more than QR codes by adding more symbologies, and show the type."],
    checks: ["The app never opens a link without a tap.", "Denied permission leaves a clear Allow camera path.", "You can explain what a Coordinator is for."],
    anim: A('Scan, classify, confirm', [
      n('cam', 'DataScanner', 'camera + highlight', 0, 0, 'app'), n('coord', 'Coordinator', 'delegate callback', 1, 0, 'tool'),
      n('cls', 'classify()', 'link / Wi-Fi / text', 2, 0, 'check'), n('card', 'Result card', 'tap to open', 3, 0, 'out'),
    ], [
      { say: 'VisionKit shows the camera and finds a QR code.', on: ['cam'] },
      { say: 'The coordinator receives the code and stops the scanner.', flow: ['cam>coord:added item'] },
      { say: 'The text is classified. Only http and https count as links.', flow: ['coord>cls:raw text'] },
      { say: 'The card shows the result. A link opens only after the user taps Open.', flow: ['cls>card:result'] },
    ]),
    faqs: [
      faq('Why do I need a Coordinator?', 'UIKit reports events through delegates. A SwiftUI struct cannot be a delegate, so the Coordinator class receives them and passes them on.'),
      faq('Does the camera image leave the phone?', 'The VisionKit scanner works on the device. Still, say plainly what you do in your privacy policy and usage text.'),
      faq('Why not open links automatically?', 'QR codes can point anywhere. Show the address, warn the user and let them decide.'),
    ],
  }),

  project({
    slug: 'project-11-ai-chatbot-app-streaming-replies-history-and-a-safe-backend',
    title: 'Project 11: AI Chatbot App with Streaming Replies',
    meta: 'Project 11: AI Chatbot with Streaming',
    desc: 'Build an AI chatbot in SwiftUI with streaming replies, a Stop button, saved history, a fake service for testing and API keys kept on a server.',
    intro: [
      "AI chat is now an ordinary app feature. The user types a question and the answer appears word by word. Building the screen is mostly about state: a list of finished messages plus one message still being written. Building it safely is about design: the AI key must stay on a server, the history sent must be limited, and the user must be able to stop a long answer.",
      "So you can build and test everything without a key or server, the app uses two classes behind one protocol. `FakeAIService` makes up an answer slowly. `ServerAIService` calls your own backend. You start with the fake one and switch when your server is ready. Never put a secret AI key inside an app: anyone can extract it, and you would pay for their use.",
    ],
    concepts: [
      "**Protocol with two implementations**: `AIService.reply(to:)` returns an `AsyncThrowingStream<String, Error>` that yields the growing text.",
      "**Streaming state**: finished messages live in `messages`, and the partial reply lives in `streaming`. It is saved only when complete or stopped.",
      "**Cancellation**: the Stop button cancels the task. The stream's `onTermination` cancels the work behind it.",
      "**History window**: only recent messages are sent, because the model has no memory and long requests cost more.",
      "**URLSession.bytes**: reads a response as it arrives, so you can show text before the reply is finished.",
      "**Honest interface**: a notice tells users that AI answers can be wrong.",
    ],
    name: 'AIChat',
    tree: `AIChat/
  AIChatApp.swift     @main
  ChatMessage.swift   model + history window
  AIService.swift     protocol, FakeAIService, ServerAIService
  ChatViewModel.swift send, stop, streaming, saved history
  ChatScreen.swift    messages, input, Stop button
AIChatTests/
  AIChatTests.swift`,
    files: [...sw('aichat', 'ChatMessage.swift'), ...sw('aichat', 'AIService.swift'), ...sw('aichat', 'ChatViewModel.swift'), ...sw('aichat', 'ChatScreen.swift'), ...sw('aichat', 'AIChatApp.swift'), ...sw('aichat', 'AIChatTests.swift', 'AIChatTests.swift (in the tests target)')],
    walk: [
      "`AsyncThrowingStream` is the bridge between a producer that pushes values and a consumer that loops with `for try await`. In `FakeAIService`, a task splits the answer into words and yields the text so far every 120 milliseconds. `continuation.onTermination` cancels that task if the consumer stops listening, so no work continues in the background.",
      "`ServerAIService` does the same with real data. It encodes the recent history as JSON, posts it and reads the answer with `URLSession.bytes`. Each character that arrives is appended and yielded. The contract with your server is simple: it receives the messages and streams back plain text. The secret key, the choice of model, usage limits and a system prompt all belong on that server.",
      "`ChatViewModel.send` trims the text, ignores empty input and ignores a second send while a reply is running. It saves the user's message, sets `streaming` to an empty string and starts a task that loops over the stream. Each partial value replaces `streaming`, so the screen shows the growing answer with a cursor mark. When the loop ends, `finish` stores the whole answer as an assistant message, saves, and clears the streaming state.",
      "Stop works through cancellation. `stop` cancels the task, the loop ends, and `finish` stores whatever text was received so far. The user keeps the partial answer instead of losing it. An error shows a short message, never the raw error text, because raw errors can leak details.",
      "In the view, a `ScrollViewReader` keeps the newest text in view. The bottom bar swaps the Send button for Stop while a reply is running. The tests check that history is limited, that the fake stream grows, that a finished reply is saved and that empty messages are ignored, all without a network.",
    ],
    how: [
      "`send` stores the user message and starts a task that reads the reply stream.",
      "Each emitted text updates `streaming`, so the screen shows the answer as it grows.",
      "When the stream ends or Stop is pressed, the text is saved as an assistant message.",
      "Messages are encoded to JSON and saved, so the conversation survives closing the app.",
    ],
    expected: "The screen shows the title Assistant, the notice \"AI answers can be wrong. Check important facts.\" and an input box. Type \"What is Swift?\" and press Send: your message appears on the right in blue. An answer then builds up on the left word by word, ending with \"Connect the app to your own server to get real AI replies.\" while the button shows Stop. Press Stop in the middle: the partial text stays. Close and reopen the app: the conversation is still there. Clear removes it. All four tests pass.",
    tasks: ["Build the app with the fake service and chat with it.", "Write the server contract for your own backend and test it with a tool such as curl.", "Add a system prompt on the server, not in the app.", "Add a daily message limit on the server and show a friendly message when it is reached."],
    checks: ["No AI key exists in the app or the repository.", "Stop keeps the partial answer.", "Only recent messages are sent."],
    anim: A('A stream of growing text', [
      n('user', 'User message', 'saved first', 0, 0, 'user'), n('svc', 'AIService', 'fake or your server', 1, 0, 'tool'),
      n('live', 'Streaming text', 'shown as it grows', 2, 0, 'store'), n('save', 'Saved history', 'when finished or stopped', 3, 0, 'out'),
    ], [
      { say: 'The user\'s message is saved and the recent history is prepared.', on: ['user'] },
      { say: 'The service returns an AsyncThrowingStream of the growing reply.', flow: ['user>svc:history'] },
      { say: 'Each value replaces the streaming text on screen.', flow: ['svc>live:chunks'] },
      { say: 'When it ends, or the user presses Stop, the text is saved as a message.', flow: ['live>save:finish'] },
    ]),
    faqs: [
      faq('Why not call the AI service directly from the app?', 'The secret key would be inside the app, where anyone can extract it. A server also lets you add limits, logging and safety rules.'),
      faq('Why send only recent messages?', 'The model has no memory, so you send context every time. Long histories cost more and can exceed limits, so send a recent window or a summary.'),
      faq('What does onTermination do?', 'It runs when the stream ends or the consumer stops listening, so you can cancel the producer task and avoid wasted work.'),
    ],
  }),

  project({
    slug: 'project-12-video-streaming-app-avkit-hls-and-lifecycle-safe-playback',
    title: 'Project 12: Video Streaming App with AVKit and HLS',
    meta: 'Project 12: Video Streaming with AVKit',
    desc: 'Build a video streaming app with AVKit and an HLS adaptive stream, loading and error states, a video list and playback that pauses and cleans up safely.',
    intro: [
      "Streaming video is harder than playing a file, because viewers have different networks. A good service stores the same video at several qualities and lets the player switch between them as the connection changes. This is **adaptive streaming**, and on Apple platforms the standard format is **HLS**, recognised by an address ending in `.m3u8`. AVPlayer supports it without extra libraries.",
      "SwiftUI gives you `VideoPlayer`, a view with the standard controls. The part that needs care is the lifecycle: a player holds decoders and memory, so you should stop it when the screen goes away and pause it when the app is no longer active. The project also shows how to watch an `AVPlayerItem` for loading and failure with Combine, so the screen can show a spinner or a clear error.",
    ],
    concepts: [
      "**Adaptive streaming**: the player downloads small pieces and picks a quality for each from your current speed.",
      "**HLS**: an Apple format using a playlist file (.m3u8) that lists the pieces. AVPlayer reads it directly.",
      "**VideoPlayer**: SwiftUI's AVKit view with play, pause and a scrubber.",
      "**KVO with Combine**: `item.publisher(for: \\.status)` tells you when the item is ready or failed.",
      "**scenePhase**: pause when the app is not active, unless you add background video on purpose.",
      "**Cleaning up**: `onDisappear` pauses and removes the item, which frees memory and decoders.",
    ],
    name: 'StreamPlayer',
    tree: `StreamPlayer/
  VideoApp.swift     @main
  Video.swift        list + duration format
  VideoModel.swift   AVPlayer + status
  VideoScreen.swift  player, state, list
StreamPlayerTests/
  VideoTests.swift`,
    files: [...sw('video', 'Video.swift'), ...sw('video', 'VideoModel.swift'), ...sw('video', 'VideoScreen.swift'), ...sw('video', 'VideoApp.swift'), ...sw('video', 'VideoTests.swift', 'VideoTests.swift (in the tests target)')],
    walk: [
      "`SampleVideos` lists two entries. The first is Apple's public HLS example stream, which is meant for developers to test with. Addresses on someone else's server can change or vanish, so replace them with streams you control or have the right to use. The second entry is a placeholder that will fail on purpose, so you can see the error state.",
      "`VideoModel` owns one `AVPlayer`. `play(_:)` creates an `AVPlayerItem` for the chosen video, sets the status to loading and subscribes to the item's `status`. KVO is the older observation system used by Apple's frameworks, and `publisher(for:)` turns it into a Combine stream. When the status becomes ready or failed, the model updates its own state on the main queue. Storing the subscription in `cancellable` keeps it alive, and replacing it cancels the old one.",
      "`VideoScreen` stacks the player, the title and the list. A ZStack puts a spinner over the player while loading and an error message over it when the item fails. The player has a 16:9 shape so the layout does not jump when the video starts. Tapping a row sets the selected video and calls `play`.",
      "The lifecycle is handled in three places. `onAppear` starts the first video. `onDisappear` calls `stop`, which pauses, removes the current item and cancels the subscription. `onChange(of: scenePhase)` pauses the player when the app becomes inactive or goes to the background. Without these, a video can keep decoding after the user has left the screen.",
      "The tests are small because most of the app is framework code. They check the time format, including hours and bad values, and that the sample list contains an HLS address. Playback itself is a manual test on a device or the Simulator with a real network.",
    ],
    how: [
      "Choosing a video creates a new player item and shows the loading spinner.",
      "The status subscription reports ready or failed, and the overlay changes.",
      "The AVKit player handles controls, scrubbing and adaptive quality.",
      "Leaving the screen or the app pauses playback and frees the player item.",
    ],
    expected: "The top of the screen shows the player with the standard controls. After a moment of buffering, shown with a spinner, the first video starts. Drag the scrubber to jump. Tap \"Your own video\" in the list: the title changes and, because the placeholder address does not exist, the message \"This video cannot be played right now.\" appears and the app stays usable. Tap the first video again: it plays. Go to the Home screen: the video pauses. On a slower connection an adaptive stream lowers its quality instead of stopping. The four tests pass.",
    tasks: ["Build the app and play the sample stream.", "Add your own HLS stream or a video file and show it in the list.", "Remember the playback position for each video with @AppStorage.", "Add Picture in Picture support through the Background Modes capability."],
    checks: ["The spinner shows while loading and disappears when ready.", "Leaving the screen stops the player.", "You can explain what HLS and adaptive streaming are."],
    anim: A('Adaptive streaming', [
      n('srv', 'Server', 'same video, many qualities', 0, 0, 'cloud'), n('m3u8', 'HLS playlist', '.m3u8 lists the pieces', 1, 0, 'data'),
      n('av', 'AVPlayer', 'picks quality per piece', 2, 0, 'tool'), n('view', 'VideoPlayer', 'shows the video', 3, 0, 'out'),
    ], [
      { say: 'The server stores the video as small pieces at several qualities.', on: ['srv'] },
      { say: 'The player first reads the playlist that lists them.', flow: ['srv>m3u8:playlist'] },
      { say: 'AVPlayer downloads each piece in the best quality your speed allows.', flow: ['m3u8>av:pieces'] },
      { say: 'The view draws the frames. If the network slows, quality drops instead of stopping.', flow: ['av>view:frames'] },
    ]),
    faqs: [
      faq('HLS or MP4?', 'An MP4 file is one quality, downloaded as a whole. HLS is better for streaming because it adapts and starts quickly.'),
      faq('Why remove the player item on disappear?', 'The item holds network connections and decoders. Removing it frees them so the next video starts cleanly.'),
      faq('Can I stream any video I find online?', 'Only video you have the right to use. Use your own content or content with a licence that allows it.'),
    ],
  }),

  project({
    slug: 'project-13-job-portal-app-search-filters-resume-upload-and-multipart',
    title: 'Project 13: Job Portal App with Filters and Resume Upload',
    meta: 'Project 13: Job Portal App in SwiftUI',
    desc: 'Build a job portal client with search and filter toggles, a detail screen, a resume picker with size and type checks and a multipart upload.',
    intro: [
      "A job portal is a good last project because it joins list screens, filtering, forms, file handling and backend calls. It is also close to the purpose of this website. The app has two main screens: a searchable, filterable list of jobs, and a detail screen where the user attaches a resume and applies.",
      "The app can run with no backend, using `FakeJobService` and three sample jobs. When you have a backend, switch to `RemoteJobService`, which expects `GET /jobs` to return a JSON list and `POST /jobs/{id}/apply` to accept a multipart form with a cover note and a file. Sign-in is left out to keep the lesson focused. A real portal would add it with the secure networking pattern from the advanced course and send a token with each request.",
    ],
    concepts: [
      "**Filtering with a pure function**: `[Job].filtered(by:)` combines text, remote-only and job types, so it is easy to test.",
      "**A derived list**: `shown` is calculated from the loaded jobs and the filter, so they can never disagree.",
      "**Toggle buttons as chips**: `Toggle(...).toggleStyle(.button)`, with a custom Binding for a set of types.",
      "**fileImporter**: the system file picker. It needs no storage permission and gives access only to the chosen file.",
      "**Security-scoped URLs**: call `startAccessingSecurityScopedResource` before reading a picked file, and stop afterwards.",
      "**Multipart upload**: a text part and a file part joined with a boundary.",
    ],
    name: 'JobPortal',
    tree: `JobPortal/
  JobsApp.swift       @main
  Job.swift           model, filter, sample data
  ResumeRules.swift   file checks, mime type, multipart body
  JobService.swift    protocol, remote and fake services
  JobViewModel.swift  state, filter, apply
  JobViews.swift      list with chips, detail with upload
JobPortalTests/
  JobsTests.swift`,
    files: [...sw('jobs', 'Job.swift'), ...sw('jobs', 'ResumeRules.swift'), ...sw('jobs', 'JobService.swift'), ...sw('jobs', 'JobViewModel.swift'), ...sw('jobs', 'JobViews.swift'), ...sw('jobs', 'JobsApp.swift'), ...sw('jobs', 'JobsTests.swift', 'JobsTests.swift (in the tests target)')],
    walk: [
      "`Job` is Codable and Hashable, so it can be decoded from the server and used as a navigation value. `JobFilter` is a small struct with the search text, a remote-only switch and a set of types. The extension on `Array where Element == Job` adds `filtered(by:)`. Each rule returns early when a job does not match: remote-only fails a non-remote job, a non-empty type set fails a job of another type, and the search text must appear in the title, company or location.",
      "`ResumeRules.problem` returns a message in plain words or nil. It checks the extension against pdf, doc and docx, rejects empty files and rejects files over 5 MB. These checks give fast feedback, but they are not security. Anyone can send any request to your server without using your app, so the server must check the type, size and content again.",
      "`Multipart.body` builds the request body by hand. Each part starts with the boundary, then headers, a blank line and the content. The file part includes its file name and content type. The last line is the boundary followed by two dashes. Writing it once helps you understand what upload libraries do for you.",
      "`JobViewModel.apply` is where the picked file is handled. The URL from `fileImporter` points outside your app, so the code calls `startAccessingSecurityScopedResource`, and `defer` makes sure `stop` is called however the function ends. It reads the size, applies the rules, reads the data and calls the service. It returns a message instead of throwing, so the view can show it directly.",
      "In the list view, the chips are `Toggle` views with the button style. The remote switch binds directly to the filter. For the job types, a small `binding(for:)` function builds a Binding that inserts or removes a type in the set. The detail view disables Apply until a file is picked and while sending, which prevents double submits.",
    ],
    how: [
      "The list loads jobs from the service and shows those that match the filter.",
      "Opening a job shows its description, a cover note field and a resume picker.",
      "Before upload the view model checks the file type and size and reads the file safely.",
      "A multipart request sends the note and file. The server validates again and stores the application.",
    ],
    expected: "The list shows a search field, chips for Remote, Full-time, Internship and Contract, and a row for each job with the title, company and place. Type \"kotlin\": only the Kotlin job remains. Clear it and turn on Remote and Contract: only jobs that are both remain. Open a job: you see the description, a note box, Choose resume and Apply. Choose a PNG: pressing Apply shows \"Choose a PDF or Word file.\" Choose a PDF under 5 MB: Apply shows \"Application sent\". With `RemoteJobService` and no backend, the list shows \"Could not load jobs.\" with a Try again button. The five tests pass.",
    tasks: ["Build the app with the fake service and test the filters.", "Write a small backend or a mock server that matches the contract.", "Add sign-in and send a token with each request.", "Save jobs for later with SwiftData and add a Saved tab."],
    checks: ["Filters combine correctly.", "Wrong file types and big files are refused before upload.", "You can explain why the server must validate the resume again."],
    anim: A('Filter, choose, apply', [
      n('list', 'Job list', 'search + chips', 0, 0, 'app'), n('detail', 'Detail', 'cover note', 1, 0, 'app'),
      n('check', 'File checks', 'type and size', 2, 0, 'check'), n('srv', 'Your server', 'stores the application', 3, 0, 'cloud'),
    ], [
      { say: 'The user searches and filters. The shown list is calculated from the filter.', on: ['list'] },
      { say: 'Opening a job shows its details and a resume picker.', flow: ['list>detail:open'] },
      { say: 'Before upload, the app checks the file type and size.', flow: ['detail>check:resume'] },
      { say: 'A multipart request sends the note and file. The server validates again.', flow: ['check>srv:multipart'] },
    ]),
    faqs: [
      faq('Why does fileImporter need no permission?', 'The system picker runs outside your app and gives access only to the file the user chose, which is safer than broad file access.'),
      faq('Why validate the file twice?', 'The app check gives quick feedback, but anyone can bypass the app. The server must check type, size and content itself.'),
      faq('Where should filtering happen?', 'On the server for large lists, since you cannot download everything. For small lists, a pure Swift function on the device is fine and easy to test.'),
    ],
  }),
];
