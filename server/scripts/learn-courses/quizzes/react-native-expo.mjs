const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'react-native-development-expo-course';
export const quizzes = {
  'what-is-react-native-expo-setup-and-your-first-app': [
    Q('What does React Native draw on the phone?', ['Real native views', 'A web page in a hidden browser', 'Only images'], 0),
    Q('What is Expo Go?', ['An app that runs your project on your phone during development', 'A database', 'A code editor'], 0),
    Q('What is Fast Refresh?', ['The app updates on the phone when you save a file', 'A way to clear storage', 'An ad network'], 0),
  ],
  'javascript-and-typescript-essentials-for-react-native': [
    Q('Which keyword should you use by default for a value that is never reassigned?', ['const', 'var', 'let always'], 0),
    Q('What does map return?', ['A new array', 'The same array changed', 'A number'], 0),
    Q('What does await do?', ['Pauses an async function until a promise is ready', 'Deletes the promise', 'Runs code twice'], 0),
  ],
  'core-components-styling-state-and-project-1-tip-calculator': [
    Q('Where must all visible text be placed?', ['Inside a Text component', 'Directly inside a View', 'In app.json'], 0),
    Q('What is the default flex direction in React Native?', ['column', 'row', 'diagonal'], 0),
    Q('How should you update state?', ['Call the setter with a new value', 'Change the variable directly', 'Edit node_modules'], 0),
  ],
  'project-2-todo-list-flatlist-useeffect-and-asyncstorage': [
    Q('When does useEffect with an empty array run?', ['Once after the first render', 'On every render', 'Never'], 0),
    Q('Why not push into the existing state array?', ['React may not notice the change; a new array triggers a redraw', 'Arrays cannot grow', 'It is slower'], 0),
    Q('What is AsyncStorage best for?', ['Small data kept on the phone', 'Passwords', 'Large relational data'], 0),
  ],
  'project-3-quiz-app-with-expo-router-navigation': [
    Q('In Expo Router, what makes a route?', ['A file inside the app folder', 'A line in package.json', 'A component named Route'], 0),
    Q('What does router.replace do compared with push?', ['Swaps the current screen instead of stacking a new one', 'Closes the app', 'Reloads the data'], 0),
    Q('What type are route params?', ['Strings', 'Objects', 'Booleans only'], 0),
  ],
  'project-4-weather-app-fetch-api-loading-and-error-states': [
    Q('Why check res.ok after fetch?', ['fetch does not throw on HTTP errors like 404', 'It speeds up the call', 'It sets the cache'], 0),
    Q('What does a union type for state help with?', ['Making impossible states impossible and handling each case', 'Making requests faster', 'Hiding the spinner'], 0),
    Q('Why should a secret API key stay out of the app?', ['Anything in the app can be extracted', 'Keys cannot be strings', 'Expo bans keys'], 0),
  ],
  'project-5-expense-tracker-usereducer-context-and-money': [
    Q('What does a reducer return?', ['The next state', 'A component', 'A promise always'], 0),
    Q('Why store money as cents?', ['Whole numbers are exact', 'Phones cannot show decimals', 'It makes lists shorter'], 0),
    Q('What does useMemo do?', ['Caches a calculated value until its inputs change', 'Saves data to disk', 'Opens a new screen'], 0),
  ],
  'project-6-notes-app-with-expo-sqlite-and-search': [
    Q('Why use ? placeholders in SQL?', ['Values are sent separately, which blocks SQL injection', 'They make queries shorter', 'SQLite requires comments'], 0),
    Q('When is SQLite a better choice than AsyncStorage?', ['Many rows, searching and sorting', 'A single on/off setting', 'Storing a token'], 0),
    Q('What do you need if you add a column to a released app?', ['A migration', 'A new phone', 'Nothing'], 0),
  ],
  'project-7-recipe-browser-with-tanstack-query': [
    Q('What is a query key?', ['The identity of the data, such as ["meals", term]', 'A password', 'A file name'], 0),
    Q('What happens when you repeat a search that is cached and fresh?', ['The cached data shows immediately', 'The app crashes', 'It always waits for the server'], 0),
    Q('What does enabled: !!id do?', ['Runs the query only when the id exists', 'Deletes the id', 'Turns on dark mode'], 0),
  ],
  'project-8-photo-journal-camera-image-picker-and-file-system': [
    Q('What should the app do if the user denies camera permission?', ['Explain and keep working', 'Crash', 'Ask again in a loop'], 0),
    Q('Why copy a picked photo into the app\'s folder?', ['The picker address is temporary', 'To make it larger', 'To change its colour'], 0),
    Q('Where do iOS permission messages come from?', ['Texts you write in app.json', 'The user', 'Apple writes them for you'], 0),
  ],
  'project-9-habit-tracker-streaks-and-local-notifications': [
    Q('Why store completed days as text keys like 2026-11-04?', ['They avoid time-zone bugs', 'They are shorter than numbers', 'Notifications need them'], 0),
    Q('What is a local notification?', ['One the app schedules on the phone, without a server', 'One sent from a server only', 'An email'], 0),
    Q('Why pass the date into the streak function?', ['It makes the function easy to test', 'It is required by JavaScript', 'It saves memory'], 0),
  ],
  'project-10-shop-app-zustand-cart-tabs-and-product-list': [
    Q('What does a Zustand selector do?', ['Subscribes a component to one part of the store', 'Deletes the store', 'Draws tabs'], 0),
    Q('Why derive the cart total with a function over the lines?', ['It cannot go out of date', 'It is required by Expo', 'It saves storage'], 0),
    Q('What does the demo checkout do in this app?', ['Clears the cart; no real payment', 'Charges a card', 'Sends an email'], 0),
  ],
  'forms-validation-secure-storage-and-api-authentication': [
    Q('Where should a login token be stored?', ['expo-secure-store', 'AsyncStorage', 'In the source code'], 0),
    Q('Is client-side validation enough?', ['No, the server must validate too', 'Yes, always', 'Only for passwords'], 0),
    Q('How does a protected group of screens work in Expo Router?', ['A layout redirects to login when there is no token', 'The router blocks it automatically', 'Screens hide themselves'], 0),
  ],
  'testing-and-performance-for-react-native-apps': [
    Q('Which tests are the fastest and easiest to write?', ['Tests of plain functions', 'Tests that need a physical device', 'Tests of the camera'], 0),
    Q('Which list component should you use for a long list?', ['FlatList', 'ScrollView with every item', 'Text'], 0),
    Q('Where should you judge app speed?', ['In a release build on a real phone', 'In a development build on an emulator', 'In the browser'], 0),
  ],
  'build-and-publish-with-eas-and-react-native-interview-prep': [
    Q('What does EAS Build do?', ['Builds signed app files in the cloud', 'Writes your code', 'Hosts your database'], 0),
    Q('What can an EAS update change?', ['JavaScript and assets, not native code', 'Anything including native libraries', 'Only the app icon in the store'], 0),
    Q('What format does Google Play need for production?', ['AAB', 'APK only', 'ZIP'], 0),
  ],
};
