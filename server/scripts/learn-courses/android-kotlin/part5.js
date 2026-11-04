import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const D = 'Architecture, Data and Networking';
const NOTE = "Snippets in this lesson are short patterns, not full projects. They were not compiled here. Paste them into Android Studio, let it suggest imports, and check the current documentation for any API that has changed.";

export const lessons = [
  // 19
  les(D, 'jetpack-compose-in-depth-layouts-theming-side-effects-and-animation', 'Jetpack Compose in Depth: Layouts, Theming and Effects', 'Compose in Depth: Theming and Effects',
    'Go beyond Compose basics: Scaffold, drawer, dialogs, grids, theming, side effects, derivedStateOf, animation and accessibility.', [
    P("You built screens in the projects. This lesson fills the gaps you need for polished, real apps: app structure, material components, theming, side effects, animation and accessibility."),
    H("App structure with Scaffold"),
    P("`Scaffold` gives a standard Material 3 page with slots for a top bar, bottom bar, floating action button and snackbar host. Your content receives `innerPadding`, which you must apply so it is not hidden behind bars."),
    C('kotlin', `Scaffold(
    topBar = { TopAppBar(title = { Text("Home") }) },
    bottomBar = {
        NavigationBar {
            NavigationBarItem(selected = true, onClick = { }, icon = { Icon(Icons.Default.Home, null) }, label = { Text("Home") })
            NavigationBarItem(selected = false, onClick = { }, icon = { Icon(Icons.Default.Search, null) }, label = { Text("Search") })
        }
    },
    floatingActionButton = { FloatingActionButton(onClick = { }) { Icon(Icons.Default.Add, "Add") } },
    snackbarHost = { SnackbarHost(snackbarHostState) }
) { innerPadding ->
    Content(Modifier.padding(innerPadding))
}`),
    P("For a **navigation drawer**, wrap the screen in `ModalNavigationDrawer` and open it with `drawerState.open()` inside a coroutine. Show a **snackbar** with `snackbarHostState.showSnackbar(\"Saved\")` from a coroutine. An **AlertDialog** is just a composable you include when a flag is true."),
    H("Lists and grids"),
    L("`LazyColumn` and `LazyRow` for vertical and horizontal lists.", "`LazyVerticalGrid(columns = GridCells.Fixed(2))` or `GridCells.Adaptive(150.dp)` for grids.", "`items(list, key = { it.id })` and `stickyHeader` for section headers.", "`rememberLazyListState()` to read or control the scroll position."),
    H("Theming"),
    P("`MaterialTheme` carries a **colour scheme**, **typography** and **shapes**. You define light and dark colour schemes (or use dynamic colour on Android 12 and later) and read values with `MaterialTheme.colorScheme.primary`. Never hard-code colours in screens: change the theme once and the whole app follows."),
    H("Side effects"),
    P("A composable can run many times, so work with outside effects must go in special blocks."),
    L("`LaunchedEffect(key)`: run a suspend block when the composable enters and when the key changes. Used to load data or collect events.", "`DisposableEffect(key)`: register something and clean it up in `onDispose`, such as a lifecycle observer or a sensor listener.", "`rememberCoroutineScope()`: a scope for launching work from a click handler.", "`SideEffect`: publish Compose state to non-Compose code after each successful composition.", "`derivedStateOf { ... }`: a value calculated from other state that only changes when the result changes, for example `showButton = listState.firstVisibleItemIndex > 0`."),
    C('kotlin', `val listState = rememberLazyListState()
val showUp by remember { derivedStateOf { listState.firstVisibleItemIndex > 3 } }

LaunchedEffect(userId) {            // runs again only when userId changes
    viewModel.load(userId)
}`),
    H("Animation"),
    P("`AnimatedVisibility` fades or slides a composable in and out. `animateColorAsState`, `animateDpAsState` and `animateFloatAsState` move a value smoothly to a new target. `AnimatedContent` animates between two versions of content. `Crossfade` blends screens. For custom drawing use `Canvas`. Keep animations short, and respect the user's reduced-motion setting."),
    C('kotlin', `val size by animateDpAsState(if (expanded) 200.dp else 80.dp, label = "size")
AnimatedVisibility(visible = showDetails) { DetailsCard() }`),
    H("Performance and recomposition"),
    L("Give list items stable keys.", "Pass small stable values or immutable data classes into composables.", "Read state as late as possible (inside the lambda that needs it).", "Use the Layout Inspector's recomposition counts to find screens that redraw too often."),
    H("Responsive layouts and accessibility"),
    P("Use `WindowSizeClass` to choose a layout for phones, foldables and tablets, and `Modifier.weight` and `fillMaxWidth` instead of fixed sizes. For accessibility, give every icon a `contentDescription` (or `null` if it is decorative), keep touch targets at least 48 dp, make sure text contrast is high, support large font sizes, and group related items with `Modifier.semantics`. Test with TalkBack."),
    N(NOTE),
    ...task("Wrap one of your projects in a Scaffold with a top bar and a snackbar that confirms a save.", "Add a scroll-to-top button using derivedStateOf.", "Switch your app to dark theme and fix any hard-coded colours.", "Turn on TalkBack and complete one task in your app."),
    ...check("Content is not hidden behind bars.", "Dark mode looks right everywhere.", "You can explain when to use LaunchedEffect and DisposableEffect."),
  ], A('Effects live outside recomposition', [
    n('comp', 'Composable', 'may run many times', 0, 0, 'app'), n('eff', 'LaunchedEffect', 'runs when key changes', 1, 0, 'tool'),
    n('work', 'Side work', 'load, listen, register', 2, 0, 'check'), n('clean', 'onDispose', 'clean up', 3, 0, 'out'),
  ], [
    { say: 'A composable can run again and again as state changes. Do not do outside work directly in it.', on: ['comp'] },
    { say: 'Put it in an effect block with a key.', flow: ['comp>eff:key'] },
    { say: 'The effect runs on entering and again only when the key changes.', flow: ['eff>work:run'] },
    { say: 'When the composable leaves the screen, cleanup code runs.', flow: ['work>clean:dispose'] },
  ]), [
    faq('Why must I use innerPadding in Scaffold?', 'The bars cover the top and bottom of the screen. innerPadding tells your content how much space they take so nothing hides under them.'),
    faq('When do I use derivedStateOf?', 'When a value is calculated from fast-changing state but only matters when its result changes, like a boolean from a scroll position. It avoids needless recomposition.'),
    faq('How do I make Compose apps accessible?', 'Describe icons, use big enough touch targets, support large fonts and good contrast, and test with TalkBack.'),
  ]),

  // 20
  les(D, 'traditional-android-ui-xml-layouts-recyclerview-and-viewbinding', 'Traditional Android UI: XML Layouts, RecyclerView, ViewBinding', 'XML Layouts, RecyclerView and ViewBinding',
    'Learn the XML view system still used in many jobs: ConstraintLayout, RecyclerView adapters, ViewBinding, styles and custom views.', [
    P("Most Android code in production today still uses XML layouts, and many jobs ask for it. You do not need to love it, but you should be able to read and fix it. This lesson shows the key pieces and how they map to Compose ideas you already know."),
    H("Layouts"),
    L("**LinearLayout**: children in one row or column (like Row and Column).", "**FrameLayout**: children stacked (like Box).", "**ConstraintLayout**: each view is positioned by constraints to its parent or to other views. It is the standard for complex screens and keeps the layout flat.", "**ScrollView**: scrolls a single child.", "**RelativeLayout**: an old layout that ConstraintLayout replaced."),
    C('xml', `<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent" android:layout_height="match_parent">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content" android:layout_height="wrap_content"
        android:text="@string/app_name"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <Button
        android:id="@+id/save"
        android:layout_width="0dp" android:layout_height="wrap_content"
        android:text="Save"
        app:layout_constraintTop_toBottomOf="@id/title"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>`),
    P("Common views: `TextView`, `EditText`, `ImageView`, `Button`, `CheckBox`, `RadioButton`, `Switch`, `ProgressBar`, `Spinner` (a dropdown) and `CardView`/`MaterialCardView`. Use `dp` for sizes and `sp` for text."),
    H("ViewBinding"),
    P("Do not call `findViewById`. Turn on **ViewBinding** in Gradle (`buildFeatures { viewBinding = true }`) and Android generates a class for each layout with a typed property for every view that has an id. DataBinding goes further and lets the XML bind to data, but is used less in new work."),
    C('kotlin', `class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.save.setOnClickListener { binding.title.text = "Saved" }
    }
}`),
    H("RecyclerView, adapters and ViewHolders"),
    P("`RecyclerView` shows long lists by reusing a small number of row views. An **adapter** creates a **ViewHolder** for each row type and fills it with data. Use `ListAdapter` with a `DiffUtil.ItemCallback`: you submit a new list and it works out the changes and animates them."),
    C('kotlin', `class NoteAdapter : ListAdapter<Note, NoteAdapter.Holder>(Diff) {
    class Holder(val b: ItemNoteBinding) : RecyclerView.ViewHolder(b.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
        Holder(ItemNoteBinding.inflate(LayoutInflater.from(parent.context), parent, false))

    override fun onBindViewHolder(holder: Holder, position: Int) {
        holder.b.title.text = getItem(position).title
    }

    object Diff : DiffUtil.ItemCallback<Note>() {
        override fun areItemsTheSame(a: Note, b: Note) = a.id == b.id
        override fun areContentsTheSame(a: Note, b: Note) = a == b
    }
}

// in the Activity or Fragment
binding.list.layoutManager = LinearLayoutManager(this)
binding.list.adapter = adapter
adapter.submitList(notes)`),
    H("Themes, styles, fonts and custom views"),
    P("A **theme** (in `themes.xml`) sets colours and shapes for the whole app. A **style** groups attributes for one kind of view. Put fonts in `res/font`, and vector icons in `res/drawable`. A **custom view** extends `View` (or a layout) and overrides `onDraw` or composes other views. Compose can sit inside XML with `ComposeView`, and XML inside Compose with `AndroidView`, so you can migrate one screen at a time."),
    P("The migration path matters in real jobs. Teams rarely rewrite everything. They add Compose to new screens, keep stable XML screens, and share the same theme colours and fonts through design tokens so both look alike."),
    H("Compose or XML?"),
    L("New apps: Compose.", "Existing apps: keep working XML screens, write new ones in Compose, and migrate when a screen needs big changes.", "Learn XML well enough to read, debug and extend it. That is what most maintenance jobs need."),
    N(NOTE),
    ...task("Recreate the notes list from project 5 using RecyclerView, ListAdapter and ViewBinding.", "Build a login screen in ConstraintLayout that works at both rotations.", "Add a theme colour and use it from a style.", "Show a Compose button inside an XML screen with ComposeView."),
    ...check("You never call findViewById.", "The list updates smoothly when you submit a new list.", "You can explain what a ViewHolder is."),
  ], A('RecyclerView reuses rows', [
    n('data', 'List of notes', 'submitList()', 0, 0, 'data'), n('diff', 'DiffUtil', 'finds changes', 1, 0, 'check'),
    n('ad', 'Adapter', 'binds ViewHolders', 2, 0, 'tool'), n('rv', 'RecyclerView', 'reuses row views', 3, 0, 'out'),
  ], [
    { say: 'You give the adapter a new list.', on: ['data'] },
    { say: 'DiffUtil compares it with the old list to find what changed.', flow: ['data>diff:old vs new'] },
    { say: 'The adapter binds data into recycled ViewHolders for the visible rows.', flow: ['diff>ad:changes'] },
    { say: 'RecyclerView animates the change and keeps scrolling smooth.', flow: ['ad>rv:rows'] },
  ]), [
    faq('Why use ViewBinding instead of findViewById?', 'It is type-safe and null-safe. A wrong id is a compile error, not a crash.'),
    faq('Why is it called RecyclerView?', 'When a row scrolls off the screen its view is recycled for a new row instead of creating a new one, which saves memory and time.'),
    faq('Can I mix Compose and XML?', 'Yes. ComposeView embeds Compose in XML, and AndroidView embeds a view in Compose.'),
  ]),

  // 21
  les(D, 'android-architecture-mvvm-mvi-clean-architecture-and-modularization', 'Android Architecture: MVVM, MVI, Clean Architecture, Modules', 'Android Architecture: MVVM, MVI and Clean',
    'Compare MVC, MVP, MVVM and MVI, then learn Clean Architecture layers, repositories, use cases, Hilt and multi-module apps.', [
    P("Architecture is how you split an app so it stays understandable as it grows. Good architecture lets several developers work together, makes code testable and lets you change a library without rewriting everything. This lesson explains the common patterns and what Google recommends today."),
    H("From MVC to MVVM"),
    L("**MVC**: the Activity acts as both controller and view and grows huge. Avoid it.", "**MVP**: a Presenter holds logic and talks to the view through an interface. Testable, but needs a lot of boilerplate.", "**MVVM**: a ViewModel exposes state; the view observes it and sends events. The standard for Android, and a natural fit for Compose and Flow.", "**MVI**: like MVVM, but with one immutable state object per screen and one stream of intents (user actions) that go through a reducer. It makes state changes explicit and easy to log and test."),
    H("Unidirectional data flow"),
    P("In UDF, **state flows down** and **events flow up**. The UI renders one `UiState` and reports clicks as events. The ViewModel handles the event, updates the state and the UI redraws. You built every project this way."),
    C('kotlin', `data class CartUiState(val items: List<Item> = emptyList(), val loading: Boolean = false, val error: String? = null)

sealed interface CartEvent {
    data class Add(val item: Item) : CartEvent
    data class Remove(val id: Int) : CartEvent
    data object Refresh : CartEvent
}

class CartViewModel(private val repo: CartRepository) : ViewModel() {
    private val _state = MutableStateFlow(CartUiState())
    val state: StateFlow<CartUiState> = _state.asStateFlow()

    fun onEvent(e: CartEvent) {
        when (e) {
            is CartEvent.Add -> viewModelScope.launch { repo.add(e.item) }
            is CartEvent.Remove -> viewModelScope.launch { repo.remove(e.id) }
            CartEvent.Refresh -> refresh()
        }
    }
    private fun refresh() { /* set loading, call repo, update state */ }
}`),
    H("Clean Architecture layers"),
    L("**Presentation** (UI layer): composables and ViewModels. Knows nothing about Retrofit or Room.", "**Domain**: plain Kotlin models, repository interfaces and **use cases** (one class per business action, like `PlaceOrder`). It depends on nothing else. The domain layer is optional in small apps and useful when logic is shared by several screens.", "**Data**: repository implementations, remote data sources (Retrofit), local data sources (Room, DataStore) and mappers between network models, database entities and domain models."),
    P("The rule is that dependencies point inward: presentation depends on domain, and data depends on domain. A repository *interface* lives in domain; its implementation lives in data. This is **dependency inversion**, and it is why you can swap a fake repository into a test."),
    C('kotlin', `// domain
interface OrderRepository { suspend fun place(cart: List<Item>): Result<OrderId> }

class PlaceOrder(private val repo: OrderRepository) {
    suspend operator fun invoke(cart: List<Item>): Result<OrderId> {
        if (cart.isEmpty()) return Result.failure(IllegalArgumentException("empty cart"))
        return repo.place(cart)
    }
}`),
    H("The repository pattern and offline-first"),
    P("A repository is the single place that decides where data comes from. In an **offline-first** app the database is the *source of truth*: the UI reads only from Room, and the repository refreshes Room from the network in the background. The app then works with no connection and never shows two conflicting copies."),
    H("Dependency injection with Hilt"),
    P("Annotate the Application with `@HiltAndroidApp`, Activities with `@AndroidEntryPoint` and ViewModels with `@HiltViewModel` plus `@Inject constructor`. A Hilt `@Module` with `@Provides` or `@Binds` tells Hilt how to build objects such as Retrofit or a repository. Use `@Singleton` for objects that should be shared, and qualifiers (`@Named`) when you need two of the same type. Hilt also supports **multi-environment config**: provide a different base URL per build flavor."),
    H("Modularization"),
    P("A multi-module app splits code into Gradle modules: `:app`, `:core:network`, `:core:database`, `:core:ui`, `:feature:cart`, `:feature:profile`. Benefits are faster builds (only changed modules rebuild), enforced boundaries (use `internal`) and clear ownership. Features depend on core modules, never on each other; navigation between features goes through a shared interface or routes. Start with one module and split when the app or team grows."),
    H("Choosing"),
    L("Small app or learning: MVVM with UDF, repository, no domain layer.", "Medium app: add use cases and a clear data layer.", "Large team: modularize, and use convention plugins and a version catalog for shared Gradle settings."),
    N(NOTE),
    ...task("Refactor one of your projects to have UiState and a sealed event class.", "Add a repository interface and a fake implementation, and use the fake in a ViewModel test.", "Write one use case with a business rule and test it.", "Draw your app's layers and arrows on paper and check that none point the wrong way."),
    ...check("The UI holds no business logic.", "You can swap the repository for a fake in a test.", "You can explain unidirectional data flow."),
  ], A('Layers point inward', [
    n('ui', 'Presentation', 'Compose + ViewModel', 0, 0, 'app'), n('dom', 'Domain', 'use cases, interfaces', 1, 0, 'check'),
    n('data', 'Data', 'repository impl', 2, 0, 'tool'), n('src', 'Sources', 'Retrofit, Room', 3, 0, 'store'),
  ], [
    { say: 'The UI layer shows state and sends events. It knows nothing about data sources.', on: ['ui'] },
    { say: 'It calls use cases and interfaces in the domain layer.', flow: ['ui>dom:calls'] },
    { say: 'The data layer implements those interfaces.', flow: ['dom>data:implemented by'] },
    { say: 'Repositories choose between the network and the database.', flow: ['data>src:fetch / save'] },
  ]), [
    faq('MVVM or MVI?', 'Both are fine. MVI is MVVM with stricter rules: one state object and a single event stream. Start with MVVM and move to MVI if you want stricter state handling.'),
    faq('Do I need a domain layer?', 'Not in small apps. Add it when business rules are reused or complex, so they are not buried in ViewModels.'),
    faq('When should I split into modules?', 'When build times get slow, several people work on different features, or you want clear boundaries. Not on day one.'),
  ]),

  // 22
  les(D, 'jetpack-libraries-room-relations-paging-camerax-and-offline-first', 'Jetpack Libraries: Room Relations, Paging, Navigation and Offline-First', 'Jetpack: Room Relations, Paging, Offline',
    'Use more Jetpack: Room relations and migrations, Paging 3, Navigation deep links, SplashScreen, CameraX and offline-first caching.', [
    P("Jetpack is the set of Google libraries that solve common app problems. You already used ViewModel, Room, DataStore, WorkManager and Navigation. This lesson adds the rest of the ones you will meet at work."),
    H("Room relationships"),
    P("**One-to-many**: a user has many orders. Put a `userId` foreign key in the orders table, and read both with an `@Relation` class."),
    C('kotlin', `@Entity data class User(@PrimaryKey val id: Int, val name: String)
@Entity(foreignKeys = [ForeignKey(User::class, ["id"], ["userId"], onDelete = ForeignKey.CASCADE)])
data class Order(@PrimaryKey(autoGenerate = true) val id: Int = 0, val userId: Int, val total: Long)

data class UserWithOrders(
    @Embedded val user: User,
    @Relation(parentColumn = "id", entityColumn = "userId") val orders: List<Order>
)

@Dao interface UserDao {
    @Transaction
    @Query("SELECT * FROM User WHERE id = :id")
    fun userWithOrders(id: Int): Flow<UserWithOrders>
}`),
    P("**One-to-one** is the same with a single object instead of a list. **Many-to-many** needs a *join table* (for example `StudentCourse`) and `@Relation(associateBy = Junction(StudentCourse::class))`. `@Transaction` makes sure several reads or writes happen together, or not at all. Mark `foreignKeys` with `CASCADE` so deleting a parent removes its children."),
    H("Migrations"),
    C('kotlin', `val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE Note ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0")
    }
}
Room.databaseBuilder(context, AppDatabase::class.java, "app.db").addMigrations(MIGRATION_1_2).build()`),
    P("Turn on `exportSchema` and keep the exported JSON in git so you can write migration tests. Never use `fallbackToDestructiveMigration` in a released app unless losing user data is acceptable."),
    H("Proto DataStore and database encryption"),
    P("**Preferences DataStore** stores key-value pairs. **Proto DataStore** stores a typed object defined by a schema, which prevents key typos. Room itself is not encrypted. For sensitive data, either encrypt the fields you store or use an encrypted SQLite build such as SQLCipher, and think hard about whether you need to store the data at all."),
    H("Paging 3"),
    P("Paging loads a long list in pages as the user scrolls. A `PagingSource` loads one page (from the network or Room), a `Pager` turns it into a `Flow<PagingData<T>>`, and Compose shows it with `collectAsLazyPagingItems()`."),
    C('kotlin', `val posts: Flow<PagingData<Post>> = Pager(PagingConfig(pageSize = 20)) { PostSource(api) }
    .flow.cachedIn(viewModelScope)

@Composable fun PostList(vm: PostViewModel) {
    val items = vm.posts.collectAsLazyPagingItems()
    LazyColumn {
        items(items.itemCount) { index -> items[index]?.let { PostRow(it) } }
    }
}`),
    H("Navigation: arguments, deep links, nested graphs"),
    L("Pass an id, not an object: route `detail/{id}` with `navArgument(\"id\") { type = NavType.IntType }`.", "Add `deepLinks = listOf(navDeepLink { uriPattern = \"myapp://item/{id}\" })` to a destination, and an intent filter in the manifest.", "Group screens with `navigation(startDestination = \"login\", route = \"auth\") { ... }` (nested graph) so you can leave the whole group at once.", "For bottom navigation, save and restore state with `launchSingleTop = true; restoreState = true` and `popUpTo(startDestination) { saveState = true }`."),
    H("SplashScreen, App Startup, Activity Result and CameraX"),
    L("**SplashScreen API**: `installSplashScreen()` before `super.onCreate` shows a consistent launch screen on all Android versions.", "**App Startup**: initialises libraries in a defined order from one place, so many libraries do not each slow startup.", "**Activity Result APIs**: `rememberLauncherForActivityResult` for permissions, picking photos (`PickVisualMedia`) and documents.", "**SavedStateHandle**: ViewModel access to navigation arguments and values that survive process death.", "**CameraX**: a simple camera API with use cases for preview, image capture and analysis (used in the QR project)."),
    H("Offline-first caching"),
    P("The recipe: the UI observes Room; a `refresh()` function fetches from the network and writes into Room; errors only show a message because old data is still visible. Add a `lastUpdated` time to decide when to refresh. Use WorkManager to sync in the background with a network constraint."),
    N(NOTE),
    ...task("Add a one-to-many relation (category and expenses) to project 7.", "Add a migration that adds a column and write a note about how you would test it.", "Use Paging 3 to show 1,000 fake items in a LazyColumn.", "Add a deep link to a detail screen and open it from adb."),
    ...check("Relations load with one query.", "A migration keeps old data.", "You can describe the offline-first flow."),
  ], A('Offline-first', [
    n('ui', 'Screen', 'observes Room', 0, 0, 'app'), n('db', 'Room', 'source of truth', 1, 0, 'store'),
    n('repo', 'Repository', 'refresh()', 2, 0, 'tool'), n('net', 'Network', 'latest data', 3, 0, 'cloud'),
  ], [
    { say: 'The screen only reads from the local database, so it works with no connection.', flow: ['db>ui:Flow'] },
    { say: 'The repository refreshes in the background.', on: ['repo'] },
    { say: 'New data comes from the network.', flow: ['net>repo:response'] },
    { say: 'The repository writes it to Room, and the screen updates by itself.', flow: ['repo>db:save'] },
  ]), [
    faq('Why use a join table?', 'A many-to-many relation cannot be stored in one column, so a third table holds pairs of ids, one row for each link.'),
    faq('Why Paging 3?', 'It loads only what the user is about to see, caches pages and handles loading and error states, so big lists do not use much memory or data.'),
    faq('What does offline-first mean?', 'The local database is the source of truth. The network only refreshes it, so the app works without a connection.'),
  ]),
];
