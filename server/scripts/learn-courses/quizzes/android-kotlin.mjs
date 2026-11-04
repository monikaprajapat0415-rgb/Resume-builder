const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'android-development-kotlin-course';
export const quizzes = {
  'what-is-android-development-and-your-first-app': [
    Q('What is a composable function?', ['A function marked @Composable that describes part of the screen', 'A function that only runs in the background', 'A file that holds images'], 0),
    Q('What does Gradle do?', ['Builds the app and downloads the libraries it needs', 'Draws the screen', 'Stores user data'], 0),
    Q('Which Android Studio template does this course start from?', ['Empty Activity with Compose', 'Game project', 'Wear OS watch face'], 0),
  ],
  'kotlin-basics-variables-types-functions-and-control-flow': [
    Q('What is the difference between val and var?', ['val cannot be reassigned, var can', 'val is for numbers only', 'They are identical'], 0),
    Q('What does "Total: ${a + b}" do?', ['Puts the result of a + b into the text', 'Prints the characters as written', 'Causes an error'], 0),
    Q('What are named arguments for?', ['Making calls easy to read, e.g. greet(name = "Ravi")', 'Making code run faster', 'Declaring variables'], 0),
  ],
  'kotlin-classes-collections-null-safety-and-lambdas': [
    Q('What does a data class generate for you?', ['toString, equals, hashCode and copy', 'A database table', 'A screen'], 0),
    Q('What does ?: do in name ?: "Guest"?', ['Uses "Guest" when name is null', 'Makes name null', 'Compares two strings'], 0),
    Q('What does filter return?', ['A new list with the items that pass the test', 'The same list changed in place', 'A single number'], 0),
  ],
  'jetpack-compose-basics-state-and-project-1-tip-calculator': [
    Q('What is recomposition?', ['Compose running a composable again because its state changed', 'Rebuilding the whole app', 'Restarting the phone'], 0),
    Q('Why is remember needed with mutableStateOf?', ['It keeps the value between recompositions', 'It saves it to the database', 'It makes it a string'], 0),
    Q('Which keeps a typed value through rotation?', ['rememberSaveable', 'val', 'Modifier.padding'], 0),
  ],
  'project-2-todo-list-viewmodel-lazycolumn-and-state-hoisting': [
    Q('Why use a ViewModel for screen state?', ['It survives rotation and holds logic', 'It draws the UI', 'It replaces Gradle'], 0),
    Q('What is state hoisting?', ['Passing state down and events up instead of owning state in a small composable', 'Moving files to another folder', 'Hiding the status bar'], 0),
    Q('Why give LazyColumn items a key?', ['So Compose can track which row is which when the list changes', 'To make rows bigger', 'To sort the rows'], 0),
  ],
  'project-3-unit-converter-dropdown-menus-and-validation': [
    Q('Why convert through a base unit?', ['It needs only two formulas per unit instead of one for each pair', 'It is required by Android', 'It avoids using Kotlin'], 0),
    Q('What should the app do when the typed text is not a number?', ['Show nothing or a message, never crash', 'Crash with an error', 'Use the last result'], 0),
    Q('Where should the menu open/closed flag live?', ['In local remember state of the picker', 'In the database', 'In the manifest'], 0),
  ],
  'project-4-quiz-app-navigation-compose-and-multiple-screens': [
    Q('What does NavHost do?', ['Shows the current destination and lists the routes', 'Downloads images', 'Runs tests'], 0),
    Q('What does popUpTo do when navigating?', ['Removes screens from the back stack', 'Opens a pop-up window', 'Plays a sound'], 0),
    Q('How should you pass a big object to another screen?', ['Pass an id and load the object on the next screen', 'Put the whole object in the route', 'Use a global variable'], 0),
  ],
  'project-5-notes-app-room-database-dao-and-flow': [
    Q('What is a DAO in Room?', ['An interface with the functions that read and write the database', 'A screen', 'A Gradle plugin'], 0),
    Q('Why return Flow from a DAO query?', ['The screen gets a new list whenever the table changes', 'It makes the query faster to write', 'It encrypts the data'], 0),
    Q('What must you do after adding a column to an entity in a released app?', ['Raise the version and add a migration', 'Nothing', 'Delete the DAO'], 0),
  ],
  'project-6-weather-app-retrofit-coroutines-and-api-calls': [
    Q('What does a suspend function allow?', ['Pausing without blocking a thread', 'Running only on the main thread', 'Skipping errors'], 0),
    Q('Why use a sealed UiState with Loading, Success and Error?', ['The compiler checks that every state is handled', 'It makes network calls faster', 'It saves data'], 0),
    Q('Why should an API key not be placed in the app?', ['Anyone can extract it from the APK', 'Keys are too long', 'Kotlin forbids strings'], 0),
  ],
  'project-7-expense-tracker-room-sql-totals-and-money': [
    Q('Why store money as whole cents?', ['Floating point cannot store many decimals exactly', 'Cents use less memory than text', 'Room only supports Long'], 0),
    Q('Which SQL does the database use to total by category?', ['SUM with GROUP BY', 'SELECT * only', 'DROP TABLE'], 0),
    Q('Why is the total a Flow?', ['It updates the moment an expense is added or removed', 'Flow makes it a string', 'It avoids the database'], 0),
  ],
  'project-8-posts-reader-coil-images-search-and-pull-to-refresh': [
    Q('What does Coil do?', ['Loads, caches and shows images in Compose', 'Navigates between screens', 'Stores settings'], 0),
    Q('Where should the search filter live?', ['In the ViewModel', 'In the manifest', 'In the image loader'], 0),
    Q('What is produceState good for?', ['A small one-off load inside a composable', 'Signing the app', 'Drawing icons'], 0),
  ],
  'project-9-habit-tracker-datastore-workmanager-and-notifications': [
    Q('When is DataStore a better fit than Room?', ['For small settings or simple data', 'For millions of rows', 'For drawing UI'], 0),
    Q('Why are WorkManager reminders not exact?', ['Android may delay periodic work to save battery', 'Kotlin rounds time', 'Notifications ignore time'], 0),
    Q('What must the app do on Android 13 and newer to show notifications?', ['Ask for the POST_NOTIFICATIONS permission', 'Nothing', 'Restart the phone'], 0),
  ],
  'project-10-recipe-book-capstone-hilt-room-retrofit-navigation': [
    Q('What does Hilt do?', ['Creates and provides the objects your classes need', 'Draws the bottom bar', 'Tests the UI'], 0),
    Q('What is a repository?', ['One place that gives the app its data from network and database', 'A Git folder', 'A screen layout'], 0),
    Q('Why can favourites open without internet?', ['Their details are saved in Room', 'Retrofit works offline', 'Coil downloads them again'], 0),
  ],
  'testing-and-performance-for-android-apps': [
    Q('Where do local unit tests run?', ['On your computer\'s JVM, with no phone', 'Only on a device', 'Only in Play Console'], 0),
    Q('Why does a ViewModel test need a main dispatcher rule?', ['viewModelScope uses the main thread, which a local test does not have', 'To speed up Gradle', 'To draw the UI'], 0),
    Q('Which keeps an app smooth?', ['Never block the main thread', 'Do heavy work inside composables', 'Load full-size photos for thumbnails'], 0),
  ],
  'release-your-android-app-signing-r8-play-store-and-interview-prep': [
    Q('Which file format does Google Play require for new apps?', ['AAB (Android App Bundle)', 'ZIP', 'EXE'], 0),
    Q('What does R8 do in a release build?', ['Removes unused code and shrinks the app', 'Adds ads', 'Creates the icon'], 0),
    Q('What must go up with every Play Store upload?', ['versionCode', 'The package name', 'The keystore password'], 0),
  ],
};
