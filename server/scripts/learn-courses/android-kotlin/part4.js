import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const D1 = 'Kotlin and Android in Depth';
const NOTE = "Snippets in this lesson are short patterns, not full projects. They were not compiled here. Paste them into Android Studio, let it suggest imports, and check the current Android documentation for any API that has changed.";

export const lessons = [
  // 16
  les(D1, 'kotlin-oop-in-depth-classes-interfaces-sealed-generics-and-solid', 'Kotlin OOP in Depth: Classes, Sealed Types, Generics, SOLID', 'Kotlin OOP: Classes, Sealed, Generics',
    'Learn Kotlin OOP in depth: constructors, inheritance, interfaces, enums, sealed classes, objects, generics, delegation, visibility and SOLID.', [
    P("Lesson 3 gave you the basics of classes. Professional Android code uses the full object-oriented toolbox, and interviewers ask about it constantly. This lesson walks through each tool with a small example and says when to use it."),
    H("Classes, constructors and properties"),
    P("A class has a **primary constructor** in its header and may have **secondary constructors**. Writing `val` or `var` in the header makes the parameter a property. `init` blocks run when an object is created. Properties can have custom getters, and a `private set` hides who may change them."),
    C('kotlin', `class User(val name: String, var age: Int = 18) {
    val isAdult: Boolean get() = age >= 18

    init {
        require(name.isNotBlank()) { "name is empty" }
    }

    constructor(name: String, birthYear: Int, now: Int) : this(name, now - birthYear)
}`),
    H("Inheritance, abstraction and polymorphism"),
    P("Kotlin classes are final by default. Mark a class `open` to allow subclasses, and mark members `open` to allow overriding. An **abstract class** cannot be created itself and may hold shared code. An **interface** lists functions (and may give default bodies); a class can implement many interfaces but extend only one class. **Polymorphism** means code that works with the parent type accepts any child. Prefer interfaces for what something *can do*, and inheritance for a true is-a relationship."),
    C('kotlin', `interface Shape { fun area(): Double }

class Circle(private val r: Double) : Shape {
    override fun area() = Math.PI * r * r
}

class Square(private val side: Double) : Shape {
    override fun area() = side * side
}

fun totalArea(shapes: List<Shape>) = shapes.sumOf { it.area() }`),
    H("Enums, sealed classes and objects"),
    P("An **enum class** is a fixed set of named values. A **sealed class or interface** is a closed family of types, and a `when` over it must cover every case or the compiler complains. Android developers use sealed types for UI state and for results. An **object** is a class with exactly one instance (a singleton). A **companion object** holds members that belong to the class itself, like Java statics."),
    C('kotlin', `sealed interface Result<out T> {
    data class Success<T>(val value: T) : Result<T>
    data class Failure(val message: String) : Result<Nothing>
    data object Loading : Result<Nothing>
}

fun show(r: Result<String>) = when (r) {
    is Result.Success -> "OK: " + r.value
    is Result.Failure -> "Error: " + r.message
    Result.Loading -> "Loading"
}`),
    H("Nested classes, generics and delegation"),
    P("A nested class cannot see its outer object. An `inner` class can. **Generics** let one class or function work with many types while staying type-safe: `class Box<T>(val item: T)`. You can restrict the type with `<T : Comparable<T>>`. **Delegation** with `by` lets a class pass interface work to another object, and `by lazy` or `Delegates.observable` delegate a property. Delegation is Kotlin's answer to \"prefer composition over inheritance\"."),
    C('kotlin', `class Logger : Printer by ConsolePrinter()   // forwards Printer calls

val expensive: String by lazy { loadBigThing() }  // computed once, on first use`),
    H("Visibility modifiers"),
    L("`public` (default): visible everywhere.", "`private`: inside the class or file only.", "`protected`: the class and its subclasses.", "`internal`: inside the same module (a Gradle module). Useful in multi-module apps."),
    H("SOLID and common patterns"),
    L("**Single responsibility**: a class has one reason to change. A ViewModel holds screen state; a repository gets data.", "**Open/closed**: add behaviour by adding a new class, not by editing a long `when`.", "**Liskov substitution**: a child must work wherever the parent is expected.", "**Interface segregation**: small interfaces, not one huge one.", "**Dependency inversion**: depend on an interface; let Hilt supply the real class. This is how you swap a fake repository into a test."),
    P("Patterns you will meet: **Singleton** (`object`), **Factory** (a function or companion that builds objects), **Builder** (Kotlin named arguments and `apply` replace most builders), **Observer** (Flow and LiveData) and **Strategy** (pass a lambda or an interface). Do not force a pattern. Use one when it removes real duplication."),
    N(NOTE),
    ...task("Create a sealed interface `PaymentMethod` with Card, Upi and Cash subclasses, and a `when` that returns a fee for each.", "Write an interface `Notifier` with two implementations and a function that takes the interface.", "Make a generic `Stack<T>` class with push, pop and peek.", "Add a `private set` property and show that outside code cannot change it."),
    ...check("The compiler warns when you forget a sealed case.", "You can explain open, abstract, interface and sealed in one sentence each.", "You can name the five SOLID principles with an Android example."),
  ], A('Sealed types force every case', [
    n('state', 'sealed Result', 'Success, Failure, Loading', 0, 0, 'data'), n('when', 'when', 'must cover all', 1, 0, 'check'),
    n('ui', 'Screen code', 'one branch per case', 2, 0, 'app'), n('safe', 'No missed case', 'compiler checks', 3, 0, 'out'),
  ], [
    { say: 'A sealed type lists every possible subtype in one place.', on: ['state'] },
    { say: 'A when expression over it has to handle each one.', flow: ['state>when:value'] },
    { say: 'The screen shows something sensible for every case.', flow: ['when>ui:branches'] },
    { say: 'Add a new case later and the compiler points to every when you must update.', flow: ['ui>safe:compile'] },
  ]), [
    faq('Class, abstract class or interface?', 'Use an interface to describe what something can do. Use an abstract class when subclasses share real code or state. Use a plain class when no subclassing is planned.'),
    faq('Why are Kotlin classes final by default?', 'Inheritance makes code fragile, so Kotlin makes you choose it on purpose with open. Composition and interfaces are usually safer.'),
    faq('What is the difference between object and companion object?', 'An object is a standalone singleton. A companion object belongs inside a class and holds members you call on the class name.'),
  ]),

  // 17
  les(D1, 'advanced-kotlin-scope-functions-extensions-coroutines-and-flow', 'Advanced Kotlin: Scope Functions, Coroutines and Flow', 'Advanced Kotlin: Coroutines and Flow',
    'Learn scope functions, extension and inline functions, then coroutines in depth: scopes, dispatchers, cancellation, async, Flow and StateFlow.', [
    P("Most Android bugs in real apps come from threading and state, so this lesson matters. It covers the Kotlin features that make code short, then the whole coroutine toolkit with the rules that keep it safe."),
    H("Extension, inline and scope functions"),
    P("An **extension function** adds a function to an existing type without changing it: `fun String.isEmail() = contains(\"@\")`. A **higher-order function** takes or returns a function. `inline` copies the function body and lambda into the call site, which avoids creating objects. The five **scope functions** run a block on an object and differ in how you refer to it and what they return."),
    L("`let`: object is `it`, returns the block result. Used for null checks: `name?.let { save(it) }`.", "`run`: object is `this`, returns the block result.", "`with(obj) { ... }`: like run, but obj is passed in.", "`apply`: object is `this`, returns the object. Used for setting up: `Intent().apply { action = \"x\" }`.", "`also`: object is `it`, returns the object. Used for side effects such as logging."),
    H("Coroutines: the model"),
    P("A coroutine is a light task that can suspend (pause) without blocking a thread. A `suspend` function can only be called from a coroutine or another suspend function. Every coroutine lives in a **CoroutineScope**. In Android you rarely create scopes: `viewModelScope` ends when the ViewModel is cleared, and `lifecycleScope` ends with the lifecycle. This is **structured concurrency**: children cannot outlive the parent, so work is cancelled with its screen and does not leak."),
    C('kotlin', `class DetailViewModel(private val repo: Repo) : ViewModel() {
    fun load(id: Int) {
        viewModelScope.launch {
            val user = repo.user(id)          // suspend, runs off the main thread inside
            val posts = repo.posts(id)
            // update state here
        }
    }
}`),
    H("Dispatchers, async and cancellation"),
    L("`Dispatchers.Main`: UI work.", "`Dispatchers.IO`: disk and network.", "`Dispatchers.Default`: heavy calculation.", "Use `withContext(Dispatchers.IO) { ... }` inside a suspend function to switch thread and come back."),
    P("`launch` starts a job and returns it. `async` starts work that returns a value and you collect it with `await()`. Use async to run independent calls in parallel."),
    C('kotlin', `suspend fun loadScreen(): Screen = coroutineScope {
    val user = async { api.user() }
    val feed = async { api.feed() }
    Screen(user.await(), feed.await())     // both calls run at the same time
}`),
    P("Cancelling a job sets a flag. Suspending functions in the standard libraries check it, but a long loop of your own must call `ensureActive()` or `yield()`. Never swallow `CancellationException` in a catch block. For errors, use `try/catch` inside the coroutine. An exception in a `launch` child cancels its parent; `supervisorScope` or `SupervisorJob` keeps siblings alive."),
    H("Flow, StateFlow and SharedFlow"),
    P("A **Flow** is a stream of values over time: `flow { emit(1); emit(2) }`. It is *cold*: it starts when someone collects it. Operators such as `map`, `filter`, `debounce`, `distinctUntilChanged`, `combine` and `flatMapLatest` transform it. **StateFlow** is a *hot* flow that always holds one current value, the right tool for UI state. **SharedFlow** has no current value and sends events to all collectors, but one-off events are often better modelled as state. A **Channel** passes values between coroutines, one receiver per value."),
    C('kotlin', `val query = MutableStateFlow("")

val results: StateFlow<List<Item>> = query
    .debounce(300)
    .distinctUntilChanged()
    .flatMapLatest { text -> repo.search(text) }
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())`),
    P("`stateIn` turns a cold flow into StateFlow. `WhileSubscribed(5000)` keeps it running for five seconds after the last collector goes away, which survives a rotation and stops work in the background. In Compose, read it with `collectAsStateWithLifecycle()`."),
    H("Thread safety"),
    L("Share data between coroutines through immutable objects, StateFlow or a Mutex.", "Avoid mutable shared variables across threads. If you must, use `Mutex` or atomic types.", "Never call blocking code (`Thread.sleep`, blocking network) on the main dispatcher."),
    N(NOTE),
    ...task("Write an extension function `fun Int.toRupees(): String` and use it.", "Use `async` to run two delay calls in parallel and measure that the total is about the longer one.", "Build a search flow with debounce and flatMapLatest against a fake repository.", "Cancel a long loop of your own with `ensureActive()`."),
    ...check("You can explain why `viewModelScope` prevents leaks.", "You can choose the right dispatcher for a network call and for a sort.", "You know when to use StateFlow and when SharedFlow."),
  ], A('Structured concurrency', [
    n('vm', 'ViewModel', 'viewModelScope', 0, 0, 'app'), n('co', 'Coroutines', 'launch / async', 1, 0, 'tool'),
    n('flow', 'StateFlow', 'current UI state', 2, 0, 'store'), n('ui', 'Screen', 'collects safely', 3, 0, 'out'),
  ], [
    { say: 'The ViewModel starts work in its own scope.', on: ['vm'] },
    { say: 'Coroutines run the calls without blocking the main thread.', flow: ['vm>co:launch'] },
    { say: 'Results go into a StateFlow that always holds the latest value.', flow: ['co>flow:update'] },
    { say: 'The screen collects it with the lifecycle. If the ViewModel is cleared, the work is cancelled.', flow: ['flow>ui:collect'] },
  ]), [
    faq('launch or async?', 'Use launch for work that returns nothing. Use async when you need a value back, especially to run several calls in parallel.'),
    faq('LiveData or Flow?', 'New code uses Flow and StateFlow. LiveData still appears in older apps and works with the XML UI, and it is easy to convert with asLiveData and asFlow.'),
    faq('What is structured concurrency?', 'Coroutines are tied to a scope, so a parent waits for its children and cancelling the parent cancels them all. Work cannot be forgotten and leak.'),
  ]),

  // 18
  les(D1, 'android-fundamentals-activities-fragments-services-intents-and-permissions', 'Android Fundamentals: Activities, Services, Intents, Permissions', 'Android Fundamentals and Intents',
    'Understand Android basics: components, Activity and Fragment lifecycles, services, intents, permissions and configuration changes.', [
    P("Compose hides much of Android, but every app still sits on the same foundation. You need it to debug lifecycle problems, handle links and notifications, and pass interviews."),
    H("The four app components"),
    L("**Activity**: one screen with a window. Modern apps often have a single Activity that hosts all Compose screens.", "**Service**: work that runs without a screen. A *foreground service* shows a notification and is used for music, navigation or uploads.", "**BroadcastReceiver**: reacts to system or app messages, such as boot completed or battery low.", "**ContentProvider**: shares structured data between apps, as the Contacts and Media stores do."),
    P("All components are declared in **AndroidManifest.xml**, together with permissions, the app icon and name, and `intent-filter`s that say which links or actions a component can handle."),
    H("The Activity lifecycle"),
    P("Android creates, pauses and destroys your Activity as the user moves around. The main callbacks are `onCreate` (set up, call `setContent`), `onStart` (becoming visible), `onResume` (in the foreground and interactive), `onPause` (losing focus), `onStop` (not visible) and `onDestroy`. Put start/stop work, such as listening for location, in the matching pair of callbacks, or better, use lifecycle-aware tools like `collectAsStateWithLifecycle`, which do it for you."),
    P("A **configuration change**, such as rotation, dark mode or a language switch, recreates the Activity by default. That is why state must live in a ViewModel or in `rememberSaveable`. The system can also kill your whole **process** while the app is in the background to free memory. Data that must survive that goes in `SavedStateHandle`, a database or DataStore."),
    H("Fragments"),
    P("A Fragment is a reusable piece of UI with its own lifecycle that lives inside an Activity. Older apps use many Fragments with the Navigation Component. Its view has a separate lifecycle (`onCreateView` to `onDestroyView`), which is a common source of leaks: never keep a reference to the binding after the view is destroyed. In new Compose apps you rarely write Fragments, but you may maintain them."),
    H("Intents"),
    P("An **Intent** is a message that asks the system to do something. An *explicit* intent names the target class. An *implicit* intent describes an action and lets Android pick an app."),
    C('kotlin', `// explicit: open another Activity of your own app
startActivity(Intent(this, DetailActivity::class.java).putExtra("id", 42))

// implicit: open a web page in whichever browser the user has
startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com")))

// share text
val send = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Look at this app")
}
startActivity(Intent.createChooser(send, "Share with"))`),
    P("An `intent-filter` in the manifest lets your app receive such intents or open from a link (**deep link**). Since Android 12, any component with an intent filter must declare `android:exported`."),
    H("Permissions"),
    P("*Normal* permissions (such as INTERNET) are granted at install. *Dangerous* permissions (camera, location, notifications, contacts) must be requested at run time, and the user can refuse. Use the Activity Result API, which Compose wraps as `rememberLauncherForActivityResult`."),
    C('kotlin', `val launcher = rememberLauncherForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted -> if (granted) startCamera() else showExplanation() }

Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) { Text("Scan") }`),
    H("Context and resources"),
    P("A `Context` gives access to resources, files and system services. The **application context** lives as long as the app. An **Activity context** lives as long as the screen and carries its theme. Never store an Activity context in a long-lived object, because the Activity then cannot be freed: that is a memory leak. Resources live in `res/`: `strings.xml` for text (so you can translate it), `drawable` for images, `values` for colours and dimensions, and qualifiers such as `values-hi` or `values-night` give alternatives for languages and dark mode."),
    H("Navigation and the back stack"),
    P("Each Activity or navigation destination is pushed on a **back stack**. The Back button pops it. The `launchMode` and navigation options such as `popUpTo` change this. Android 14 and later support predictive back, so avoid intercepting Back unless you must."),
    N(NOTE),
    ...task("Add log lines to every Activity lifecycle callback and watch the order when you open the app, press Home, rotate and return.", "Share text from your app with an implicit intent.", "Request the camera permission and handle both answers.", "Add a deep link to one screen in the manifest and open it with `adb shell am start -a android.intent.action.VIEW -d \"myapp://item/1\"`."),
    ...check("You can describe what happens to your state on rotation.", "You know which permissions are asked at run time.", "You can explain explicit and implicit intents."),
  ], A('Activity lifecycle', [
    n('create', 'onCreate', 'set up the screen', 0, 0, 'app'), n('start', 'onStart / onResume', 'visible, interactive', 1, 0, 'app'),
    n('pause', 'onPause / onStop', 'leaving the screen', 2, 0, 'tool'), n('destroy', 'onDestroy', 'screen is gone', 3, 0, 'out'),
  ], [
    { say: 'onCreate runs once when the Activity is built. You call setContent here.', on: ['create'] },
    { say: 'The user sees the screen and can interact with it.', flow: ['create>start:visible'] },
    { say: 'When the user leaves, onPause and onStop run. Release things you no longer need.', flow: ['start>pause:leave'] },
    { say: 'onDestroy follows if the screen is finished, or if rotation recreates it. Keep state in a ViewModel.', flow: ['pause>destroy:finish'] },
  ]), [
    faq('Why does my state reset when I rotate the phone?', 'Rotation recreates the Activity. Keep state in a ViewModel, rememberSaveable or SavedStateHandle, which survive that.'),
    faq('Do I still need Fragments?', 'Not for new Compose apps, which use one Activity and Navigation Compose. You will meet Fragments in older code bases.'),
    faq('Foreground or background service?', 'A foreground service shows a notification and is allowed to keep running, for music or tracking. Background work is restricted by Android, so use WorkManager for deferred tasks.'),
  ]),
];
