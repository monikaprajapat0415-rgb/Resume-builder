import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { src, cfg } from './files.js';

const S = 'Building Real Apps';
const HONEST = "The code in this course was syntax-checked with a TypeScript parser. It was not run on a phone or emulator while the course was written, so type it in, run it with Expo and fix any small differences your versions show. Always install Expo libraries with `npx expo install` so the versions match your Expo SDK.";

export const lessons = [
  // 4
  les(S, 'project-2-todo-list-flatlist-useeffect-and-asyncstorage', 'Project 2: To-Do List with FlatList and AsyncStorage', 'Project 2: To-Do List with AsyncStorage',
    'Build a to-do app in React Native with FlatList, useEffect and AsyncStorage so tasks stay saved after the app closes, with full code.', [
    P("The tip calculator forgot everything when you closed it. A to-do app must remember. This project adds three ideas: showing a list with **FlatList**, running code at the right moment with **useEffect**, and saving small data on the phone with **AsyncStorage**."),
    H("Concepts in this project"),
    L("**FlatList**: draws only visible rows. You pass `data`, a `keyExtractor` that returns a unique string, and `renderItem`. `ListEmptyComponent` shows a message when the list is empty.", "**useEffect**: runs code after the screen draws. With `[]` it runs once at start (load saved tasks). With `[todos]` it runs whenever tasks change (save them).", "**AsyncStorage**: a simple key-value store that keeps text on the phone. Store objects with `JSON.stringify` and read them with `JSON.parse`.", "**Immutable updates**: `map` to change one item, `filter` to remove, spread to add. Never push into the existing array."),
    H("Create the project"),
    O("Create a new Expo project, or reuse your first one.", "Install the storage library with `npx expo install @react-native-async-storage/async-storage`.", "Add `storage.ts` and replace `App.tsx`."),
    C('text', `my-app/
  App.tsx       list, input, buttons
  storage.ts    load and save functions`),
    H("The code"),
    ...src('p2/storage.ts', 'storage.ts'),
    P("`loadTodos` returns an empty list if nothing was saved or if reading fails, so the app never crashes on a damaged value."),
    ...src('p2/App.tsx', 'App.tsx'),
    H("How it works"),
    L("The first `useEffect` loads saved tasks once and then sets `ready`.", "The second saves tasks every time they change, but only after `ready`, so the empty starting list does not overwrite saved data.", "`add`, `toggle`, `remove` and `clearDone` each build a new list.", "`left` is calculated while rendering from `todos`. It is not stored separately, so it cannot be wrong."),
    H("Expected output"),
    P("You see the title, a text box with an Add button, the line \"0 left, 0 done\" and the message \"Nothing to do. Add your first task above.\" Add Buy milk and Call Dad: both appear, and the line reads \"2 left, 0 done\". Tap Buy milk: it gets a line through it and the line reads \"1 left, 1 done\". A Clear finished tasks link appears. Close the app fully and open it again: the tasks are still there."),
    N("AsyncStorage is for small data. For thousands of rows or for searching, use SQLite (project 6). Do not store passwords or tokens in it. Use secure storage (lesson 13)."),
    N(HONEST),
    ...task("Build the app and check the example. Then force-close the app and reopen it.", "Add an edit feature: tapping the task title opens it in the text box.", "Show \"All done, well done!\" when every task is ticked.", "Sort tasks so unfinished ones come first."),
    ...check("Tasks survive closing the app.", "Ticking, deleting and clearing all work and the counter updates.", "You can explain why the save effect waits for ready."),
  ], A('Saved on the phone', [
    n('ui', 'App screen', 'FlatList', 0, 0, 'app'), n('state', 'State', 'todos array', 1, 0, 'store'),
    n('effect', 'useEffect', 'runs on change', 2, 0, 'tool'), n('disk', 'AsyncStorage', 'JSON on the phone', 3, 0, 'store'),
  ], [
    { say: 'The user adds or ticks a task. The handler creates a new array.', flow: ['ui>state:setTodos'] },
    { say: 'The state changed, so the save effect runs.', flow: ['state>effect:todos changed'] },
    { say: 'The effect writes the list as JSON text.', flow: ['effect>disk:setItem'] },
    { say: 'Next time the app opens, the load effect reads it back into state.', on: ['disk'] },
  ]), [
    faq('What does the empty array in useEffect mean?', 'It means the effect has no dependencies, so it runs once after the first render. It is the usual place to load saved data.'),
    faq('Why not push into the array?', 'React decides to redraw by comparing old and new values. If you change the same array, the reference is unchanged and React may not notice. A new array always triggers an update.'),
    faq('Can AsyncStorage lose data?', 'It can if the user clears app data or the phone is reset. Treat it as a local cache and use a server or backup for data that must never be lost.'),
  ]),

  // 5
  les(S, 'project-3-quiz-app-with-expo-router-navigation', 'Project 3: Quiz App with Expo Router', 'Project 3: Quiz App with Expo Router',
    'Build a multi-screen quiz app with Expo Router: file based routes, Stack navigation, route params, router.push and replace, with complete TypeScript code.', [
    P("Real apps have many screens. In Expo, the standard way to move between them is **Expo Router**. It uses file-based routing, like Next.js on the web: each file in the `app` folder becomes a screen, and its name becomes the route. It is built on React Navigation, so you get native-feeling transitions and a back button for free."),
    H("Concepts in this project"),
    L("**File-based routes**: `app/index.tsx` is `/`, `app/quiz.tsx` is `/quiz`, `app/[id].tsx` is `/123`.", "**_layout.tsx**: wraps the screens in a navigator. `Stack` pushes screens on top of each other.", "**useRouter**: `router.push` goes forward, `router.replace` swaps the current screen, `router.back` goes back.", "**Params**: send values with `{ pathname, params }` and read them with `useLocalSearchParams`. Params are always strings.", "**Keep data out of `app/`**: every file there is treated as a route, so put helpers in a `src` folder."),
    H("Set up Expo Router"),
    P("A new project made with the default Expo template already uses Expo Router. If you started from the blank template, follow these steps."),
    ...cfg('config/router.txt', 'package.json, app.json and folder layout'),
    P("Install the supporting libraries with the commands below (use only the lines you need now), and delete the old `App.tsx` so it does not conflict."),
    ...cfg('config/deps.txt', 'Install commands for all ten projects'),
    P("Each project tells you which line to run."),
    C('text', `my-app/
  app/
    _layout.tsx    Stack navigator
    index.tsx      home: Start button
    quiz.tsx       questions
    result.tsx     final score
  src/
    questions.ts   the quiz data`),
    H("The code"),
    ...src('p3/questions.ts', 'src/questions.ts'),
    ...src('p3/_layout.tsx', 'app/_layout.tsx'),
    ...src('p3/index.tsx', 'app/index.tsx'),
    ...src('p3/quiz.tsx', 'app/quiz.tsx'),
    ...src('p3/result.tsx', 'app/result.tsx'),
    H("How it works"),
    L("Start calls `router.push(\"/quiz\")`. The stack now holds home and quiz.", "The quiz keeps `index`, `score` and the chosen answer in state. After the last question it calls `router.replace` to `/result` with the score as params. `replace` swaps the quiz out so Back does not return to it.", "The result screen reads `score` and `total` with `useLocalSearchParams` and offers Play again with `router.replace(\"/\")`."),
    H("Expected output"),
    P("The home screen shows React Native Quiz, \"4 questions\" and a Start button. Each question shows Question 1 of 4, the text and four options. Tapping an option turns the right answer green and a wrong choice red, and a Next button appears. After the last question you see \"You scored 3 out of 4\" (your number depends on your answers) and a Play again button. The back arrow is hidden on the quiz and result screens by design."),
    N(HONEST),
    ...task("Set up the router, add the files and play the quiz.", "Add four more questions to `src/questions.ts`.", "Show a different message for a perfect score on the result screen.", "Add a Settings screen reachable from home and check that the back button returns to home."),
    ...check("The quiz runs from start to result.", "Back does not return into a finished quiz.", "You can explain push versus replace."),
  ], A('File-based routing', [
    n('files', 'app/ folder', 'one file = one screen', 0, 0, 'data'), n('stack', 'Stack', 'in _layout.tsx', 1, 0, 'tool'),
    n('quiz', 'quiz.tsx', '/quiz', 2, 0, 'app'), n('res', 'result.tsx', 'score param', 3, 0, 'out'),
  ], [
    { say: 'Every file in app/ becomes a route automatically.', on: ['files'] },
    { say: 'The layout wraps them in a Stack navigator.', flow: ['files>stack:layout'] },
    { say: 'router.push opens the quiz screen on top of home.', flow: ['stack>quiz:push'] },
    { say: 'At the end router.replace opens the result with the score as params.', flow: ['quiz>res:replace + params'] },
  ]), [
    faq('Why use Expo Router instead of React Navigation directly?', 'Expo Router builds on React Navigation and adds file-based routes and deep links. It means less setup and URLs for every screen, which helps with links and the web.'),
    faq('Why are route params strings?', 'Params travel in the URL, so they are text. Convert them with Number() or JSON when you need another type, and pass an ID instead of a whole object.'),
    faq('Where do non-screen files go?', 'Outside the app folder, for example in src, because every file in app is treated as a screen.'),
  ]),

  // 6
  les(S, 'project-4-weather-app-fetch-api-loading-and-error-states', 'Project 4: Weather App with fetch and Error States', 'Project 4: Weather App with fetch',
    'Build a weather app that loads live data from a free API with fetch and async await, using a TypeScript union type for idle, loading, error and success states.', [
    P("Most apps talk to servers. This project loads live weather and teaches the pattern that every data screen needs: show a spinner while waiting, show data on success and show a clear message on failure. You use the built-in `fetch` function, with no extra library."),
    H("Concepts in this project"),
    L("**REST API and JSON**: you request a URL and get text in JSON form, which `res.json()` turns into an object.", "**fetch and async/await**: `await fetch(url)` waits without freezing the screen. Check `res.ok`, because fetch does not throw on HTTP errors like 404.", "**Union types for state**: `idle | loading | error | ok`. Each case carries only the data that makes sense. TypeScript makes sure you handle each one.", "**Two requests**: first look up the city's coordinates with the free Open-Meteo geocoding endpoint, then ask for the weather at those coordinates. No API key is needed. Check the service's current terms and URLs before you build.", "**Separation**: the network code is in its own file. The screen only shows state."),
    H("Create the project"),
    O("Use a blank Expo TypeScript project. No extra library is needed.", "Add `weather.ts` and replace `App.tsx`."),
    ...src('p4/weather.ts', 'weather.ts'),
    ...src('p4/App.tsx', 'App.tsx'),
    H("How it works"),
    L("`fetchWeather` throws an `Error` with a friendly message at each failure point. The screen only has to catch it.", "`search` sets `loading`, awaits the data, then sets `ok` or `error`.", "The screen renders one block for each kind of state with simple `&&` checks.", "`encodeURIComponent` makes the city name safe to put in a URL (for example, for names with spaces)."),
    H("Expected output"),
    P("You see a search box and a Search button. Type London and press Search. A spinner shows briefly, then a card with London, GB, a large temperature such as 11°C, a description such as Partly cloudy and the wind speed. The numbers are live and will differ from this example. Type a nonsense word and the app shows \"City not found\". Turn on airplane mode and search again: a short error message appears and the app keeps running."),
    N("Never put a secret API key in a mobile app. Anything inside the app can be extracted. This project uses a keyless API. For a service that needs a key, call it from your own server."),
    N(HONEST),
    ...task("Build the app and search three cities.", "Test the error paths: a nonsense city and airplane mode.", "Show an emoji next to the description using a lookup table keyed by weather code.", "Remember the last city with AsyncStorage and search for it when the app opens."),
    ...check("A real city shows live data.", "Errors show a message, never a crash.", "You can explain why `res.ok` must be checked."),
  ], A('Loading data safely', [
    n('ui', 'Screen', 'search box', 0, 0, 'app'), n('state', 'State', 'idle/loading/ok/error', 1, 0, 'store'),
    n('fetch', 'fetch', 'async request', 2, 0, 'tool'), n('api', 'Weather API', 'JSON reply', 3, 0, 'cloud'),
  ], [
    { say: 'The user presses Search and the state becomes loading.', flow: ['ui>state:loading'] },
    { say: 'The async function calls fetch and waits.', flow: ['state>fetch:await'] },
    { say: 'The server answers with JSON, or the request fails.', flow: ['fetch>api:GET'] },
    { say: 'The state becomes ok with data, or error with a message, and the screen shows it.', on: ['state'] },
  ]), [
    faq('Why doesn\'t fetch throw on a 404?', 'fetch only rejects when the network request itself fails. A 404 or 500 is still a response, so you must check res.ok and throw your own error.'),
    faq('Why use a union type for state?', 'It makes impossible states impossible, such as loading and error at once. TypeScript also warns you if you forget to handle a case.'),
    faq('Axios or fetch?', 'fetch is built in and enough for most apps. Axios adds conveniences like interceptors. For caching and retries, use TanStack Query on top of either, as in project 7.'),
  ]),

  // 7
  les(S, 'project-5-expense-tracker-usereducer-context-and-money', 'Project 5: Expense Tracker with useReducer and Context', 'Project 5: Expense Tracker with Reducer',
    'Build an expense tracker with useReducer, Context and AsyncStorage, store money as whole cents and group spending by category with useMemo.', [
    P("This project grows the state of an app. A reducer puts all changes to the list in one place, and Context shares that state with any screen without passing props down by hand. It also introduces a rule every serious app follows: handle money as integers."),
    H("Concepts in this project"),
    L("**useReducer**: you describe changes as actions, such as `add` and `remove`, and one `reducer` function returns the next state. It is easier to follow and test than many setters.", "**Context**: `createContext` and a Provider make state available to the whole tree. A custom hook, `useExpenses`, hides the details and throws a clear error if used outside the provider.", "**Money as cents**: floating point cannot store values like 0.1 exactly, so 0.1 + 0.2 is 0.30000000000000004. Store whole cents and format at the edge.", "**useMemo**: caches a calculated value, like totals per category, until its inputs change.", "**Validation**: `parseCents` returns `null` for bad input, which the form turns into a message."),
    H("Create the project"),
    O("Use a blank Expo TypeScript project and install AsyncStorage with `npx expo install @react-native-async-storage/async-storage`.", "Add three files."),
    C('text', `my-app/
  App.tsx
  ExpenseContext.tsx   reducer, provider, useExpenses hook
  money.ts             parseCents and asMoney`),
    ...src('p5/money.ts', 'money.ts'),
    ...src('p5/ExpenseContext.tsx', 'ExpenseContext.tsx'),
    ...src('p5/App.tsx', 'App.tsx'),
    H("How it works"),
    L("The reducer handles three actions: `load`, `add`, `remove`. Each returns a new state object.", "The provider loads from AsyncStorage once and saves every time the state changes after loading.", "The screen reads the state with `useExpenses()` and sends actions with `dispatch`.", "The form checks the amount with `parseCents`, so an empty box or text such as \"abc\" shows an error and never reaches the list."),
    H("Expected output"),
    P("The top shows a big total, 0.00 at first. Add Lunch 12.50 in Food, Bus 3.20 in Travel and Coffee 4.00 in Food. The total reads 19.70 and the summary lines read Food: 16.50 and Travel: 3.20. The list shows three items, newest first. Remove Coffee and the total becomes 15.70. Close and reopen the app: the data remains. Entering abc shows \"Enter a title and an amount such as 12.50\"."),
    N(HONEST),
    ...task("Build the app and reproduce the numbers above.", "Add a monthly budget input and colour the total red above it.", "Add a `date` field to each expense and show this month's total.", "Run the money tests from the testing lesson against `money.ts`."),
    ...check("Totals always equal the sum of the list.", "Amounts never show floating-point noise.", "You can explain what a reducer and an action are."),
  ], A('Actions and a reducer', [
    n('ui', 'Screen', 'form and list', 0, 0, 'app'), n('act', 'dispatch', '{ type: "add" }', 1, 0, 'tool'),
    n('red', 'reducer', 'returns next state', 2, 0, 'check'), n('ctx', 'Context', 'shares the state', 3, 0, 'store'),
  ], [
    { say: 'The user adds an expense. The screen dispatches an action.', flow: ['ui>act:action'] },
    { say: 'The reducer receives the old state and the action.', flow: ['act>red:old state'] },
    { say: 'It returns a brand new state with the item added.', flow: ['red>ctx:new state'] },
    { say: 'Every component that uses the context redraws with the new list and totals.', on: ['ctx'] },
  ]), [
    faq('useReducer or useState?', 'Use useState for simple independent values. Use useReducer when several actions change the same data, because the rules then live in one tested function.'),
    faq('Is Context a replacement for a state library?', 'For modest apps, yes. Context re-renders every consumer when its value changes, so large or fast-changing state may need a store such as Zustand (project 10).'),
    faq('Why are cents safer than decimals?', 'Whole numbers are exact. Rounding only happens once, when you display the value.'),
  ]),

  // 8
  les(S, 'project-6-notes-app-with-expo-sqlite-and-search', 'Project 6: Notes App with expo-sqlite', 'Project 6: Notes App with SQLite',
    'Build a notes app with expo-sqlite: create a table, insert, update, delete and search with SQL, with a Modal editor and a floating button.', [
    P("When your data has many rows, relationships or needs searching and sorting, a real database is the right tool. SQLite is a small database that lives in a file on the phone, and Expo provides it through **expo-sqlite**. You write SQL, and your data survives app restarts."),
    H("Concepts in this project"),
    L("**SQL basics**: `CREATE TABLE` defines columns, `INSERT` adds a row, `UPDATE` changes one, `DELETE` removes one and `SELECT ... WHERE ... ORDER BY` reads.", "**Parameters**: put `?` in the SQL and pass the values in an array. This avoids SQL injection and quoting problems. Never join user text into SQL yourself.", "**Async API**: `openDatabaseAsync`, `execAsync`, `runAsync` and `getAllAsync` all return promises.", "**A small data layer**: all SQL is in `db.ts`. The screen calls `listNotes`, `saveNote` and `deleteNote` and knows nothing about SQL.", "**Modal**: a pop-up screen used here as the editor."),
    H("Create the project"),
    O("Use a blank Expo TypeScript project and install the library: `npx expo install expo-sqlite`.", "Add `db.ts` and replace `App.tsx`."),
    ...src('p6/db.ts', 'db.ts'),
    P("`getDb` opens the database once and creates the table if it is missing, then reuses the same connection. `listNotes` filters with `LIKE` and sorts the newest first."),
    ...src('p6/App.tsx', 'App.tsx'),
    H("How it works"),
    L("`refresh` runs the query for the current search text. The effect calls it at the start and whenever the text changes, so results narrow as you type.", "Tapping a note opens the editor with its values. The + button opens it empty.", "`saveNote` updates when the note has an `id`, and inserts otherwise.", "Long-pressing a note deletes it."),
    H("Expected output"),
    P("The first screen shows Notes, a search box and the message \"No notes yet. Tap + to add one.\" Tap +, enter a title and text and press Save: the note appears. Add two more. Type a word from one note in the search box and only the matching notes remain. Tap a note to edit it and save: it moves to the top because it has the newest update time. Long-press to delete. Close and reopen the app: the notes are still there."),
    N("If you change the table later (add a column), you need a migration, such as `ALTER TABLE notes ADD COLUMN pinned INTEGER DEFAULT 0`, run when the app starts. During development you can also uninstall the app to reset the database."),
    N(HONEST),
    ...task("Build the app and add three notes, then search.", "Add a `pinned` column and show pinned notes first.", "Ask the user to confirm before a long-press delete using `Alert.alert`.", "Show the update date on each card."),
    ...check("Notes persist after closing the app.", "Search narrows the list as you type.", "All SQL uses `?` parameters."),
  ], A('SQLite on the phone', [
    n('ui', 'Screen', 'list + editor', 0, 0, 'app'), n('layer', 'db.ts', 'saveNote, listNotes', 1, 0, 'tool'),
    n('sql', 'SQL', 'INSERT / SELECT', 2, 0, 'check'), n('file', 'notes.db', 'file on the phone', 3, 0, 'store'),
  ], [
    { say: 'The user saves a note. The screen calls saveNote.', flow: ['ui>layer:call'] },
    { say: 'The data layer runs an INSERT or UPDATE with ? parameters.', flow: ['layer>sql:run'] },
    { say: 'SQLite writes the row to the file.', flow: ['sql>file:write'] },
    { say: 'The screen calls listNotes again and shows the fresh result.', on: ['ui'] },
  ]), [
    faq('AsyncStorage or SQLite?', 'Use AsyncStorage for small settings and simple lists. Use SQLite for many rows, searching, sorting and relationships.'),
    faq('Why use ? placeholders?', 'The library sends the values separately from the SQL, so user text can never change the meaning of the query. This blocks SQL injection.'),
    faq('How do I keep the screen updated automatically?', 'In this project you call refresh after each change. Larger apps wrap queries in TanStack Query or use a library that observes the database.'),
  ]),

  // 9
  les(S, 'project-7-recipe-browser-with-tanstack-query', 'Project 7: Recipe Browser with Query', 'Project 7: Recipe Browser with Query',
    'Build a recipe browser with TanStack Query: caching, loading and error states, pull to refresh and a dynamic Expo Router detail screen.', [
    P("In project 4 you wrote loading and error state by hand. In a bigger app you do that on many screens, and you also want caching, retries and refresh. **TanStack Query** (formerly React Query) is the standard library for server data. You describe what to fetch, and it handles state, caching and updates. It is one of the most useful tools to learn for a React Native job."),
    H("Concepts in this project"),
    L("**useQuery**: takes a `queryKey` (the identity of the data) and a `queryFn` (how to fetch it). It returns `data`, `isLoading`, `isError`, `error`, `refetch` and `isRefetching`.", "**Caching**: the same key shows cached data instantly. `staleTime` says how long data counts as fresh.", "**QueryClientProvider**: put it at the top of the app, here in the root layout.", "**Dynamic routes**: `app/[id].tsx` matches any ID. Read it with `useLocalSearchParams`.", "**Mapping messy data**: TheMealDB returns ingredients as `strIngredient1`, `strIngredient2` and so on. `getMeal` collects them into a clean list.", "**Data source**: TheMealDB with its public test key. Check its current terms and that the test key still works before you build."),
    H("Create the project"),
    O("Use an Expo Router project (see project 3).", "Install the library: `npm install @tanstack/react-query`.", "Add the files shown."),
    C('text', `my-app/
  app/
    _layout.tsx    QueryClientProvider + Stack
    index.tsx      search and list
    [id].tsx       recipe detail
  src/
    api.ts         searchMeals and getMeal`),
    ...src('p7/api.ts', 'src/api.ts'),
    ...src('p7/_layout.tsx', 'app/_layout.tsx'),
    ...src('p7/index.tsx', 'app/index.tsx'),
    ...src('p7/[id].tsx', 'app/[id].tsx'),
    H("How it works"),
    L("The search screen keeps the box text and the submitted `term` separately. Only when the user submits does `term` change, which changes the query key and triggers a new fetch.", "Going back to a term you already searched shows cached results immediately.", "Pulling the list down calls `refetch`. `isRefetching` drives the spinner.", "The detail screen uses `enabled: !!id` so the query only runs when the ID exists."),
    H("Expected output"),
    P("The app opens on a Recipes screen and searches \"chicken\" by itself. A list of recipes with pictures appears. Search for \"pasta\" and press the search key: a new list loads. Search for \"chicken\" again: the old list appears instantly from the cache. Tap a recipe to see a large picture, its category and area, the ingredients with measures and the instructions. Turn on airplane mode and search a new word: the app shows an error message and does not crash."),
    N(HONEST),
    ...task("Build the app and search three words, then repeat the first one.", "Add a Retry button to the error state.", "Add a heart button that stores favourite IDs in AsyncStorage and a Favourites screen.", "Turn on the React Native debugging tools and watch the query states while you search."),
    ...check("Repeated searches show cached data at once.", "Pull to refresh reloads the list.", "You can explain what a query key is."),
  ], A('Server state with a cache', [
    n('screen', 'Screen', 'useQuery(key)', 0, 0, 'app'), n('cache', 'Query cache', 'keyed by search term', 1, 0, 'store'),
    n('fn', 'queryFn', 'fetch + map', 2, 0, 'tool'), n('api', 'Recipe API', 'JSON', 3, 0, 'cloud'),
  ], [
    { say: 'The screen asks for the data with a query key.', on: ['screen'] },
    { say: 'If the key is already cached and fresh, the cache answers instantly.', flow: ['screen>cache:key'] },
    { say: 'Otherwise the query function fetches and cleans the data.', flow: ['cache>fn:miss', 'fn>api:GET'] },
    { say: 'The result is stored in the cache and the screen redraws with it.', on: ['cache'] },
  ]), [
    faq('Why use TanStack Query instead of useEffect and fetch?', 'It gives you loading and error state, caching, retries, refetching and deduplicated requests with very little code. You avoid many bugs that hand-written effects have.'),
    faq('What is a query key?', 'It is the identity of the data, usually an array such as ["meals", term]. When the key changes, the library fetches again, and when it repeats, it can reuse the cache.'),
    faq('What is staleTime?', 'It is how long fetched data counts as fresh. During that time the library will not refetch it automatically.'),
  ]),
];
