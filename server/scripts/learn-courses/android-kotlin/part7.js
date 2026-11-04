import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const D = 'Production Android';
const NOTE = "Snippets in this lesson are short patterns, not full projects. They were not compiled here. Check the current documentation of each library and service, because versions, names and prices change. Services that need accounts or keys must be set up with your own project.";

export const lessons = [
  // 27
  les(D, 'ai-and-machine-learning-in-android-gemini-ml-kit-and-tensorflow-lite', 'AI and Machine Learning in Android: Gemini, ML Kit, TFLite', 'AI in Android: Gemini, ML Kit, TFLite',
    'Add AI to Android apps: call a model safely through a server, stream replies, use ML Kit and TensorFlow Lite, and use AI responsibly.', [
    P("AI features are now common in apps: chatbots, smart replies, text recognition and recommendations. There are two ways to add them. A **cloud model** (Gemini, OpenAI and others) runs on a server and is very capable. An **on-device model** (ML Kit, TensorFlow Lite) runs on the phone, works offline, is fast and keeps data private, but is smaller. Pick based on what the feature needs."),
    H("Generative AI: how to call a model safely"),
    P("A generative AI API takes a prompt (and a conversation history) and returns text. Calls cost money and need an API key, so the **key must never be in the app**. Anyone can extract it from the APK and run up your bill. The safe design is: the app calls **your own server**, which holds the key, checks the user, limits usage and calls the model. Firebase offers an AI service that avoids shipping a key and supports App Check; check its current documentation. For learning, you can put a key in `local.properties` and read it through `BuildConfig`, but remember that this is for testing only and the key is still extractable."),
    C('kotlin', `// the app talks to YOUR server, which talks to the model
interface ChatApi {
    @POST("chat")
    suspend fun send(@Body body: ChatRequest): ChatReply
}

@Serializable data class ChatMessage(val role: String, val text: String)   // "user" or "model"
@Serializable data class ChatRequest(val messages: List<ChatMessage>)
@Serializable data class ChatReply(val text: String)`),
    H("Streaming responses and history"),
    P("Models can send the answer in pieces, so the user sees words appear as they are generated. On Android you expose this as a Flow: each emitted chunk is appended to the last message. Keep the **conversation history** as a list of messages and send the recent ones with each request, because the model has no memory between calls. Store it in Room if users should see old chats."),
    C('kotlin', `fun reply(history: List<ChatMessage>): Flow<String> = flow {
    var text = ""
    api.stream(ChatRequest(history)).collect { chunk ->     // your server streams chunks
        text += chunk
        emit(text)                                         // UI shows the growing text
    }
}.flowOn(Dispatchers.IO)`),
    H("ML Kit on device"),
    L("**Text recognition (OCR)**: read printed text from an image.", "**Barcode and QR scanning**: used in project 17 with CameraX.", "**Face detection**: find faces and landmarks (not identification).", "**Language identification and translation**: detect a language and translate offline after a model download.", "**Smart reply, image labelling, object detection and entity extraction** are also available."),
    C('kotlin', `val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
val image = InputImage.fromBitmap(bitmap, 0)
recognizer.process(image)
    .addOnSuccessListener { result -> show(result.text) }
    .addOnFailureListener { e -> showError(e) }`),
    H("TensorFlow Lite and recommendations"),
    P("**TensorFlow Lite** (now also called LiteRT) runs your own trained model on the phone, for example an image classifier. You add the `.tflite` file to `assets`, resize the input to what the model expects, run it and read the scores. Train the model in Python and convert it. For **recommendations** you can start simple: show items similar to what the user viewed, or popular in the same category, and move to a server-side model when you have data. For **AI-powered search**, send a query to a server that uses embeddings, and show the ranked results."),
    H("Responsible AI"),
    L("Tell users when they are talking to an AI, and that answers may be wrong.", "Do not send private data to a model unless the user agreed and your privacy policy says so.", "Never let the model make a final decision about money or safety without a human check.", "Filter and limit input, protect the key on a server, rate-limit each user and watch costs.", "Test for unwanted outputs and give users a way to report a bad answer."),
    N(NOTE),
    ...task("Make a chat screen with a list of messages and a fake streaming repository that emits words slowly.", "Use ML Kit text recognition on a photo of a printed page.", "Write the server contract (request and response) your app expects, without the key.", "Write a short in-app notice that explains the AI feature and its limits."),
    ...check("The key is not in the app or in the repository.", "Text grows on screen as chunks arrive.", "You can explain cloud versus on-device AI."),
  ], A('Keep the key on a server', [
    n('app', 'Android app', 'chat screen', 0, 0, 'app'), n('srv', 'Your server', 'holds the API key', 1, 0, 'tool'),
    n('model', 'AI model', 'Gemini or other', 2, 0, 'cloud'), n('out', 'Streamed text', 'grows on screen', 3, 0, 'out'),
  ], [
    { say: 'The app sends the conversation to your own server, not to the model.', flow: ['app>srv:messages'] },
    { say: 'The server checks the user, limits usage and adds the secret key.', on: ['srv'] },
    { say: 'It calls the model and streams the reply back.', flow: ['srv>model:prompt'] },
    { say: 'The app appends each chunk, so the user sees the answer being written.', flow: ['model>out:chunks'] },
  ]), [
    faq('Can I put an AI API key in my app?', 'Not safely. Anyone can extract it and spend your money. Use a server, or a service built to avoid shipping keys, such as Firebase\'s AI features with App Check, and check its current documentation.'),
    faq('Cloud AI or on-device AI?', 'Cloud models are more capable and need a connection and a server. On-device models work offline and keep data on the phone but are smaller and limited to specific tasks.'),
    faq('How does the model remember the chat?', 'It does not. You send the earlier messages again with each request.'),
  ]),

  // 28
  les(D, 'testing-debugging-and-performance-in-depth-for-android', 'Testing, Debugging and Performance in Depth', 'Android Testing and Performance in Depth',
    'Go deeper on testing and speed: MockK, fakes, Compose and Espresso tests, LeakCanary, ANRs, Baseline Profiles and app size.', [
    P("Lesson 14 gave you the basics. This lesson covers what teams use every day: good test doubles, UI tests, debugging tools and the performance work that makes an app feel fast."),
    H("Unit tests with fakes and MockK"),
    P("A test should check one behaviour. To isolate a class, replace its dependencies with **test doubles**. A *fake* is a simple working version (an in-memory repository). A *mock* records calls and returns answers you set. **MockK** is the Kotlin library for mocks, and **Mockito** is the Java-based alternative. Prefer fakes for repositories, and mocks for things that are hard to fake."),
    C('kotlin', `class FakeRepo : OrderRepository {
    var placed = mutableListOf<List<Item>>()
    override suspend fun place(cart: List<Item>): Result<OrderId> {
        placed.add(cart); return Result.success(OrderId("A1"))
    }
}

@Test fun emptyCartIsRejected() = runTest {
    val useCase = PlaceOrder(FakeRepo())
    assertTrue(useCase(emptyList()).isFailure)
}

@Test fun callsRepoOnce() = runTest {
    val repo = mockk<OrderRepository>()
    coEvery { repo.place(any()) } returns Result.success(OrderId("A1"))
    PlaceOrder(repo)(listOf(item))
    coVerify(exactly = 1) { repo.place(any()) }
}`),
    P("`runTest` from kotlinx-coroutines-test runs suspend code and skips delays. Test Flows with the Turbine library (`flow.test { awaitItem() }`)."),
    H("UI tests"),
    L("**Compose UI tests**: `createComposeRule()`, `onNodeWithText(\"Save\").performClick()`, `assertIsDisplayed()`. Add `Modifier.testTag(\"list\")` where text is not enough.", "**Espresso** tests XML views: `onView(withId(R.id.save)).perform(click())`. It still matters for older apps.", "**Integration tests** check several parts together, for example a ViewModel with a real in-memory Room database (`Room.inMemoryDatabaseBuilder`).", "**End-to-end tests** run a full user flow on a device or emulator. They are slow, so keep a few for the key paths such as login and purchase.", "**Test-driven development**: write a failing test, make it pass, then tidy. It suits business rules such as price calculations."),
    H("Debugging"),
    L("**Logcat**: filter by package and level; use `Log.d(TAG, message)`. Read crash stack traces from the bottom of the \"Caused by\" chain up to the first line from your package.", "**Breakpoints and the debugger**: step through code and inspect values; use conditional breakpoints in loops.", "**Layout Inspector**: shows the UI tree and, in Compose, how often each composable recomposes.", "**Network Inspector**: see requests and responses.", "**App Inspection** also shows the database and background tasks."),
    H("Memory, ANRs and profiling"),
    P("A **memory leak** happens when something holds a reference to an object that should be freed, such as a static field pointing to an Activity. **LeakCanary** (a debug dependency) detects leaks and prints the chain. An **ANR** (Application Not Responding) appears when the main thread is blocked for too long, usually by disk or network work on the main thread; read the trace in Play Console or `/data/anr` and move the work to a background coroutine. The **Android Profiler** shows CPU, memory, network and energy over time."),
    H("Faster startup and smoother UI"),
    L("**Startup**: do the minimum in `Application.onCreate`, initialise libraries lazily or with App Startup, and use the SplashScreen API.", "**Baseline Profiles**: a file that tells Android which code to pre-compile, which can improve startup and first scrolls noticeably. Generate it with the Macrobenchmark library.", "**Macrobenchmark** measures startup and scrolling of the whole app. **Microbenchmark** measures one function.", "**UI**: stable keys, avoid unnecessary recomposition, avoid nested scrolling lists, and load images at display size.", "**Battery and network**: batch requests, use caching, avoid wake locks, and prefer WorkManager.", "**Size**: enable R8 and resource shrinking, use AAB, compress images (WebP), and remove unused libraries. Check the APK Analyzer."),
    N(NOTE),
    ...task("Write a fake repository and test a use case with it.", "Write one Compose UI test that types in a field and presses a button.", "Add LeakCanary to a debug build and look for a leak you create on purpose.", "Run the APK Analyzer on a release build and list the three largest items."),
    ...check("Tests do not depend on the network.", "You can read a crash trace to your own code.", "You can name three ways to speed up startup."),
  ], A('Debug a slow screen', [
    n('sym', 'Symptom', 'janky scroll or ANR', 0, 0, 'user'), n('prof', 'Profiler / Inspector', 'find the cause', 1, 0, 'tool'),
    n('fix', 'Fix', 'move work, add keys', 2, 0, 'check'), n('test', 'Benchmark', 'prove it is faster', 3, 0, 'out'),
  ], [
    { say: 'You notice a slow screen or an ANR report.', on: ['sym'] },
    { say: 'Use Profiler, Layout Inspector or the trace to find what blocks or redraws too much.', flow: ['sym>prof:measure'] },
    { say: 'Fix the real cause: move work off the main thread, add keys, reduce recomposition.', flow: ['prof>fix:cause'] },
    { say: 'Measure again with a benchmark so you know it improved.', flow: ['fix>test:compare'] },
  ]), [
    faq('Fake or mock?', 'Use a fake when a simple working version is easy to write. Use a mock when you need to check that a call happened or force an error.'),
    faq('What causes an ANR?', 'Blocking the main thread for several seconds, typically with disk, network or heavy computation. Move that work to a background coroutine.'),
    faq('What is a Baseline Profile?', 'A list of important code paths that Android compiles ahead of time, so the app starts faster and scrolls more smoothly from the first run.'),
  ]),

  // 29
  les(D, 'git-gradle-ci-cd-and-play-store-release-in-depth', 'Git, Gradle, CI/CD and Play Store Release in Depth', 'Git, Gradle, CI/CD and Play Release',
    'Learn Git workflows, Gradle Kotlin DSL, flavors, signing, GitHub Actions, Fastlane and the Google Play release process.', [
    P("A good developer ships reliably. This lesson covers the tools that make builds repeatable and releases safe: version control, Gradle, automated builds and the full Google Play process."),
    H("Git and GitHub"),
    L("`git init`, `add`, `commit`, `status`, `log`, `diff` are the daily commands. Commit small, with messages that say why.", "Use **branches**: `git switch -c feature/cart`. Merge or rebase back into `main`.", "Open a **pull request** on GitHub so teammates can review, and let automated checks run on it.", "Add a `.gitignore` for `build/`, `.gradle/`, `local.properties` and keystores. **Never commit signing keys or API keys.**", "Resolve conflicts by reading both sides carefully, then run the tests."),
    H("Gradle with the Kotlin DSL"),
    P("Gradle builds your project from `build.gradle.kts` files. A **version catalog** (`gradle/libs.versions.toml`) lists library versions in one place, so every module uses the same ones."),
    C('text', `[versions]
room = "2.6.1"
retrofit = "2.11.0"

[libraries]
room-runtime = { module = "androidx.room:room-runtime", version.ref = "room" }
retrofit = { module = "com.squareup.retrofit2:retrofit", version.ref = "retrofit" }

// in build.gradle.kts
dependencies {
    implementation(libs.room.runtime)
    implementation(libs.retrofit)
}`),
    H("Build types, flavors and variants"),
    P("A **build type** is debug or release. A **product flavor** is a version of the app, such as `free` and `paid`, or `staging` and `production`. Together they make **build variants** like `stagingDebug`. Use them for different base URLs, app names and Firebase projects. Put values in `buildConfigField` and read them from `BuildConfig`."),
    C('kotlin', `android {
    buildFeatures { buildConfig = true }
    flavorDimensions += "env"
    productFlavors {
        create("staging") {
            dimension = "env"
            applicationIdSuffix = ".staging"
            buildConfigField("String", "BASE_URL", "\\"https://staging.example.com/\\"")
        }
        create("production") {
            dimension = "env"
            buildConfigField("String", "BASE_URL", "\\"https://api.example.com/\\"")
        }
    }
}`),
    H("Signing configurations"),
    P("Read passwords from environment variables or an untracked `keystore.properties` file, never from the build file itself."),
    C('kotlin', `signingConfigs {
    create("release") {
        storeFile = file(System.getenv("KEYSTORE_PATH") ?: "release.jks")
        storePassword = System.getenv("KEYSTORE_PASSWORD")
        keyAlias = System.getenv("KEY_ALIAS")
        keyPassword = System.getenv("KEY_PASSWORD")
    }
}
buildTypes { release { signingConfig = signingConfigs.getByName("release"); isMinifyEnabled = true } }`),
    H("Continuous integration"),
    P("**CI** builds and tests every push automatically. With **GitHub Actions**, a file in `.github/workflows` describes the job. Store secrets (keystore as base64, passwords) in the repository's encrypted secrets."),
    C('text', `name: Android CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew testDebugUnitTest assembleDebug`),
    P("**Fastlane** automates the release steps: building, signing, uploading to Play Console and publishing release notes. Use CD (continuous delivery) to push each tagged build to internal testing automatically."),
    H("Play Console in depth"),
    L("**App signing**: use Play App Signing so Google keeps the app signing key. You upload with an upload key.", "**Versioning**: `versionCode` must increase for each upload, `versionName` is shown to users, and the application ID is permanent.", "**Store listing and ASO**: a clear title and short description with the words people search, a high-quality icon, 4 to 8 screenshots and a feature graphic. Honest descriptions help conversion and trust.", "**Policy forms**: privacy policy URL, data safety, content rating, target audience, ads declaration and permissions declarations.", "**Testing tracks**: internal (up to 100 testers, instant), closed (invited groups) and open (anyone). Personal developer accounts created recently may need to run a closed test with a minimum number of testers before production; check the current requirements.", "**Staged rollout**: release to 5 or 10 percent, watch crashes and ratings in Android vitals, then increase or halt.", "**After release**: reply to reviews, fix crashes first, and follow Play policy updates, since apps that break policy can be removed."),
    N(NOTE),
    ...task("Create a GitHub repository for one project with a proper .gitignore, then push a feature branch and open a pull request.", "Add staging and production flavors with different base URLs.", "Add the GitHub Actions workflow and see it pass.", "Write a release checklist for your app."),
    ...check("No key or password is in the repository.", "The CI run builds and tests every push.", "You can explain internal, closed, open and production tracks."),
  ], A('Build, test, ship', [
    n('git', 'Git push', 'branch + pull request', 0, 0, 'data'), n('ci', 'CI', 'build + test', 1, 0, 'tool'),
    n('aab', 'Signed AAB', 'secrets from CI', 2, 0, 'store'), n('play', 'Play tracks', 'internal to production', 3, 0, 'cloud'),
  ], [
    { say: 'You push a branch and open a pull request.', on: ['git'] },
    { say: 'CI builds the app and runs the tests on every push.', flow: ['git>ci:trigger'] },
    { say: 'A release job signs an AAB using secrets kept in CI, not in code.', flow: ['ci>aab:sign'] },
    { say: 'The build goes to internal testing, then a staged rollout.', flow: ['aab>play:upload'] },
  ]), [
    faq('What are product flavors for?', 'They let one code base build different versions, such as staging and production, with their own app ID, name, base URL and settings.'),
    faq('Why use a version catalog?', 'It keeps all library versions in one file, so every module uses the same version and upgrades are one edit.'),
    faq('What is a staged rollout?', 'Releasing an update to a small percentage of users first. If crashes rise, you can stop before everyone gets it.'),
  ]),

  // 30
  les(D, 'enterprise-android-multi-module-websockets-i18n-and-other-form-factors', 'Enterprise Android: Modules, WebSockets, i18n, Wear, TV, KMP', 'Enterprise Android: Modules and i18n',
    'See large-team practice: multi-module apps, environments, WebSockets, localisation, accessibility, Wear OS, TV and Kotlin Multiplatform.', [
    P("Small apps can be one module with a few screens. Companies with large apps and many developers need more structure. This lesson is a tour of those practices, so you can recognise them in a job and know what to study next."),
    H("Multi-module and scalable code"),
    L("**Feature modules** (`:feature:cart`) own their screens, ViewModels and tests. **Core modules** (`:core:network`, `:core:database`, `:core:designsystem`) are shared.", "Use `internal` and API modules so features expose only a small public surface.", "**Convention plugins** in a `build-logic` module share Gradle settings (compile SDK, Compose setup), so a new module takes a few lines.", "Run tests per module and cache builds (Gradle build cache) so CI stays fast.", "**Feature flags** (Remote Config or your own) let you merge unfinished work safely and turn features on gradually."),
    H("Multiple environments"),
    P("Use build flavors (lesson 29) for `dev`, `staging` and `production`, each with its own base URL, Firebase project and logging level. Hilt provides the right values. Never let a debug build talk to production data by accident."),
    H("Real-time communication"),
    P("**WebSockets** keep a two-way connection open, ideal for chat, live prices and collaborative apps. OkHttp supports them directly, and you can wrap the messages in a Flow."),
    C('kotlin', `fun socketMessages(url: String): Flow<String> = callbackFlow {
    val ws = client.newWebSocket(Request.Builder().url(url).build(), object : WebSocketListener() {
        override fun onMessage(webSocket: WebSocket, text: String) { trySend(text) }
        override fun onFailure(webSocket: WebSocket, t: Throwable, r: Response?) { close(t) }
    })
    awaitClose { ws.close(1000, null) }
}`),
    P("Handle reconnection with a growing delay, and fall back to polling or push notifications when the app is in the background. **WebRTC** adds direct audio, video and data between devices (video calls). It needs a signalling server and STUN/TURN servers, and most teams use a managed SDK instead of building it."),
    H("Localisation and accessibility"),
    L("Put every user-facing string in `strings.xml`; add translations in `values-hi`, `values-es` and so on. Use plurals for counts and format arguments instead of joining text.", "Support right-to-left languages (`start`/`end` instead of `left`/`right`).", "Format dates, numbers and currency with the user's locale.", "Per-app language settings are available on newer Android versions.", "Meet accessibility rules: labels, contrast, 48 dp touch targets, large font scaling, no information shown by colour alone, and full TalkBack support."),
    H("Other form factors"),
    L("**Foldables and tablets**: use window size classes and adaptive layouts (list and detail side by side).", "**Wear OS**: Compose for Wear OS, small round screens, short tasks, tiles and complications.", "**Android TV**: remote and D-pad focus, large text, Leanback or Compose for TV.", "**Android Auto and Automotive**: strict templates for safety; you build media or navigation experiences through approved APIs."),
    H("Kotlin Multiplatform"),
    P("**Kotlin Multiplatform (KMP)** shares Kotlin code, such as networking, data and business rules, between Android and iOS (and desktop and web), while the UI can stay native or use Compose Multiplatform. It pairs naturally with this course: your ViewModels, repositories and use cases are plain Kotlin. Start by sharing one module, such as the API client, and grow from there."),
    H("App security audit"),
    P("Before major releases, check dependencies for known vulnerabilities, review exported components, permissions, logging and stored data against the security lesson, and run a static analysis tool such as Android Lint and detekt."),
    N(NOTE),
    ...task("Split a project into :app and :core:data modules.", "Add dev and production flavors and switch base URL.", "Add Hindi (or another language) strings and test the app in that language.", "Make one screen show a list and detail side by side on a wide emulator."),
    ...check("Each module builds and tests on its own.", "The app is fully usable in a second language.", "You can explain what KMP shares and what it does not."),
  ], A('Modules with clear edges', [
    n('app', ':app', 'wires everything', 0, 0, 'app'), n('feat', ':feature:*', 'screens + ViewModels', 1, 0, 'tool'),
    n('core', ':core:*', 'network, db, design', 2, 0, 'store'), n('kmp', 'Shared Kotlin', 'optional KMP', 3, 0, 'out'),
  ], [
    { say: 'The app module is thin. It connects the feature modules.', on: ['app'] },
    { say: 'Feature modules own their screens and logic.', flow: ['app>feat:uses'] },
    { say: 'They depend on core modules, never on each other.', flow: ['feat>core:depends on'] },
    { say: 'Plain-Kotlin core code can later be shared with iOS using Kotlin Multiplatform.', flow: ['core>kmp:share'] },
  ]), [
    faq('When do I need multiple modules?', 'When builds slow down, teams grow, or you want strict boundaries and reuse. A small app can stay in one module.'),
    faq('WebSocket or polling?', 'Use a WebSocket for live two-way updates while the app is open. Use polling or push for occasional updates and when the app is in the background.'),
    faq('Does Kotlin Multiplatform replace Android development?', 'No. It shares non-UI code between platforms. You still build and ship each platform\'s app.'),
  ]),
];
