import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';
import { kt, file, sample } from './files.js';

const S1 = 'Getting Started';
const S2 = 'Kotlin Basics';
const S3 = 'Compose and State';

const HONEST = "The code in this course was syntax-checked with a Kotlin parser. It was not compiled or run on a device while the course was written, so type it in, build it in Android Studio and fix any small differences your tool versions show. Library versions move quickly: when Android Studio suggests a newer version of a library, accept it and read the release notes if something stops compiling.";

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-android-development-and-your-first-app', 'Android Development with Kotlin: Setup and Your First App', 'Android with Kotlin: Setup and First App',
    'Install Android Studio, learn the project structure and Gradle, and run your first Kotlin and Jetpack Compose app on an emulator or phone.', [
    P("Android is the operating system on most of the phones in the world. An Android developer builds the apps on those phones: banking, delivery, maps, learning, health, games. Companies hire Android developers to build and maintain these apps, and small teams and freelancers build their own products too. The good news for a learner is that you can start on almost any computer. Android Studio runs on Windows, macOS and Linux, and every tool you need is free."),
    P("Modern Android work uses three main ideas, and you will meet all of them in this course. **Kotlin** is the programming language Google recommends for Android. It is short, readable and safe. **Jetpack Compose** is the modern toolkit for building screens: you write functions that describe the screen, and Android draws it. **Android Studio** is the program where you write, build and test the app. Older apps use Java and XML layout files, and you will still see them at work, but new apps are written in Kotlin with Compose, so that is what we teach."),
    H("What you will build in this course"),
    P("This is a hands-on course. After two lessons that teach the Kotlin language, you build ten complete applications, each one a little harder than the last, and each one teaches one group of skills that real teams use."),
    L("**Tip calculator**: screens, state and input.", "**To-do list**: lists, ViewModel and state hoisting.", "**Unit converter**: forms, menus and validation.", "**Quiz app**: several screens with navigation.", "**Notes app**: a database on the phone with Room.", "**Weather app**: loading data from the internet with Retrofit and coroutines.", "**Expense tracker**: money, Flow and totals from a database.", "**Posts reader**: images, search, pull to refresh and a detail screen.", "**Habit tracker**: saved settings with DataStore and a daily reminder with WorkManager.", "**Recipe book**: a capstone with Hilt, Retrofit, Room and bottom navigation."),
    P("The last two lessons cover testing and releasing an app to the Google Play Store. Everything is in plain English, and every project lists its files, its steps and what you should see on screen."),
    N(HONEST),
    H("Install Android Studio"),
    O("Go to the official Android developer website, search for Android Studio and download the version for your system. It is free.", "Run the installer and accept the standard setup. It downloads the Android SDK, the tools that build apps, and may take a while.", "Open Android Studio. On first start it offers to install more components. Let it finish.", "Check that your computer has enough free disk space and memory. Emulators are heavy, and a computer with 8 GB of memory is the practical minimum. If yours is slow, you can run your app on a real Android phone instead (the next section shows how)."),
    H("Create your first project"),
    O("Choose **New Project** and pick the **Empty Activity** template. This template uses Kotlin and Jetpack Compose.", "Name it `Hello`. Keep the package name suggested, such as `com.example.hello`. The package name is the unique ID of your app.", "Choose a Minimum SDK. API 26 or higher is a sensible choice today, because it covers nearly all active phones while giving you modern features. Android Studio shows the percentage of devices each choice covers.", "Click Finish and wait. The first **Gradle sync** downloads libraries and can take several minutes. The bottom bar shows progress."),
    P("Gradle is the build tool. It reads the build files, downloads the libraries you ask for and turns your code into an installable app file called an APK or an AAB. You will edit one file often: `app/build.gradle.kts`, where you add libraries in a block called `dependencies`."),
    H("The project structure"),
    P("Android Studio shows many folders. These are the ones that matter now."),
    C('text', `Hello/
  app/
    build.gradle.kts            libraries and app settings (you edit this)
    src/main/
      AndroidManifest.xml       the app's ID card: name, icon, screens, permissions
      java/com/example/hello/
        MainActivity.kt         the first screen that opens
        ui/theme/               colours, fonts and the app theme
      res/                      images, icons, strings
  build.gradle.kts              settings shared by all modules
  gradle/libs.versions.toml     one list of library versions`),
    P("Open `MainActivity.kt`. It contains code like the one below. Names may differ slightly between Android Studio versions, and that is fine."),
    C('kotlin', `class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Greeting("Android")
            }
        }
    }
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}`),
    P("An **Activity** is one screen of the app, and `onCreate` runs when it opens. `setContent` says: draw this with Compose. `Greeting` is a **composable function**, marked with `@Composable`. It does not return anything. It describes a piece of screen, here one line of text. That single idea, small functions that describe the screen, is the whole of Compose."),
    H("Run it"),
    O("Open **Device Manager** in Android Studio and create a virtual device, for example a recent Pixel phone. Download the system image when asked.", "Choose the device at the top of the window and press the green **Run** button.", "The emulator starts, which can take a minute the first time. Then your app opens and shows the greeting."),
    P("To use a real phone instead, open Settings, tap the build number seven times to unlock Developer options, turn on USB debugging, connect the phone with a cable and allow the computer. The phone then appears in the device list."),
    P("Now make a change. Edit the text to say `Hello, my first app!` and run again. Add a second `Text` line below the first one. If both appear on the same line or overlap, that is a first lesson in layout: you will fix it in lesson 4 with a `Column`. This loop of change, run, look is how you will learn the rest of the course."),
    ...task("Install Android Studio and create a project from the Empty Activity template named Hello.", "Run it on an emulator or a real phone and see the greeting.", "Change the greeting text to your own name and run it again.", "Open `AndroidManifest.xml` and find the app name and the line that marks `MainActivity` as the screen that opens first."),
    ...check("The emulator or phone shows your changed text.", "Gradle finishes the sync with no red errors.", "You can say in one sentence what an Activity, a composable and Gradle are."),
  ], A('From code to screen', [
    n('code', 'Kotlin code', 'MainActivity.kt', 0, 0, 'data'), n('gradle', 'Gradle build', 'compiles the app', 1, 0, 'tool'),
    n('apk', 'APK file', 'the installable app', 2, 0, 'store'), n('phone', 'Phone or emulator', 'the app runs', 3, 0, 'out'),
  ], [
    { say: 'You write Kotlin code and Compose functions in files such as MainActivity.kt.', on: ['code'] },
    { say: 'Gradle compiles the code and bundles it with images and settings.', flow: ['code>gradle:build'] },
    { say: 'The result is an APK file, an installable Android app.', flow: ['gradle>apk:package'] },
    { say: 'Android Studio installs it on the emulator or your phone and starts it.', flow: ['apk>phone:install'] },
  ]), [
    faq('Do I need a powerful computer?', 'A computer with 8 GB of memory works, but emulators can be slow. If yours struggles, plug in a real Android phone with USB debugging turned on and run your apps there.'),
    faq('Should I learn Java or Kotlin for Android?', 'Kotlin. Google recommends it for new Android work, and most new tutorials and apps use it. You may meet Java in older code at work, and it is easy to read once you know Kotlin.'),
    faq('Is Jetpack Compose better than XML layouts?', 'For new apps, yes: it needs less code and updates the screen from your data. Many existing apps still use XML views, so learn Compose first and the old views later when a job needs them.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S2, 'kotlin-basics-variables-types-functions-and-control-flow', 'Kotlin Basics: Variables, Types, Functions and Control Flow', 'Kotlin Basics: Variables and Functions',
    'Learn core Kotlin: val and var, types, string templates, if and when, loops, and functions with default and named arguments, with runnable samples.', [
    P("Before you build screens, you need to read and write Kotlin comfortably. This lesson covers the parts of the language you will use in every app. Each example is a tiny program with a `main` function. To run them without making a whole Android project, open the free Kotlin Playground on the official Kotlin website, paste the code and press Run. You can also create a new Kotlin file in Android Studio and run its `main` function."),
    H("Values and variables"),
    P("Kotlin has two keywords for storing data. `val` makes a value that cannot be reassigned after it is set. `var` makes a variable that can change. Prefer `val`: code is easier to reason about when most things never change. Kotlin works out the type from the value (this is called type inference), so you rarely write the type, but you can."),
    sample('Variables.kt'),
    P("The `$name` and `${goal - steps}` parts are **string templates**: Kotlin puts the value into the text. Use `$name` for a simple name and `${ ... }` for any expression. Expected output:"),
    C('text', `Asha walked 5000 steps
That is 50% of the goal
Steps left: 5000`),
    P("Common types are `Int` (whole numbers), `Double` (numbers with decimals), `Boolean` (true or false), `String` (text) and `Char` (one character). Kotlin does not change types silently. You cannot add an `Int` to a `Double` without a conversion such as `toDouble()`. That strictness stops a whole group of bugs."),
    H("Decisions and loops"),
    P("`if` works as you expect, and in Kotlin it is also an **expression**, which means it gives back a value. `when` is like a more readable chain of `if` and `else if`. Loops use `for` with a range such as `1..3`, and `while`."),
    sample('Control.kt'),
    C('text', `Round 1
Round 2
Round 3
3 2 1 Go!
82 is a pass, grade B`),
    H("Functions"),
    P("A function is a named piece of code that you can call many times. It lists its inputs (parameters) and its output type after a colon. A function whose body is a single expression can be written with `=`. You can give parameters **default values** and call them with **named arguments**, which makes calls easy to read. `vararg` lets a function take any number of values."),
    sample('Functions.kt'),
    C('text', `Hello, Ravi!
Welcome, Ravi!
80.0
0.0`),
    N("Compose uses these two features all the time. A call such as `Text(text = \"Hi\", fontSize = 20.sp)` is a function with named arguments, and most of its parameters have defaults."),
    H("Why this matters for Android"),
    P("Every Android screen you build uses these basics. State is stored in `val` and `var`. Buttons run functions. Lists of data are looped over. A `when` decides which screen part to show. If a later lesson feels hard, the cause is nearly always a gap here, so come back and rerun these samples."),
    ...task("Run all three samples in the Kotlin Playground and compare each output with the lesson.", "Change `Variables.kt` so the goal is 8,000 steps and the person walked 6,500. Check that the percent and steps left are right.", "Write a function `isEven(n: Int): Boolean` and use it inside a `for` loop that prints the even numbers from 1 to 10.", "Add a `when` to `Control.kt` that prints a different message for a score of exactly 100."),
    ...check("Your outputs match the expected text for each sample.", "You can say the difference between `val` and `var`.", "You can explain what a string template is and write one."),
  ], A('val, var and functions', [
    n('val', 'val and var', 'set once or change', 0, 0, 'data'), n('var', 'Variables', 'hold the data', 1, 0, 'tool'),
    n('fn', 'Function', 'takes input', 2, 0, 'app'), n('out', 'Result', 'printed or shown', 3, 0, 'out'),
  ], [
    { say: 'val stores a value that never changes. Prefer it.', on: ['val'] },
    { say: 'var stores a value you are allowed to change later.', on: ['var'] },
    { say: 'A function takes values in and works on them.', flow: ['var>fn:input'] },
    { say: 'It gives back a result, which your program prints or shows on screen.', flow: ['fn>out:return'] },
  ]), [
    faq('Why does Kotlin prefer val over var?', 'A value that never changes cannot be changed by mistake somewhere else in the program. That makes bugs easier to find. Use var only when the value really has to change.'),
    faq('Do I need to write types everywhere?', 'No. Kotlin works out the type from the value. You write a type when it is not obvious, for function parameters (always) and for public APIs.'),
    faq('Where can I run Kotlin without Android Studio?', 'The Kotlin Playground on the official Kotlin website runs small programs in your browser. Android Studio can also run a `main` function from any Kotlin file.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S2, 'kotlin-classes-collections-null-safety-and-lambdas', 'Kotlin Classes, Collections, Null Safety and Lambdas', 'Kotlin Classes, Collections and Null Safety',
    'Learn data classes, interfaces, list helpers like filter and map, null safety with ?. and ?:, and lambdas: the Kotlin skills every Android app uses.', [
    P("This lesson covers the second half of the Kotlin you need. It is the part that makes Kotlin feel different from older languages: classes that take one line, collections you can transform with short code, and a type system that prevents the most common crash in programming, the null pointer error."),
    H("Classes and data classes"),
    P("A class describes a kind of thing: a user, a product, a note. A **data class** is a class whose main job is to hold data. Kotlin writes `toString`, `equals` and a `copy` function for you. In Android you will write dozens of data classes: one for each row in a database and each item in a list. Regular classes can **inherit** from another class (mark the parent `open`) and **implement interfaces**, which are lists of functions a class promises to have."),
    sample('Classes.kt'),
    C('text', `Product(name=Pen, price=1.5, stock=20)
Product(name=Pen, price=1.2, stock=20)
Meera has 150.0 (interest rate 4.0%)
13.0`),
    P("Notice `private set` on `balance`. Anyone can read the balance, but only the class can change it, so the rule \"a deposit must be positive\" cannot be bypassed. Hiding what outsiders should not touch is the heart of good class design, and you will use it again in ViewModels."),
    H("Collections"),
    P("Lists, sets and maps hold groups of values. `listOf` makes a list that cannot change, and `mutableListOf` makes one that can. The real power is in the helper functions: `filter` keeps some items, `map` turns every item into something else, `sortedBy` orders them, `groupBy` sorts them into buckets, and `sumOf` or `average` fold them into one number. Each takes a **lambda**, a small block of code in braces. Inside the lambda `it` means the current item."),
    sample('Collections.kt'),
    C('text', `[Asha, Chen, Dev]
Chen
71.25
[Chen, Asha, Dev, Ben]
{pass=3, fail=1}
[a, b, c]`),
    H("Null safety"),
    P("In many languages any value may secretly be null, and using it crashes the app. In Kotlin a normal type such as `String` can never be null. A type that can be null is written with a question mark, `String?`, and the compiler forces you to deal with it. The safe-call operator `?.` stops quietly when the value is null, and the Elvis operator `?:` supplies a default. `let` runs a block only when the value is not null. Avoid `!!`, which means \"crash if this is null\"."),
    sample('NullSafety.kt'),
    C('text', `null
0
3
Nickname is kit
not a number`),
    H("Lambdas and functions as values"),
    P("A function can be passed around like any other value. A function that takes another function is called a higher-order function. When the last parameter is a function you may write the lambda after the brackets, which is called a trailing lambda. Compose depends on this: `Button(onClick = { ... }) { Text(\"Go\") }` passes one lambda for the click and a trailing lambda for the content."),
    sample('Lambdas.kt'),
    C('text', `Run number 1
Run number 2
Run number 3
42
[Kotlin, Android, Compose]
kotlin | android | compose`),
    N("These outputs were worked out by hand from the code. Run each sample in the Kotlin Playground to confirm them, and tell us if any line differs."),
    ...task("Create a `data class Book(val title: String, val pages: Int)` and a list of four books.", "Print the titles of books with more than 200 pages, using `filter` and `map`.", "Print the average page count and the title of the longest book. Use `?.` so the code is safe if the list is empty.", "Write a function `describe(text: String?): String` that returns \"empty\" when the text is null or blank and the text in capitals otherwise."),
    ...check("Your list code prints the right titles and average.", "You can explain what `String?` means and why `!!` is risky.", "You can name three list helpers and say what each does."),
  ], A('A list through helpers', [
    n('list', 'List of students', 'listOf(...)', 0, 0, 'data'), n('filter', 'filter', 'keep marks >= 50', 1, 0, 'check'),
    n('map', 'map', 'take the names', 2, 0, 'tool'), n('names', 'New list', 'Asha, Chen, Dev', 3, 0, 'out'),
  ], [
    { say: 'You start with a list of Student objects.', on: ['list'] },
    { say: 'filter keeps only the students whose marks are 50 or more.', flow: ['list>filter:lambda'] },
    { say: 'map changes each remaining student into just their name.', flow: ['filter>map:lambda'] },
    { say: 'The result is a brand new list. The original list is unchanged.', flow: ['map>names:result'] },
  ]), [
    faq('What is the difference between a class and a data class?', 'A data class is a class meant to hold data. Kotlin generates toString, equals, hashCode and copy for it. Use it for things like rows and list items.'),
    faq('Why is null safety such a big deal?', 'Null pointer errors are one of the most common crashes in apps. Kotlin makes nullability part of the type, so the compiler warns you before the app ever runs.'),
    faq('What does `it` mean in a lambda?', 'When a lambda has exactly one input, Kotlin names it `it` automatically. You can write your own name instead, such as `student ->`, when that reads better.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S3, 'jetpack-compose-basics-state-and-project-1-tip-calculator', 'Jetpack Compose Basics and Project 1: Tip Calculator', 'Compose Basics and Tip Calculator',
    'Learn composable functions, Column, Row, modifiers, state and recomposition, then build a complete tip calculator app with a slider, a switch and a bill split.', [
    P("You now know enough Kotlin to build screens. In **Jetpack Compose** a screen is a function that describes what should be visible for the current data. When the data changes, Compose runs the function again and updates only what changed. This idea has a name, **recomposition**, and it replaces the old way of finding views and changing them by hand."),
    H("The pieces of a Compose screen"),
    L("**Composable functions** are marked `@Composable`. They can call other composables.", "**Layouts** place things: `Column` stacks vertically, `Row` lines up horizontally, `Box` stacks on top of each other, and `LazyColumn` shows long lists efficiently.", "**Widgets** are things the user sees and uses: `Text`, `Button`, `OutlinedTextField`, `Slider`, `Switch`, `Card`, `Checkbox`.", "**Modifiers** change how a composable looks and behaves: `Modifier.padding(16.dp).fillMaxWidth()`. The order matters, because each modifier wraps the result of the one before it.", "**Material 3** gives you ready-made, good-looking widgets and a theme with colours and text styles."),
    H("State: the most important idea"),
    P("State is data that can change and that the screen depends on, such as the text in a box or whether a switch is on. In Compose you keep state in a `MutableState` and read its value in the function. When the value changes, Compose reads it again and redraws. You make state with `remember { mutableStateOf(...) }`. The `remember` part keeps the value between redraws. Without it the value would reset to its start every time the function ran."),
    C('kotlin', `@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clicked $count times")
    }
}`),
    P("Each tap raises `count`. Compose notices the change, runs `Counter` again, and the button shows the new text. The `by` keyword lets you use `count` like a normal variable. Use `mutableIntStateOf`, `mutableFloatStateOf` and `mutableStateOf` depending on the type."),
    H("Project 1: Tip Calculator"),
    P("The user types a bill, chooses a tip with a slider, picks how many people share it and sees the totals. It teaches state, text input with a number keyboard, a slider, a switch and a card. All the arithmetic lives in a plain Kotlin function, which keeps it separate from the screen and, in lesson 14, easy to test."),
    H("Create the project and structure"),
    O("Create a new Empty Activity project called `TipCalc` with package `com.example.tipcalc`.", "Add three files next to `MainActivity.kt`: `TipMath.kt` and `TipScreen.kt`. Replace the contents of `MainActivity.kt` as shown below.", "No extra libraries are needed for this project."),
    C('text', `TipCalc/app/src/main/java/com/example/tipcalc/
  MainActivity.kt    starts the app and shows TipScreen
  TipScreen.kt       the screen: input, slider, switch, results
  TipMath.kt         the calculation, with no Android code in it`),
    H("The code"),
    ...kt('p1', 'MainActivity.kt', 'tipcalc'),
    P("`enableEdgeToEdge()` lets the app draw behind the system bars, and `systemBarsPadding()` later keeps text out from under them. `Surface` gives a background colour from the theme."),
    ...kt('p1', 'TipMath.kt', 'tipcalc'),
    P("`require` checks the input and throws a clear error if it is wrong. Because this function is plain Kotlin you can run it with no phone at all."),
    ...kt('p1', 'TipScreen.kt', 'tipcalc'),
    H("How it works"),
    L("Four pieces of state live at the top of `TipScreen`: the bill text, tip percent, number of people and the round-up switch.", "The bill is kept as text, because the user types it. `toDoubleOrNull()` turns it into a number, or null if the box is empty or not a number, and `?: 0.0` makes that zero.", "The result is recalculated on every recomposition. That is cheap here, and it means the totals can never be out of date.", "`Modifier.weight(1f)` makes the label take all spare width so the buttons sit on the right."),
    H("Expected output"),
    P("The screen shows the title, a bill box, a slider at 15%, a people row set to 1, a round-up switch and a card. Type 100 as the bill: the card shows Tip 15.00, Total 115.00 and Each person pays 115.00. Press + twice for three people: each person pays 38.33. Turn on rounding with a bill of 33 and 15%: the tip changes from 4.95 to 5.00."),
    N(HONEST),
    ...task("Build the project, run it and check the examples above.", "Add a row of three buttons (10%, 15%, 20%) that set the tip percent in one tap.", "Show the tip percent in a different colour when it is above 25%.", "Keep the bill when you rotate the phone: change `remember` to `rememberSaveable` and test the rotation."),
    ...check("Typing 100 gives a total of 115.00 at 15%.", "The numbers update as you move the slider, with no button to press.", "You can explain what `remember` and recomposition do in your own words."),
  ], A('State drives the screen', [
    n('user', 'User input', 'types, slides, taps', 0, 0, 'user'), n('state', 'State', 'bill, tip, people', 1, 0, 'store'),
    n('compose', 'Composable', 'TipScreen runs again', 2, 0, 'app'), n('ui', 'Screen', 'new totals shown', 3, 0, 'out'),
  ], [
    { say: 'The user types a bill or moves the slider.', on: ['user'] },
    { say: 'The event changes a value in state.', flow: ['user>state:new value'] },
    { say: 'Compose sees the change and runs the composable function again.', flow: ['state>compose:recompose'] },
    { say: 'The function describes the new screen and Compose draws only what changed.', flow: ['compose>ui:draw'] },
  ]), [
    faq('What is recomposition?', 'Recomposition is Compose running a composable function again because some state it reads has changed. It updates only the parts of the screen that are affected.'),
    faq('Why do I need remember?', 'Without remember the value would reset every time the function runs again. remember keeps it for as long as the composable stays on screen.'),
    faq('What is the difference between remember and rememberSaveable?', 'remember loses its value when the phone rotates or the process is recreated. rememberSaveable also saves the value, so it survives those changes. Use it for things the user typed.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S3, 'project-2-todo-list-viewmodel-lazycolumn-and-state-hoisting', 'Project 2: To-Do List with ViewModel and LazyColumn', 'Project 2: To-Do List with ViewModel',
    'Build a to-do list app in Compose and learn ViewModel, StateFlow, LazyColumn with keys, state hoisting and unidirectional data flow with complete, working code.', [
    P("In the tip calculator, all the state lived inside one composable. That is fine for a small screen, but real apps have rules and data that must survive screen rotation and be shared between screens. The standard answer in Android is the **ViewModel**. A ViewModel is a class that holds the state of a screen and the logic that changes it. It lives longer than the composable, so it survives rotation. This project builds a to-do list and teaches the pattern you will use in every remaining project."),
    H("Concepts in this project"),
    L("**ViewModel**: holds screen state and logic, and survives rotation.", "**StateFlow**: a stream that always holds a current value. The ViewModel changes it and the screen watches it.", "**collectAsStateWithLifecycle**: turns a StateFlow into Compose state, and stops collecting when the app is in the background.", "**State hoisting**: a composable does not own its data. It receives the value and the events (lambdas) from above. This makes small composables simple and reusable.", "**Unidirectional data flow**: events go up, state comes down. The UI asks the ViewModel to change something, the ViewModel updates the state, and the UI redraws from the new state.", "**LazyColumn**: shows only the rows that are visible, so a list of thousands stays fast. Give each item a stable `key` so Compose can move and animate rows correctly."),
    H("Create the project"),
    O("Create an Empty Activity project named `Todo`, package `com.example.todo`.", "Open `app/build.gradle.kts` and add these lines to `dependencies`, then press Sync Now.", "Add the four Kotlin files shown below."),
    ...file('gradle/p1-p4.txt', 'app/build.gradle.kts (dependencies)', 'text'),
    C('text', `Todo/app/src/main/java/com/example/todo/
  MainActivity.kt     shows TodoScreen
  Task.kt             the data: id, title, done
  TodoViewModel.kt    the list and the rules (add, toggle, remove)
  TodoScreen.kt       the UI that shows the list and sends events`),
    H("The code"),
    ...kt('p2', 'Task.kt', 'todo'),
    ...kt('p2', 'TodoViewModel.kt', 'todo'),
    P("Read `TodoViewModel` carefully. `_tasks` is private and mutable: only the ViewModel can change it. `tasks` is the public, read-only view of it. Each function builds a new list with `update` instead of changing the old list. Because the list is never edited in place, Compose can tell that something changed. This \"copy, do not mutate\" habit prevents many bugs."),
    ...kt('p2', 'TodoScreen.kt', 'todo'),
    P("`TodoScreen` collects the state and passes small pieces down. `TaskRow` knows nothing about the ViewModel: it gets one `Task` and two lambdas, `onToggle` and `onDelete`. That is state hoisting. A composable like this is easy to preview and test."),
    ...kt('p2', 'MainActivity.kt', 'todo'),
    H("Expected output"),
    P("The first screen shows the title To-Do, a text box with a plus button, the line \"0 left, 0 done\" and the message \"Nothing to do. Add your first task above.\" Add Buy milk and Call Dad: both appear and the line reads \"2 left, 0 done\". Tick Buy milk: its text gets a line through it and the line reads \"1 left, 1 done\". Rotate the phone: the list stays, because the ViewModel survived. Press Clear finished tasks and only Call Dad remains."),
    N("This list lives in memory only. If you close the app completely, the tasks are gone. You will fix that in project 5 with a real database."),
    ...task("Build and run the app, and check the example above.", "Show a line at the bottom that says \"All done, well done!\" when every task is ticked and the list is not empty.", "Add an `edit` function to the ViewModel and let the user tap a title to change it.", "Write down one bug that would happen if `TaskRow` changed the list itself instead of calling `onToggle`."),
    ...check("Tasks survive rotation.", "Ticking, deleting and clearing all work, with the counter updating.", "You can explain why the screen calls the ViewModel instead of editing the list."),
  ], A('Events up, state down', [
    n('ui', 'TodoScreen', 'shows the list', 0, 0, 'app'), n('vm', 'TodoViewModel', 'rules and logic', 1, 0, 'tool'),
    n('flow', 'StateFlow', 'current list', 2, 0, 'store'), n('row', 'LazyColumn', 'draws the rows', 3, 0, 'out'),
  ], [
    { say: 'The user taps add or a checkbox. The screen sends that event up to the ViewModel.', flow: ['ui>vm:event'] },
    { say: 'The ViewModel builds a new list and stores it in the StateFlow.', flow: ['vm>flow:new list'] },
    { say: 'The screen collects the flow, so it receives the new list.', flow: ['flow>row:state'] },
    { say: 'LazyColumn draws the rows from the new list, using each task id as the key.', on: ['row'] },
  ]), [
    faq('Why use a ViewModel instead of remember?', 'A ViewModel survives screen rotation and holds logic that does not belong in UI code. remember is fine for small, temporary UI state such as the text in a box.'),
    faq('What is state hoisting?', 'It means moving state up out of a composable and passing it in as a value plus lambdas for events. The composable becomes simpler, easier to reuse and easier to test.'),
    faq('Why must LazyColumn items have a key?', 'The key tells Compose which row is which when the list changes. Without it, Compose may redraw or move the wrong rows and lose state such as a checkbox animation.'),
  ]),
];
