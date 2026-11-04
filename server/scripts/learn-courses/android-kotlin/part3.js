import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { kt, file } from './files.js';

const S = 'Advanced Apps and Release';
const HONEST = "The code in this course was syntax-checked with a Kotlin parser. It was not compiled or run on a device while the course was written, so type it in, build it in Android Studio and fix any small differences your tool versions show. Library versions move quickly: accept the newer versions Android Studio suggests.";

export const lessons = [
  // 11
  les(S, 'project-8-posts-reader-coil-images-search-and-pull-to-refresh', 'Project 8: Posts Reader with Images and Pull to Refresh', 'Project 8: Posts Reader with Coil Images',
    'Build a posts reader with Retrofit and Coil: images from the internet, pull to refresh, search and a detail screen with Navigation Compose.', [
    P("This project joins what you know into the shape of a typical content app: a feed of items with pictures, a way to refresh it, a search box and a detail screen. News apps, social apps and shop catalogues all work this way. New parts are image loading with **Coil**, **pull to refresh** and sharing one ViewModel between two screens."),
    H("Concepts in this project"),
    L("**Coil**: a small image-loading library for Compose. `AsyncImage(model = url, ...)` downloads, caches and shows a picture, with placeholders and error handling.", "**Pull to refresh**: the user drags the list down to reload. Material 3 provides `PullToRefreshBox`.", "**Search**: the ViewModel keeps the full list and the query, and exposes a filtered list.", "**List and detail**: tapping a row navigates to `post/{id}`, and the detail screen finds the item by ID.", "**Test APIs**: `jsonplaceholder.typicode.com` gives fake posts and `picsum.photos` gives random pictures, both without keys. Check that they are still available before you build."),
    H("Create the project"),
    O("New Empty Activity project `Posts`, package `com.example.posts`.", "Add Retrofit, serialization, Coil, Navigation Compose and lifecycle libraries from the snippet, then sync. Add the INTERNET permission.", "Create four files."),
    ...file('gradle/p8-p9.txt', 'Gradle additions for projects 8 and 9', 'text'),
    C('text', `Posts/app/src/main/java/com/example/posts/
  PostApi.kt        DTOs + Retrofit
  PostViewModel.kt  list, query, refresh
  PostsApp.kt       NavHost, list screen, detail screen
  MainActivity.kt`),
    H("The code"),
    ...kt('p8', 'PostApi.kt', 'posts'),
    ...kt('p8', 'PostViewModel.kt', 'posts'),
    ...kt('p8', 'PostsApp.kt', 'posts'),
    P("The detail screen uses `produceState`, which starts a coroutine for a composable and gives back the result as state. It is a short way to load one item when a full ViewModel would be too much."),
    ...kt('p8', 'MainActivity.kt', 'posts'),
    H("Expected output"),
    P("The first screen shows a search bar and a list of posts, each with a small picture, a title and a short body. While loading, a progress indicator shows. Drag the list down: a refresh spinner shows and the list reloads. Type a word in the search bar and the list is filtered by title. Tap a post to open the detail screen with a large picture and the full text. Back returns to the list with your search text still in place."),
    N(HONEST),
    ...task("Build the app, scroll the list, search for a word, open a post and go back.", "Add a loading placeholder and an error image to `AsyncImage` using the `placeholder` and `error` options.", "Add a Favourite star on the detail screen that stores IDs in a `mutableStateListOf`.", "Test the offline case. What does the user see? Add an Error state with a Retry button."),
    ...check("Pictures load and are cached when you scroll back up.", "Pull to refresh reloads the data.", "Going back from the detail screen keeps the search text."),
  ], A('Feed, images and detail', [
    n('api', 'API', 'posts JSON', 0, 0, 'cloud'), n('vm', 'ViewModel', 'list + query', 1, 0, 'tool'),
    n('list', 'List screen', 'rows with images', 2, 0, 'app'), n('detail', 'Detail screen', 'post/{id}', 3, 0, 'out'),
  ], [
    { say: 'Retrofit loads the posts from the server.', flow: ['api>vm:posts'] },
    { say: 'The ViewModel keeps the list and the search text, and exposes the filtered list.', on: ['vm'] },
    { say: 'The list screen draws rows. Coil downloads and caches each picture.', flow: ['vm>list:filtered'] },
    { say: 'Tapping a row navigates to post/{id}, and the detail screen shows that post.', flow: ['list>detail:id'] },
  ]), [
    faq('Why use Coil instead of loading images myself?', 'Image loading needs caching, resizing, cancelling when rows scroll away and error handling. Coil does all of this and works directly with Compose.'),
    faq('Should the search filter run in the ViewModel or the screen?', 'In the ViewModel. It keeps the screen simple and the logic testable, and it survives rotation.'),
    faq('What is produceState?', 'It starts a coroutine tied to a composable and exposes the result as state. It suits small, one-off loads where a ViewModel would be too much.'),
  ]),

  // 12
  les(S, 'project-9-habit-tracker-datastore-workmanager-and-notifications', 'Project 9: Habit Tracker with DataStore and Notifications', 'Project 9: Habit Tracker and Reminders',
    'Build a habit tracker with streaks saved in Jetpack DataStore and a daily reminder using WorkManager and a notification, including the notification permission.', [
    P("Habit trackers show the features that make an app feel alive: it remembers your settings, it keeps a streak and it reminds you at the right time even when closed. This project covers three tools: **DataStore** for small saved data, **WorkManager** for background work, and **notifications** with the permission needed on newer Android versions."),
    H("Concepts in this project"),
    L("**DataStore**: the modern replacement for SharedPreferences. It stores small data asynchronously and exposes it as a Flow. This project stores the habit list as JSON text in one key.", "**Streak logic**: a pure function counts consecutive days ending today (or yesterday) from a set of completed dates.", "**WorkManager**: runs work that must happen even if the app is closed or the phone restarts. A periodic request is not exact, which suits reminders.", "**Notification channel**: from Android 8 every notification belongs to a channel the user can control.", "**Runtime permission**: from Android 13 the app must ask for `POST_NOTIFICATIONS`. Use the activity result API from Compose, and handle a refusal gracefully."),
    H("Create the project"),
    O("New Empty Activity project `Habits`, package `com.example.habits`.", "Add DataStore, WorkManager, serialization and lifecycle libraries, then sync.", "Add the permission lines from `AndroidManifest-additions.xml` to the manifest.", "Create the files below."),
    ...file('gradle/p8-p9.txt', 'Gradle additions (DataStore, WorkManager)', 'text'),
    ...file('p9/AndroidManifest-additions.xml', 'app/src/main/AndroidManifest.xml (add these lines)', 'xml'),
    C('text', `Habits/app/src/main/java/com/example/habits/
  HabitStore.kt      DataStore + JSON + streak maths
  HabitViewModel.kt
  ReminderWorker.kt  WorkManager worker and notification
  HabitScreen.kt     list, add, today check, permission
  MainActivity.kt`),
    H("The code"),
    ...kt('p9', 'HabitStore.kt', 'habits'),
    ...kt('p9', 'HabitViewModel.kt', 'habits'),
    ...kt('p9', 'ReminderWorker.kt', 'habits'),
    P("The worker creates the channel (safe to repeat) and posts the notification only if the permission is granted. A worker must finish quickly and return a result. Do not try to schedule exact alarms with WorkManager. If you need an exact time, such as an alarm clock, that is a different API with extra permissions."),
    ...kt('p9', 'HabitScreen.kt', 'habits'),
    ...kt('p9', 'MainActivity.kt', 'habits'),
    H("Expected output"),
    P("The screen lists your habits with a check button for today and the streak, for example \"Drink water, 3 day streak\". Add the habits Read and Walk. Press Done on Read: the streak shows 1. On first launch Android asks for notification permission (Android 13 or newer). Allow it. A reminder is scheduled about once a day. For testing, change the interval or use the Work Manager inspector in Android Studio to run the job now, and a notification appears saying it is time for your habits. Close the app and reopen it: all habits and streaks are still there."),
    N(HONEST),
    ...task("Build the app, add two habits, mark one done and restart the app.", "Test the permission: deny it, and check the app still works without crashing.", "Use the App Inspection > Background Task Inspector to see the scheduled work.", "Write a test for the streak function with dates for today, yesterday and a gap."),
    ...check("Habits and streaks persist after the app restarts.", "Denying the permission does not crash the app.", "You can explain why WorkManager reminders are not exact."),
  ], A('Saved data and reminders', [
    n('ui', 'Screen', 'Done button', 0, 0, 'user'), n('store', 'DataStore', 'habits as JSON', 1, 0, 'store'),
    n('work', 'WorkManager', 'daily job', 2, 0, 'tool'), n('note', 'Notification', 'time for habits', 3, 0, 'out'),
  ], [
    { say: 'The user presses Done. The date is added to that habit.', flow: ['ui>store:save'] },
    { say: 'DataStore keeps the data on the phone and sends it back as a Flow.', on: ['store'] },
    { say: 'WorkManager runs the reminder job about once a day, even if the app is closed.', flow: ['store>work:read habits'] },
    { say: 'The job posts a notification, if the user allowed it.', flow: ['work>note:notify'] },
  ]), [
    faq('DataStore or Room?', 'Use DataStore for small settings and simple data. Use Room when you have many rows, relations or need queries.'),
    faq('Why is the reminder time not exact?', 'WorkManager is designed to save battery, so Android may delay periodic work a little. Use it for reminders where a few minutes do not matter.'),
    faq('What happens if the user denies notifications?', 'The app should keep working and may explain why notifications help, with a link to settings. Never block the whole app on this permission.'),
  ]),

  // 13
  les(S, 'project-10-recipe-book-capstone-hilt-room-retrofit-navigation', 'Project 10 Capstone: Recipe Book with Hilt, Room and Retrofit', 'Project 10: Recipe Book Capstone with Hilt',
    'Build a capstone recipe app with clean layers: Retrofit search, Room favourites, Hilt injection and bottom navigation in Jetpack Compose.', [
    P("The last project joins everything. It searches recipes online, shows details, lets you save favourites that work offline and has a bottom navigation bar. It also introduces **dependency injection** with Hilt, the standard tool for wiring a larger app together, so the code stays organised as it grows."),
    H("Concepts in this project"),
    L("**Layers**: UI (screens), ViewModels (state and logic), repository (one place for data), and data sources (Retrofit for the network, Room for the database).", "**Dependency injection**: instead of a class creating the things it needs, they are handed in. Hilt creates and shares one Retrofit, one database and one repository for the whole app.", "**`@HiltViewModel` and `hiltViewModel()`**: ViewModels get their dependencies automatically.", "**SavedStateHandle**: gives the ViewModel the navigation arguments, such as the recipe ID.", "**Bottom navigation**: `NavigationBar` switches between Search and Favourites while keeping each screen's state.", "**Data source**: TheMealDB, a free recipe API with a public test key. Check its current terms and whether the test key still works before building."),
    H("Create the project"),
    O("New Empty Activity project `Recipes`, package `com.example.recipes`.", "Add the Hilt and KSP plugins, then the Hilt, Retrofit, Room, Coil, serialization and navigation libraries. Sync.", "Add `android:name=\".RecipeApp\"` to the `<application>` tag and the INTERNET permission to the manifest.", "Create the files in the structure below."),
    ...file('gradle/p10.txt', 'Gradle additions for project 10', 'text'),
    C('text', `Recipes/app/src/main/java/com/example/recipes/
  RecipeApp.kt          @HiltAndroidApp application class
  MainActivity.kt       @AndroidEntryPoint, shows RecipeNav
  Models.kt             API models + Recipe + favourite entity
  MealApi.kt            Retrofit interface
  FavouriteDao.kt       Room DAO + database
  AppModule.kt          Hilt module: provides Retrofit, Room, DAO
  RecipeRepository.kt   one place to get recipes and favourites
  RecipeViewModels.kt   Search, Detail and Favourites ViewModels
  RecipeNav.kt          NavHost, bottom bar, screens`),
    H("The code"),
    ...kt('p10', 'RecipeApp.kt', 'recipes'),
    ...kt('p10', 'MainActivity.kt', 'recipes'),
    ...kt('p10', 'Models.kt', 'recipes'),
    P("The API returns each ingredient as separate numbered fields (`strIngredient1`, `strIngredient2`...). The mapper reads the JSON as a generic object and collects the non-empty ones into a clean list, so the rest of the app sees a tidy `Recipe`. This is a common job at the edge of an app: shield your code from messy outside data."),
    ...kt('p10', 'MealApi.kt', 'recipes'),
    ...kt('p10', 'FavouriteDao.kt', 'recipes'),
    ...kt('p10', 'AppModule.kt', 'recipes'),
    ...kt('p10', 'RecipeRepository.kt', 'recipes'),
    ...kt('p10', 'RecipeViewModels.kt', 'recipes'),
    ...kt('p10', 'RecipeNav.kt', 'recipes'),
    H("Expected output"),
    P("The app opens on the Search tab with a search box. Search for chicken and a list of recipes with pictures appears. Tap a recipe to see a large picture, the ingredient list with measures and the instructions. Tap the heart to save it. Open the Favourites tab: the recipe is listed and it still opens with no internet, because its details were saved in Room. Tap the heart again to remove it. The bottom bar keeps your search when you switch tabs."),
    N(HONEST),
    ...task("Build the app, search, open a recipe and save it as a favourite.", "Turn on airplane mode and open Favourites. Does it still work?", "Add a Retry button for failed searches.", "Add a filter by category using the API's category list, and show it as chips."),
    ...check("Search works and favourites persist.", "Favourites open offline.", "You can explain what Hilt creates for you and why it helps."),
  ], A('Layers of a real app', [
    n('ui', 'Screens', 'Compose UI', 0, 0, 'app'), n('vm', 'ViewModels', 'Hilt provided', 1, 0, 'tool'),
    n('repo', 'Repository', 'one source of data', 2, 0, 'tool'), n('data', 'Retrofit + Room', 'network and disk', 3, 0, 'store'),
  ], [
    { say: 'Screens show state and send events. They know nothing about data sources.', on: ['ui'] },
    { say: 'Hilt creates each ViewModel and gives it the repository it needs.', flow: ['ui>vm:events'] },
    { say: 'The ViewModel asks the repository, never Retrofit or Room directly.', flow: ['vm>repo:ask'] },
    { say: 'The repository chooses: Retrofit for searches, Room for favourites.', flow: ['repo>data:fetch/save'] },
  ]), [
    faq('Why use Hilt?', 'It builds your objects once and passes them where needed, so classes do not create their own dependencies. This makes code easier to change and to test.'),
    faq('What is a repository?', 'A repository is a class that gives the rest of the app one clear way to get and save data, hiding whether it comes from the network, the database or a cache.'),
    faq('Is dependency injection required?', 'No. For small apps, passing objects by hand works. Hilt pays off as the app grows and many classes share the same things.'),
  ]),

  // 14
  les(S, 'testing-and-performance-for-android-apps', 'Testing and Performance for Android Apps', 'Testing and Performance for Android Apps',
    'Learn Android testing: local unit tests, ViewModel tests with coroutines and Compose UI tests, plus tips to keep your app fast and crash-free.', [
    P("Apps that work on your phone can still fail on other phones. Tests are small programs that check your code for you, every time, in seconds. They let you change code without fear, and teams expect them. Android has two main kinds."),
    H("Two kinds of tests"),
    L("**Local unit tests** live in `src/test` and run on your computer's JVM with no phone. They are fast. Use them for pure functions and ViewModels.", "**Instrumented tests** live in `src/androidTest` and run on a device or emulator. They are slower. Use them for Compose UI and for anything that needs Android itself."),
    P("Add the testing libraries to Gradle first."),
    ...file('gradle/tests.txt', 'Gradle additions for tests', 'text'),
    H("Unit test of a pure function"),
    P("The tip calculation from project 1 has no Android code, so it is easy to test. A good test has a clear name, a setup, an action and a check."),
    ...file('tests/TipMathTest.kt', 'app/src/test/java/com/example/tipcalc/TipMathTest.kt'),
    H("Testing a ViewModel with coroutines"),
    P("ViewModels use `viewModelScope`, which runs on the main dispatcher, and unit tests have no main thread. The fix is a small JUnit rule that swaps the main dispatcher for a test dispatcher, so coroutines run instantly and in order."),
    ...file('tests/MainDispatcherRule.kt', 'app/src/test/java/com/example/todo/MainDispatcherRule.kt'),
    ...file('tests/TodoViewModelTest.kt', 'app/src/test/java/com/example/todo/TodoViewModelTest.kt'),
    H("Testing a Compose screen"),
    P("A Compose test finds elements on the screen by text or tag, performs actions and checks the results. It runs on a device or emulator."),
    ...file('tests/TipScreenTest.kt', 'app/src/androidTest/java/com/example/tipcalc/TipScreenTest.kt'),
    P("Run local tests with the green arrow next to the test class, or with `./gradlew test`. Run instrumented tests with `./gradlew connectedAndroidTest` while an emulator is open. Every test should pass before you ship."),
    N(HONEST),
    H("Performance habits"),
    L("**Never block the main thread.** Network, database and file work belong in coroutines. Room and Retrofit suspend functions are already safe.", "**Use LazyColumn with keys** for long lists, and keep each row cheap.", "**Do not do heavy work inside a composable.** It can run many times. Use `remember` for expensive values and move real work to the ViewModel.", "**Pass stable, small data** to composables. Passing a new list on every pass makes Compose redraw more than needed.", "**Load images at the size you show them.** Coil does this for you.", "**Measure, do not guess.** Android Studio's Profiler shows CPU, memory and network use. Layout Inspector shows how often composables recompose."),
    H("Crash prevention"),
    L("Handle every network and database error with a visible state.", "Use null safety and avoid `!!`.", "Test with airplane mode, rotation, dark mode and a large font setting.", "Use Logcat to read crash traces. The first line that names your own package usually points at the cause.", "Once the app is live, use Android vitals in Play Console, or a crash reporting tool, to find crashes on real devices."),
    ...task("Add and run the three test files in the matching projects.", "Add a test for `parseCents` from project 7.", "Break the tip logic on purpose and watch the test fail, then fix it.", "Open the Profiler while scrolling a long list and look for dropped frames."),
    ...check("`./gradlew test` finishes with all tests passing.", "You can say the difference between a unit test and an instrumented test.", "You can name three habits that keep an app smooth."),
  ], A('The testing pyramid', [
    n('unit', 'Unit tests', 'fast, many', 0, 0, 'check'), n('vm', 'ViewModel tests', 'coroutines', 1, 0, 'check'),
    n('ui', 'UI tests', 'slower, fewer', 2, 0, 'check'), n('ship', 'Release', 'confident', 3, 0, 'out'),
  ], [
    { say: 'Most tests are small unit tests of plain Kotlin functions. They run in milliseconds.', on: ['unit'] },
    { say: 'ViewModel tests check state changes with a test dispatcher.', flow: ['unit>vm:more logic'] },
    { say: 'A few UI tests check that the screens work together on a device.', flow: ['vm>ui:whole screen'] },
    { say: 'When all pass, you can release with more confidence.', flow: ['ui>ship:green'] },
  ]), [
    faq('How many tests should I write?', 'Cover the rules that would hurt if they broke: calculations, money, validation and state changes. Do not chase 100 percent coverage on trivial code.'),
    faq('Why do ViewModel tests need a dispatcher rule?', 'viewModelScope uses the Android main thread, which does not exist in a local test. The rule replaces it with a test dispatcher.'),
    faq('How do I find slow screens?', 'Use the Profiler and Layout Inspector in Android Studio. Look for work on the main thread and composables that recompose too often.'),
  ]),

  // 15
  les(S, 'release-your-android-app-signing-r8-play-store-and-interview-prep', 'Release Your Android App: Signing, Play Store and Interviews', 'Release Android Apps and Interview Prep',
    'Prepare an Android app for release: signing, R8 shrinking, building an AAB, Google Play Console steps and common Android interview questions.', [
    P("An app is only useful when real people can install it. This lesson shows how a project becomes a release on the Google Play Store, then how to talk about your work in interviews. Steps in Play Console change from time to time, so follow the current on-screen instructions if they differ."),
    H("Before you release"),
    L("Choose a unique **application ID**, such as `com.yourname.recipes`. It cannot be changed after publishing.", "Set `versionCode` (an integer that must go up with every upload) and `versionName` (the text users see).", "Replace the default launcher icon with your own.", "Remove test code and logging of private data.", "Test on at least one real phone and one small and one large emulator."),
    H("Signing and shrinking"),
    P("Android requires every app to be signed with a key that proves it comes from you. Keep this key file and its passwords safe and backed up, and never commit them to a public repository. Google Play can manage the final signing key for you (Play App Signing), and you upload with an upload key. A minimised release build uses **R8**, which removes unused code, shortens names and makes the app smaller and faster."),
    ...file('gradle/release.txt', 'app/build.gradle.kts (release settings)', 'text'),
    O("In Android Studio choose **Build > Generate Signed App Bundle or APK**.", "Choose **Android App Bundle (AAB)**. Google Play requires this format for new apps.", "Create a new keystore, or choose an existing one. Fill in the passwords and alias and save the file somewhere safe.", "Choose the **release** build type and finish. Android Studio produces a `.aab` file.", "Install the release build on a phone (for example with `bundletool`, or by uploading to internal testing) and check that nothing broke after shrinking."),
    N("If a release build crashes but the debug build does not, R8 may have removed or renamed something that is used through reflection. Add a keep rule for that class in `proguard-rules.pro`. Libraries such as Retrofit with kotlinx serialization usually ship their own rules."),
    H("Publish on Google Play"),
    O("Create a Google Play developer account. A one-time registration fee applies, and new personal accounts may need to complete testing requirements before a production release. Check the current rules in Play Console.", "Create the app in Play Console and fill in the store listing: name, short and full description, screenshots, and an icon.", "Complete the forms: privacy policy (required if you handle user data), data safety, content rating and target audience.", "Upload the AAB to **Internal testing** first, then to Closed or Open testing, and fix what testers find.", "When ready, create a **Production** release and send it for review. Reviews can take days.", "After release, read reviews and Android vitals, then ship updates with a higher `versionCode`."),
    H("Where to go next"),
    L("**Architecture**: read Google's guide to app architecture, then practise on your own apps.", "**Kotlin Flow and coroutines in depth**: testing, cancellation and error handling.", "**Compose animation and custom layouts.**", "**Modules, CI/CD and Gradle convention plugins** for larger teams.", "**Kotlin Multiplatform**, to share logic with iOS."),
    H("Interview preparation"),
    P("Interviewers want to know that you understand the basics and can explain your choices. Practise answering these aloud, using your own projects as examples."),
    L("What is the difference between `val` and `var`, and a `data class` and a normal class?", "How does Kotlin help avoid null pointer errors?", "What is a composable function, and what is recomposition?", "Explain `remember`, `rememberSaveable` and state hoisting.", "What is a ViewModel, and why does it survive rotation?", "What is a coroutine? What is the difference between `launch` and `async`?", "What is Flow, and how is it different from a List?", "How would you store data on the device? When do you choose DataStore over Room?", "What problem does dependency injection solve?", "How do you handle errors from the network?", "How does the Activity lifecycle affect your app, and how does Compose reduce lifecycle problems?", "How do you test a ViewModel?"),
    P("Build a short portfolio: publish two or three of these apps to GitHub with a clear README, screenshots and the steps to run them. If you can, put one app on the Play Store. Real, working projects with honest descriptions are worth more than a long list of keywords."),
    N(HONEST),
    ...task("Choose your best project and set its application ID, version and icon.", "Build a signed release AAB and install it on a phone.", "Write a README with a screenshot, the features and the libraries used.", "Answer five of the interview questions aloud and write down any that you could not answer."),
    ...check("The release build runs without crashes on a real device.", "The keystore and passwords are stored safely and not in your repository.", "You can describe the path from code to Play Store in order."),
  ], A('From code to the Play Store', [
    n('code', 'Your project', 'tested', 0, 0, 'data'), n('aab', 'Signed AAB', 'R8 shrunk', 1, 0, 'tool'),
    n('play', 'Play Console', 'listing + testing', 2, 0, 'cloud'), n('users', 'Users', 'install the app', 3, 0, 'user'),
  ], [
    { say: 'You finish and test the app, then set the version number and icon.', on: ['code'] },
    { say: 'Android Studio builds a signed, shrunk App Bundle (AAB).', flow: ['code>aab:build'] },
    { say: 'You upload it to Play Console, fill in the listing and run testing tracks.', flow: ['aab>play:upload'] },
    { say: 'After review, people can install the app and you ship updates with a higher version code.', flow: ['play>users:publish'] },
  ]), [
    faq('APK or AAB?', 'Upload an AAB (Android App Bundle) to Google Play. Play then builds the smaller APKs each phone needs. An APK is still useful for installing directly on your own phone.'),
    faq('What if I lose my signing key?', 'With Play App Signing, Google holds the app signing key and you can ask to reset your upload key. Without it, you cannot update the app. Back up your keys safely.'),
    faq('How do I get my first Android job?', 'Publish a few real projects on GitHub, make one polished app, practise the interview questions above, and apply for junior and internship roles while you keep building.'),
  ]),
];
