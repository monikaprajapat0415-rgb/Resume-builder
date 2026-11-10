import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;

export const lessons = [
  les('For Android Developers', 'swift-for-android-developers-kotlin-vs-swift-compose-vs-swiftui', 'Swift for Android Developers: Kotlin vs Swift, Compose vs SwiftUI', 'Swift for Android Developers',
    'Compare Kotlin and Swift, Compose and SwiftUI, ViewModel and @Observable, Room and SwiftData, coroutines and async/await, with side by side code.', [
    P("If you already build Android apps with Kotlin and Jetpack Compose, you know more iOS than you think. Swift and Kotlin were designed in the same years by people who read the same papers, so they look alike: both have optionals, data-like types, closures, extension functions and a modern way of writing asynchronous code. SwiftUI and Compose are cousins too: both describe the screen as a function of state, and both redraw when the state changes."),
    P("This lesson is a map between the two worlds. It helps in two directions. If you are an Android developer, it shows you where to look in iOS. If you are an iOS developer, it explains what the Kotlin lessons in the Android course mean. It also helps you answer the common interview question: \"What are the differences between the two platforms?\""),
    H("The languages side by side"),
    L(
      "**Constants and variables**: Kotlin `val` and `var`; Swift `let` and `var`.",
      "**Null safety**: Kotlin `String?` with `?.`, `?:` and `!!`; Swift `String?` with `?.`, `??` and `!`. Swift's `if let` and `guard let` match Kotlin's smart casts and early returns.",
      "**Data holders**: Kotlin `data class` gives equals, copy and toString. Swift `struct` is copied by value and gets memberwise initialisers; add `Equatable`, `Hashable` or `Codable` as needed.",
      "**Sealed types**: Kotlin `sealed class`; Swift `enum` with associated values. Both give exhaustive `when` and `switch`.",
      "**Interfaces**: Kotlin `interface`; Swift `protocol`, which can also have default methods through extensions.",
      "**Lambdas**: Kotlin `{ x -> x * 2 }`; Swift `{ x in x * 2 }`. Trailing closure syntax exists in both.",
      "**Extensions**: both let you add functions to existing types.",
    ),
    C('swift', S`// Swift
enum LoadState {
    case loading
    case loaded([String])
    case failed(String)
}

func describe(_ state: LoadState) -> String {
    switch state {
    case .loading: return "Loading..."
    case .loaded(let items): return "\(items.count) items"
    case .failed(let message): return "Error: \(message)"
    }
}`),
    C('kotlin', `// Kotlin
sealed interface LoadState {
    data object Loading : LoadState
    data class Loaded(val items: List<String>) : LoadState
    data class Failed(val message: String) : LoadState
}

fun describe(state: LoadState): String = when (state) {
    LoadState.Loading -> "Loading..."
    is LoadState.Loaded -> state.items.size.toString() + " items"
    is LoadState.Failed -> "Error: " + state.message
}`),
    P("The shapes are nearly identical. The biggest practical difference is **memory**. Kotlin runs on the JVM with a garbage collector. Swift uses **ARC**, automatic reference counting, so you must think about retain cycles with `weak` and `unowned` when closures capture `self`. The advanced iOS course has a full lesson on it."),
    H("The frameworks side by side"),
    L(
      "**UI**: Jetpack Compose and SwiftUI. `@Composable` functions are `View` structs. `remember { mutableStateOf() }` is `@State`. State hoisting is `@Binding`. `Modifier` chains are view modifiers, and the order matters in both.",
      "**Lists**: `LazyColumn` is `List` or `LazyVStack`. `items(list)` is `ForEach`.",
      "**Navigation**: Navigation Compose with a NavHost is `NavigationStack` with `navigationDestination`. Bottom navigation is `TabView`.",
      "**State holders**: `ViewModel` with `StateFlow` is an `@Observable` class, often marked `@MainActor`. `collectAsStateWithLifecycle` has no equivalent because SwiftUI observes the properties you read.",
      "**Async**: coroutines and `suspend` are `async`/`await`. `launch` is `Task { }`. `Flow` is `AsyncSequence` and `AsyncStream`. `viewModelScope` is a Task you cancel yourself or tie to `.task`.",
      "**Networking**: Retrofit with kotlinx.serialization is `URLSession` with `Codable`.",
      "**Database**: Room is SwiftData (or Core Data). `@Entity` is `@Model`. A Room `Flow` query is `@Query`.",
      "**Settings**: DataStore is `@AppStorage` and UserDefaults. Encrypted storage is the Keychain.",
      "**Background work**: WorkManager is `BGTaskScheduler`. Push is Firebase Cloud Messaging on Android and APNs on iOS.",
      "**Dependency injection**: Hilt is usually plain initialiser injection or the SwiftUI environment in iOS. Heavy frameworks are less common.",
      "**Testing**: JUnit and Compose tests are Swift Testing, XCTest and XCUITest.",
    ),
    H("State and screens: Compose and SwiftUI"),
    C('kotlin', `// Compose
@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Tapped " + count + " times")
    }
}`),
    C('swift', S`// SwiftUI
struct Counter: View {
    @State private var count = 0

    var body: some View {
        Button("Tapped \(count) times") {
            count += 1
        }
    }
}`),
    P("Both versions are the same idea. The state is owned by the view, the screen is a description of that state, and changing the state redraws the screen. The differences are small: SwiftUI views are structs with a `body` property, and `private` on a @State property is a convention that says the view owns it."),
    H("What is genuinely different"),
    L(
      "**Tooling**: Android Studio on any desktop system; Xcode only on a Mac. You cannot build iOS apps on Windows or Linux without a Mac.",
      "**Release**: Google Play takes an AAB and has a review that is usually quick. The App Store needs an Apple Developer account, signing certificates, TestFlight for betas and a stricter human review. Plan more time for iOS review.",
      "**Device variety**: Android has thousands of device models and manufacturer changes. iOS has fewer devices, which makes layout testing easier, but Apple controls which iOS version users run less than you might hope, so always check the minimum version you support.",
      "**Permissions and privacy**: both ask at run time. iOS needs a usage description text in Info.plist for each sensitive feature, and App Store review checks it. Apple also asks for privacy manifests and nutrition-label style disclosures.",
      "**Back button and navigation**: Android has a system back button. iOS uses a back swipe and the navigation bar, so design the flows differently.",
    ),
    N("This comparison is from our reading of both platforms and was not tested by building the same app twice. Framework details change every year, so check the current documentation before relying on a specific name."),
    P("A good learning path for an Android developer is: read the Swift basics lessons quickly, spend time on ARC and value types, build the Calculator and To-Do projects in this course, and then compare the code with the Android versions. Seeing the same app in both languages is the fastest way to make the two feel like one skill."),
    P("The same ideas appear in our other mobile courses. The [Android Development with Kotlin course](/learn/android-development-kotlin-course) builds 21 apps in Kotlin and Compose, and the [React Native with Expo course](/learn/react-native-development-expo-course) shows one JavaScript codebase for both platforms. When you are ready to go deeper on iOS, continue with the [Advanced iOS Development course](/learn/advanced-ios-development-course)."),
    ...task("Pick one Android project you built, for example the Habit tracker. Build the matching iOS project in this course.", "Write a table of five things you had to change when moving the idea from Kotlin to Swift.", "Re-read the ARC lesson in the advanced course and find where your Android code would have needed `weak self`."),
    ...check("You can name the Swift equivalent of val, a data class, a sealed class, a coroutine, Room and ViewModel.", "You can explain why SwiftUI needs no collectAsState call.", "You can name two differences in releasing to the App Store and Google Play."),
  ], A('Same idea, two toolkits', [
    n('kt', 'Kotlin + Compose', 'Android', 0, 0, 'app'), n('idea', 'Same ideas', 'state, lists, async', 1, 0, 'tool'),
    n('sw', 'Swift + SwiftUI', 'iOS', 2, 0, 'app'), n('ship', 'Ship it', 'Play and App Store', 3, 0, 'out'),
  ], [
    { say: 'Android apps use Kotlin and Jetpack Compose.', on: ['kt'] },
    { say: 'Both toolkits describe the screen as a function of state and use async code.', flow: ['kt>idea:shared ideas'] },
    { say: 'iOS apps use Swift and SwiftUI with very similar patterns.', flow: ['idea>sw:translate'] },
    { say: 'Each ships through its own store, with different tools and review rules.', flow: ['sw>ship:release'] },
  ]), [
    faq('Can I build iOS apps without a Mac?', 'Not natively. Xcode runs only on macOS. Some cloud services give you a remote Mac, and cross-platform tools such as React Native with Expo can build in the cloud, but you still need a Mac or a cloud build for the App Store.'),
    faq('Is SwiftUI the same as Jetpack Compose?', 'They share the same idea: declare the screen from state. The APIs and names differ, and each has its own layout rules, so learn both on their own terms.'),
    faq('Should I learn Kotlin Multiplatform or Swift?', 'If you want to share business logic, Kotlin Multiplatform is an option, but you still need Swift knowledge for the iOS app. Learning both platforms natively is the safest path for jobs.'),
  ]),
];
