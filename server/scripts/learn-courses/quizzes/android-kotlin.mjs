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
  'kotlin-oop-in-depth-classes-interfaces-sealed-generics-and-solid': [
    Q('Why use a sealed class for screen state?', ['The compiler checks that every case is handled in a when', 'It makes the app faster', 'It stores data on disk'], 0),
    Q('What does the S in SOLID stand for?', ['Single responsibility: one reason to change', 'Speed', 'Storage'], 0),
    Q('What does an interface give you?', ['A contract that different classes can implement', 'A database', 'A layout'], 0),
  ],
  'advanced-kotlin-scope-functions-extensions-coroutines-and-flow': [
    Q('What does a suspend function do?', ['It can pause without blocking the thread', 'It stops the app', 'It runs only at night'], 0),
    Q('What is a Flow?', ['A stream of values that arrive over time', 'A single number', 'A layout'], 0),
    Q('What does an extension function do?', ['Adds a function to an existing class without changing it', 'Deletes a class', 'Creates a database'], 0),
  ],
  'android-fundamentals-activities-fragments-services-intents-and-permissions': [
    Q('What is an explicit intent?', ['One that names the exact component to start', 'One that asks the user a question', 'One that stores data'], 0),
    Q('When should you ask for a dangerous permission?', ['When the feature needs it, with a reason', 'On the very first launch for all permissions', 'Never'], 0),
    Q('What does the manifest declare?', ['Components, permissions and app details', 'The button colours', 'The database rows'], 0),
  ],
  'jetpack-compose-in-depth-layouts-theming-side-effects-and-animation': [
    Q('What is LaunchedEffect for?', ['Running a suspend side effect tied to composition', 'Drawing a button', 'Installing the app'], 0),
    Q('What does state hoisting mean?', ['Moving state up to the caller so the composable is stateless', 'Saving state to disk', 'Deleting state'], 0),
    Q('Why use a Material theme?', ['Consistent colours, type and shapes across the app', 'To make the APK smaller', 'To run faster'], 0),
  ],
  'traditional-android-ui-xml-layouts-recyclerview-and-viewbinding': [
    Q('What does ViewBinding replace?', ['findViewById calls', 'The manifest', 'Gradle'], 0),
    Q('Why does RecyclerView recycle views?', ['To reuse row views and save memory', 'To delete data', 'To load images'], 0),
    Q('What does DiffUtil do?', ['Finds what changed between two lists', 'Draws the divider', 'Sorts users'], 0),
  ],
  'android-architecture-mvvm-mvi-clean-architecture-and-modularization': [
    Q('What is the ViewModel\'s job?', ['Hold screen state and survive rotation', 'Draw the buttons', 'Store files'], 0),
    Q('What does MVI add compared to MVVM?', ['One state object and explicit intents or events', 'A database', 'A new language'], 0),
    Q('What does dependency injection help with?', ['Providing dependencies so classes are easy to test and swap', 'Making the screen bigger', 'Encrypting data'], 0),
  ],
  'jetpack-libraries-room-relations-paging-camerax-and-offline-first': [
    Q('What does an offline-first app do?', ['Reads from the local database and syncs with the network', 'Needs the internet for every screen', 'Never saves data'], 0),
    Q('What is Paging for?', ['Loading long lists in pages as the user scrolls', 'Printing pages', 'Drawing a pager'], 0),
    Q('What does a Room @Relation describe?', ['A link between tables loaded together', 'A permission', 'A colour'], 0),
  ],
  'networking-in-depth-okhttp-interceptors-jwt-oauth-and-pagination': [
    Q('What is an interceptor?', ['Code that sees every request or response', 'A database', 'A screen'], 0),
    Q('Where should a JWT be stored on the device?', ['In encrypted storage', 'In plain text in a file', 'In the app name'], 0),
    Q('Why paginate an API?', ['To avoid downloading huge lists at once', 'To hide errors', 'To change colours'], 0),
  ],
  'firebase-for-android-auth-firestore-storage-push-and-analytics': [
    Q('What protects Firestore data?', ['Security rules', 'The app icon', 'The package name'], 0),
    Q('What does google-services.json hold?', ['Your Firebase project settings for the app', 'Your password', 'The app code'], 0),
    Q('What sends a push to a device?', ['A server or Cloud Function using the device token', 'The app by itself', 'The keyboard'], 0),
  ],
  'android-security-keystore-biometrics-r8-and-owasp-mobile': [
    Q('What is the Android Keystore for?', ['Keeping cryptographic keys in protected storage', 'Storing photos', 'Running apps'], 0),
    Q('What does BiometricPrompt tell your app?', ['Success or failure, not the biometric data', 'The fingerprint image', 'The user\'s name'], 0),
    Q('Why must the server validate again?', ['The app can be modified by an attacker', 'Servers are faster', 'The app is encrypted'], 0),
  ],
  'background-work-and-device-features-camera-location-maps-sensors-payments': [
    Q('When is WorkManager the right choice?', ['Reliable deferrable work that must still run later', 'Updating a button', 'Drawing text'], 0),
    Q('What should a payment flow never do?', ['Store or handle raw card numbers in your app', 'Use a provider', 'Confirm on a server'], 0),
    Q('What must you do with a sensor listener?', ['Unregister it when not needed', 'Leave it on', 'Rename it'], 0),
  ],
  'ai-and-machine-learning-in-android-gemini-ml-kit-and-tensorflow-lite': [
    Q('Where should an AI API key live?', ['On your server, not in the app', 'In strings.xml', 'In the app name'], 0),
    Q('What is an advantage of on-device ML Kit?', ['It works without a network', 'It needs a server', 'It is always larger'], 0),
    Q('What is a good habit with AI answers?', ['Tell users they can be wrong', 'Hide that AI is used', 'Never test them'], 0),
  ],
  'testing-debugging-and-performance-in-depth-for-android': [
    Q('What do unit tests run on?', ['The JVM, without a device', 'Only a phone', 'Only a watch'], 0),
    Q('What is Logcat?', ['The log viewer for your running app', 'A layout', 'A database'], 0),
    Q('Why use baseline profiles?', ['To speed up startup', 'To add ads', 'To change colours'], 0),
  ],
  'git-gradle-ci-cd-and-play-store-release-in-depth': [
    Q('What does CI do?', ['Builds and tests code automatically on each change', 'Draws screens', 'Edits photos'], 0),
    Q('Which key signs your release?', ['Your upload or signing key', 'The debug key only', 'None'], 0),
    Q('Why use version catalogs?', ['Keep dependency versions in one place', 'Make images smaller', 'Run tests'], 0),
  ],
  'enterprise-android-multi-module-websockets-i18n-and-other-form-factors': [
    Q('What is a benefit of multi-module projects?', ['Faster builds and clearer boundaries', 'Fewer files always', 'No Gradle'], 0),
    Q('What do you need for translations?', ['Strings in resource files per language', 'Hard-coded text', 'Images only'], 0),
    Q('What does a WebSocket give you?', ['A long-lived two-way connection', 'A one-time file', 'A database'], 0),
  ],
  'project-11-calculator-app-expression-parser-and-compose-keypad': [
    Q('What does the parser calculate first in 2+3*4?', ['3*4', '2+3', '4 only'], 0),
    Q('What does evaluate return for bad input?', ['null', 'A crash', 'Zero'], 0),
    Q('Why keep Calculator free of Android imports?', ['So it can be unit tested easily', 'So it is hidden', 'So it is slower'], 0),
  ],
  'project-12-e-commerce-app-products-cart-and-demo-checkout': [
    Q('Why store prices as cents?', ['Integers avoid rounding errors', 'They look nicer', 'Room requires it'], 0),
    Q('Why keep the cart in Room?', ['It survives closing the app', 'It is faster to type', 'It is required by Retrofit'], 0),
    Q('Where should payment be confirmed?', ['On your server with a provider', 'Only in the app', 'In the cart'], 0),
  ],
  'project-13-real-time-chat-app-firebase-auth-firestore-and-push': [
    Q('What does callbackFlow do here?', ['Turns a snapshot listener into a Flow', 'Sends push messages', 'Signs users in'], 0),
    Q('What do the security rules enforce?', ['Only signed-in users read, and senders use their own id', 'Anyone may edit', 'Nothing'], 0),
    Q('Who sends a push notification?', ['A server or Cloud Function', 'The receiving app', 'The keyboard'], 0),
  ],
  'project-14-fitness-tracker-step-sensor-room-history-and-canvas-chart': [
    Q('Why is a baseline needed?', ['The sensor gives steps since boot', 'The sensor is broken', 'Room needs it'], 0),
    Q('Which permission does the step counter need?', ['ACTIVITY_RECOGNITION', 'CAMERA', 'INTERNET only'], 0),
    Q('What draws the bar chart?', ['A Compose Canvas', 'A database', 'A service'], 0),
  ],
  'project-15-food-delivery-app-cart-order-tracking-and-google-maps': [
    Q('Why model order status as an enum?', ['Known values with labels, checked by the compiler', 'Faster network', 'Less memory'], 0),
    Q('Where would real courier positions come from?', ['Your server, pushed to the app', 'The Maps library alone', 'A constant'], 0),
    Q('How do you keep a Maps key out of git?', ['local.properties and the Secrets plugin', 'Paste it in code', 'Email it'], 0),
  ],
  'project-16-music-player-media3-exoplayer-and-background-playback': [
    Q('Why does the player live in a service?', ['So music keeps playing after the screen closes', 'To look nicer', 'To use less code'], 0),
    Q('What connects the screen to the session?', ['A MediaController', 'A Room DAO', 'An Intent filter'], 0),
    Q('Which music may you stream?', ['Audio you have the right to use', 'Anything online', 'Only paid songs'], 0),
  ],
  'project-17-qr-code-scanner-camerax-and-ml-kit-barcode-scanning': [
    Q('What must the analyzer do after each frame?', ['Close the ImageProxy', 'Delete the file', 'Restart the phone'], 0),
    Q('What should the app do with a scanned link?', ['Show it and open only after a tap', 'Open it at once', 'Ignore it'], 0),
    Q('What shows the camera in Compose?', ['A PreviewView inside AndroidView', 'A Text', 'A Room query'], 0),
  ],
  'project-18-banking-app-secure-login-biometrics-and-encrypted-token': [
    Q('What does the app store after login?', ['An encrypted token, not the password', 'The password', 'The card number'], 0),
    Q('Why is an IV stored with the data?', ['AES-GCM needs it to decrypt', 'To hide the key', 'To speed up the network'], 0),
    Q('What does FLAG_SECURE do?', ['Blocks screenshots and recents previews', 'Encrypts the disk', 'Locks the SIM'], 0),
  ],
  'project-19-ai-chatbot-app-streaming-replies-history-and-safe-api-design': [
    Q('Why use a fake AiService?', ['To build and test without a key or server', 'To save money on screens', 'To hide errors'], 0),
    Q('What happens when the user presses Stop?', ['The job is cancelled and the partial text is kept', 'The app closes', 'History is deleted'], 0),
    Q('Why send only recent history?', ['The model has no memory and long requests cost more', 'Room limits it', 'Retrofit requires it'], 0),
  ],
  'project-20-video-streaming-app-media3-exoplayer-hls-and-playlist': [
    Q('What is HLS?', ['An adaptive streaming format using .m3u8 playlists', 'A database', 'A layout'], 0),
    Q('Why release the player on dispose?', ['It frees decoders and memory', 'It deletes the video', 'It signs the app'], 0),
    Q('What puts PlayerView in Compose?', ['AndroidView', 'LazyColumn', 'Room'], 0),
  ],
  'project-21-job-portal-app-search-filters-resume-upload-and-backend': [
    Q('Why does OpenDocument need no storage permission?', ['The system picker grants access only to the chosen file', 'It is a bug', 'It uses the internet'], 0),
    Q('Why validate the resume on the server too?', ['The app can be bypassed', 'Servers are slower', 'Retrofit asks for it'], 0),
    Q('What is shown from the filter and full list?', ['A derived list computed from both', 'A separate stored copy', 'Nothing'], 0),
  ],
  'android-developer-interview-questions-kotlin-compose-architecture-and-system-design': [
    Q('What is a good way to answer an interview question?', ['Explain the idea, give an example, mention a trade-off', 'Recite a definition only', 'Say you do not know'], 0),
    Q('What does remember do in Compose?', ['Keeps a value across recompositions', 'Saves to disk', 'Starts a service'], 0),
    Q('What is a good first step in system design?', ['Clarify requirements and constraints', 'Write code at once', 'Pick a database'], 0),
  ],
};
