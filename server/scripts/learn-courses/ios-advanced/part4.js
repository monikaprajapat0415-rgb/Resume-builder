import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;
const S5 = 'Architecture, Delivery and Career';

export const lessons = [
  // ---------------------------------------------------------------- 12
  les(S5, 'modular-ios-architecture-swift-packages-clean-architecture-and-performance', 'Modular iOS Architecture: Swift Packages, Clean Architecture and Performance', 'Modular iOS Apps: SPM, Clean Architecture',
    'Split a growing app into Swift packages, apply Clean Architecture layers, wire dependencies at one composition root, and profile launch, memory and scrolling.', [
    P("A small app can live in one target. A big one cannot, for three reasons: builds get slow, any file can depend on any other so changes ripple everywhere, and several people cannot work in parallel without conflicts. **Modularisation** and a clear **architecture** are the answer, and *how would you structure a large app?* is a standard senior question. This lesson shows the practical version: Swift packages, layers, one place that wires everything, and the tools that find performance problems."),
    H("Swift Package Manager for your own code"),
    P("Swift Package Manager (SPM) is built into Xcode. It adds third-party libraries, and it also lets you split *your own* code into **local packages**, each with its own tests. A package describes its targets in a `Package.swift` file."),
    C('swift', S`// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ExpensesKit",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "ExpensesDomain", targets: ["ExpensesDomain"]),
        .library(name: "ExpensesData", targets: ["ExpensesData"])
    ],
    targets: [
        .target(name: "ExpensesDomain"),
        .target(name: "ExpensesData", dependencies: ["ExpensesDomain"]),
        .testTarget(name: "ExpensesDomainTests", dependencies: ["ExpensesDomain"])
    ]
)`),
    L("Add it to the app with **File > Add Package Dependencies > Add Local**, then link the library to the app target.", "Anything another module must see has to be marked **`public`**, including `init`s. The default access level, `internal`, hides things outside their own module. This is both the pain and the point of modules: they force you to decide what each one offers.", "Dependencies must point one way. In the package above, `ExpensesData` knows `ExpensesDomain`, and `ExpensesDomain` knows nothing about `ExpensesData`. If you try to make a circle, the build fails, and that is useful."),
    H("Clean Architecture in three layers"),
    P("Clean Architecture says that *business rules must not depend on details*. For an iOS app that becomes three layers, with the arrows pointing inward."),
    L("**Domain:** your entities (`Expense`), the rules, **use cases** (`AddExpense`), and **protocols** for what the outside must provide (`ExpenseRepository`). Pure Swift, with no SwiftUI, no SwiftData, no networking. It is the easiest layer to test.", "**Data:** the real work behind those protocols: a SwiftData store, a REST client, a cache. It imports Domain.", "**Presentation:** SwiftUI views and view models. It asks use cases for things and turns them into screen state."),
    C('swift', S`// ExpensesDomain
public struct Expense: Identifiable, Equatable, Sendable {
    public let id: UUID
    public var title: String
    public var amount: Double
    public init(id: UUID = UUID(), title: String, amount: Double) {
        self.id = id; self.title = title; self.amount = amount
    }
}

public protocol ExpenseRepository: Sendable {
    func all() async throws -> [Expense]
    func save(_ expense: Expense) async throws
}

public struct AddExpense: Sendable {
    private let repository: any ExpenseRepository
    public init(repository: any ExpenseRepository) { self.repository = repository }

    public func callAsFunction(title: String, amount: Double) async throws {
        let trimmed = title.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty, amount > 0 else { throw ExpenseError.invalid }
        try await repository.save(Expense(title: trimmed, amount: amount))
    }
}

public enum ExpenseError: Error { case invalid }`),
    P("The rule *a title cannot be empty and the amount must be above zero* now lives in one place, with no screen. It is tested with a fake repository in a few lines, and it works the same if you move from SwiftData to a server next year. A view model calls `try await addExpense(title: t, amount: a)`, and nothing else changes."),
    H("The composition root: where everything is wired"),
    P("Someone has to create the real objects and hand them in. Do it **in one place**, near the start of the app, called the *composition root*. Everywhere else just receives what it needs, the dependency injection from the first course, now at app scale."),
    C('swift', S`import SwiftUI

struct AppEnvironment {
    let expenses: any ExpenseRepository
    let addExpense: AddExpense

    static func live() -> AppEnvironment {
        let repo = SwiftDataExpenseRepository()      // from the Data module
        return AppEnvironment(expenses: repo, addExpense: AddExpense(repository: repo))
    }

    static func preview() -> AppEnvironment {
        let repo = InMemoryExpenseRepository(sample: true)
        return AppEnvironment(expenses: repo, addExpense: AddExpense(repository: repo))
    }
}

@main
struct ExpenseTrackerApp: App {
    private let environment = AppEnvironment.live()

    var body: some Scene {
        WindowGroup {
            RootView(environment: environment)
        }
    }
}`),
    N("`SwiftDataExpenseRepository` and `InMemoryExpenseRepository` are your own types in the Data module, which implement `ExpenseRepository`. Real ones need a model container, and the details are in the SwiftData lessons."),
    H("Frameworks you will hear about"),
    L("**The Composable Architecture (TCA)** is a popular third-party library, from Point-Free, for state management with strict, testable rules. It is powerful and has a real learning curve. A team should adopt it together, not one person alone.", "**Dependency containers** such as *Factory* or *Swinject*: libraries that register and resolve dependencies. Many teams find that plain initialiser injection and a small environment struct, as above, are enough.", "**Third-party packages in general:** pin versions, read the licence, and ask whether the library will still be maintained in two years. Each package is code you now own."),
    H("When not to modularise"),
    P("Every module is extra set-up and extra `public` keywords. For one developer and a few screens, a single target with clear folders is better. Split when builds become slow, when teams collide, or when a part such as the design system or the network layer is reused by more than one app. Architecture should answer a problem you have, and not one you imagine."),
    H("Performance: measure first"),
    P("Feelings about speed are often wrong. Use Xcode's tools."),
    L("**Time Profiler** (Instruments) shows which functions use the CPU. Look at the *heaviest stack trace*. The slow part is often not the one you suspect.", "**Allocations and Leaks** show memory growth, as in lesson 3.", "**Hangs** and the **SwiftUI** template in Instruments show moments when the main thread was blocked, and how often a view body ran.", "**App launch** time matters. Do as little as possible before the first screen: no network calls, no big file reads, no setting up of every service. Start the rest after the first frame.", "**Images** are the usual cause of memory spikes. A 12-megapixel photo shown in a 100-point thumbnail should be **downsampled**, for example with `UIImage.preparingThumbnail(of:)`, and not decoded at full size.", "**Lists:** use lazy containers, stable ids and cheap row views. Avoid `AnyView`, which hides the real type from SwiftUI and can make updates slower.", "**Field data:** Xcode's Organizer shows crash and hang reports from real users, and `MetricKit` delivers performance numbers from the field. Your own phone on fast Wi-Fi is not your users."),
    C('swift', S`import XCTest

final class ParsingPerformanceTests: XCTestCase {
    func testParsingIsFastEnough() {
        let data = makeLargeSampleJSON()      // your own helper
        measure {
            _ = try? JSONDecoder().decode([ExpenseDTO].self, from: data)
        }
    }
}`),
    P("`measure` runs the block several times and reports the average. Xcode lets you save a *baseline*, so a later change that makes the code much slower fails the test."),
    H("Common mistakes"),
    L("Splitting into twenty modules on day one.", "A Domain module that imports SwiftUI or SwiftData, which breaks the idea.", "Optimising before measuring.", "Putting every service in a global singleton. It hides dependencies and makes tests hard."),
    ...task("Move your Expense model, a repository protocol and one use case into a local Swift package called `ExpensesKit`, with its own tests.", "Add an in-memory repository and use it in a `#Preview` through an `AppEnvironment`.", "Run the Time Profiler on your app's launch and write down the three heaviest calls.", "Show a large image in a thumbnail, then downsample it and compare memory in the debug navigator."),
    ...check("The Domain package builds and tests with no import of SwiftUI or SwiftData.", "Previews work with fake data and no network.", "You can describe the three layers and which way their dependencies point."),
  ], A('Layers point inward', [
    n('ui', 'Presentation', 'SwiftUI, view models', 0, 0, 'app'), n('dom', 'Domain', 'rules, use cases', 1, 0, 'check'),
    n('proto', 'Repository protocol', 'what Domain needs', 2, 0, 'tool'), n('data', 'Data', 'SwiftData, network', 3, 0, 'store'),
  ], [
    { say: 'Presentation shows state and asks the Domain layer to do things.', flow: ['ui>dom:use case'] },
    { say: 'Domain holds the rules and knows nothing about screens or databases.', on: ['dom'] },
    { say: 'It states what it needs as a protocol, such as a repository.', flow: ['dom>proto:needs'] },
    { say: 'The Data layer implements the protocol, so you can swap a database for a server without touching the rules.', flow: ['data>proto:implements'] },
  ]), [
    faq('Why split an iOS app into Swift packages?', 'To speed up builds, to stop any file depending on any other, to let teams work in parallel, and to reuse parts such as a design system. For a small app with one developer, one target is usually better.'),
    faq('What is a composition root?', 'The one place near the start of the app where real objects are created and handed to the parts that need them. The rest of the code only receives dependencies.'),
    faq('How do I find out why my app is slow?', 'Measure with Instruments, for example Time Profiler for CPU, Allocations for memory and the Hangs and SwiftUI templates for the main thread. Do not guess, and check field data in Xcode Organizer and MetricKit.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S5, 'ios-ci-cd-fastlane-github-actions-xcode-cloud-and-release-engineering', 'iOS CI/CD: Fastlane, GitHub Actions, Xcode Cloud and Safe Releases', 'iOS CI/CD: Fastlane, Actions, Xcode Cloud',
    'Automate iOS builds and tests, ship to TestFlight with Fastlane, compare GitHub Actions, Xcode Cloud and Bitrise, and release safely with flags.', [
    P("Releasing an iOS app by hand means a dozen careful clicks: bump the number, archive, sign, upload, wait, fill in a form. Each click is a chance to forget something, and the person who knows the steps goes on holiday. **Continuous integration** (CI) builds and tests the app on a server for every change, and **continuous delivery** (CD) ships it with little or no hand work. Knowing this separates a developer who writes screens from one who can own a release."),
    H("What CI should do on every change"),
    O("Check out the code on a clean machine.", "Resolve packages.", "Build the app.", "Run the unit tests, and the UI tests for the main flows.", "Report the result on the pull request, so a broken change cannot be merged by mistake."),
    P("Because the machine starts clean, CI also finds the classic *works on my machine* problems, such as a file that is on your computer but was never committed."),
    H("Command line first"),
    P("Every CI tool does the same underlying thing: it runs `xcodebuild`. If you can run these in a terminal, you can automate them."),
    C('bash', S`xcodebuild test \
  -scheme ExpenseTracker \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -resultBundlePath build/TestResults.xcresult`),
    N("Simulator names and the Xcode version differ between machines and CI images. If the run fails with a message about a missing destination, run `xcrun simctl list devices` on the same machine to see what exists, and use one of those names."),
    H("GitHub Actions"),
    P("If your code is on GitHub, Actions is the easiest place to start. A workflow is a YAML file in `.github/workflows/`. iOS builds need a **macOS runner**, which GitHub bills at a higher rate than Linux. Check the current pricing and your free allowance."),
    C('yaml', S`name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Show Xcode version
        run: xcodebuild -version
      - name: Test
        run: |
          xcodebuild test \
            -scheme ExpenseTracker \
            -destination 'platform=iOS Simulator,name=iPhone 16'`),
    L("Pin the Xcode version your project needs if the runner has several, and check the runner image's documentation for how to select it.", "Cache Swift package downloads to save minutes.", "Keep secrets, such as keys, in **GitHub Secrets** and never in the repository."),
    H("Fastlane: scripts for releases"),
    P("**Fastlane** is a toolbox of release actions written in Ruby, with a simple file called a `Fastfile`. A *lane* is a named sequence of steps. Teams use it so that *ship a beta* is one command that works the same on every machine."),
    C('ruby', S`default_platform(:ios)

platform :ios do
  desc "Run the unit tests"
  lane :test do
    run_tests(scheme: "ExpenseTracker", devices: ["iPhone 16"])
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    api_key = app_store_connect_api_key(
      key_id: ENV["ASC_KEY_ID"],
      issuer_id: ENV["ASC_ISSUER_ID"],
      key_content: ENV["ASC_KEY_CONTENT"]
    )
    increment_build_number(build_number: latest_testflight_build_number(api_key: api_key) + 1)
    build_app(scheme: "ExpenseTracker")
    upload_to_testflight(api_key: api_key)
  end
end`),
    L("`run_tests`, `build_app` and `upload_to_testflight` are the current names for the older `scan`, `gym` and `pilot` actions, and the old names still work. Check Fastlane's documentation for your version.", "The **App Store Connect API key** lets automation sign in without your personal password. Create it in App Store Connect, give it the least role it needs, and store its contents in your CI's secrets.", "**Code signing** is the part that hurts most. The simplest route is Xcode's automatic signing. For teams, `fastlane match` keeps the certificates and profiles in a private repository, so every machine uses the same ones."),
    H("Xcode Cloud and other services"),
    L("**Xcode Cloud** is Apple's own CI/CD, set up inside Xcode and App Store Connect. It handles signing for you and sends builds to TestFlight. Check Apple's pages for the current plans and free allowance.", "**Bitrise** and similar services are hosted for mobile and give ready-made steps and a visual editor.", "**Self-hosted Mac machines** are an option for teams with many builds. Someone has to keep them updated."),
    P("The choice usually depends on where the code lives, the budget and how much control the team wants. All of them run the same `xcodebuild` underneath, so what you learn here transfers."),
    H("Versions and build numbers"),
    L("The **version** (for example 2.4.0) is what people see. It follows a pattern the team agrees on, such as *major.minor.patch*.", "The **build number** must go up with every upload to App Store Connect. Automate it, as in the lane above, so nobody has to remember."),
    H("Releasing without fear"),
    L("**TestFlight first.** Every release goes to testers before the public.", "**Phased release.** App Store Connect can release an update to a growing share of automatic-update users over several days. If crash reports rise, you can pause it.", "**Feature flags** hide new code behind a switch that you control from a server or a config file. You can ship code that is turned off, turn it on for a few people, and turn it off again without a new release. Keep the flag list small and delete old flags.", "**Crash reporting.** Xcode Organizer shows crashes from users. Third-party tools such as Firebase Crashlytics or Sentry add more detail and alerts.", "**A hotfix path.** Decide in advance how you ship a fix quickly: a branch from the release tag, a short review, the same pipeline. Practice it once when nothing is on fire.", "**Release notes** that say what changed, in plain words."),
    N("An App Store review can take time, so a fix is never instant. This is why flags, phased release and server-side control of risky behaviour matter more on iOS than on the web."),
    H("Common mistakes"),
    L("Committing keys or certificates to the repository.", "A CI that is red for weeks, so everyone ignores it. Fix or remove failing tests quickly.", "Manual build numbers that clash.", "Shipping to everyone at once with no way to pause."),
    ...task("Write the GitHub Actions workflow and open a pull request that runs it. Break a test on purpose and watch the check fail.", "Write the `test` lane in a `Fastfile` and run it with `fastlane test`.", "Create an App Store Connect API key (only if you have a developer account), store it as secrets and write the `beta` lane.", "Write a one-page release checklist for your app, including the hotfix steps."),
    ...check("A failing test blocks the pull request.", "`fastlane test` runs the same tests as CI.", "You can explain phased release and a feature flag, and when each helps."),
  ], A('A release pipeline', [
    n('pr', 'Pull request', 'new code', 0, 0, 'user'), n('ci', 'CI build', 'build and test', 1, 0, 'tool'),
    n('tf', 'TestFlight', 'beta testers', 2, 0, 'check'), n('rel', 'Phased release', 'grows, can pause', 3, 0, 'out'),
  ], [
    { say: 'A developer opens a pull request with a change.', on: ['pr'] },
    { say: 'CI builds the app on a clean machine and runs the tests. A failure blocks the merge.', flow: ['pr>ci:every change'] },
    { say: 'After merge, a lane increments the build number and sends the build to TestFlight.', flow: ['ci>tf:fastlane beta'] },
    { say: 'The release goes to users in phases. If crashes rise, you can pause it.', flow: ['tf>rel:release'] },
  ]), [
    faq('What is the difference between CI and CD?', 'CI (continuous integration) builds and tests every change automatically. CD (continuous delivery) goes further and packages and ships the app, for example to TestFlight, with little or no manual work.'),
    faq('Is Fastlane still used?', 'Yes, many teams use it to script builds, signing, screenshots and uploads, often inside CI services. Xcode Cloud and other tools cover some of the same ground, and all of them run xcodebuild underneath.'),
    faq('How do I release safely on iOS where review takes time?', 'Use TestFlight first, phased release, feature flags you can switch from a server, crash reporting, and a hotfix path you have already practised.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S5, 'senior-ios-developer-interview-preparation-and-system-design', 'Senior iOS Interview Preparation: Questions, System Design and Portfolio', 'Senior iOS Interview Preparation',
    'Prepare for iOS interviews beyond the basics: Swift, concurrency, SwiftUI and architecture questions, a mobile system design walkthrough and your portfolio.', [
    P("By now you know the topics. An interview asks something different: *can you explain it, choose between options and defend the choice?* This lesson gives you a way to prepare. We cannot know what any one company will ask, and we do not claim that these questions were asked anywhere in particular. They are common, current topics, and the best answers are your **own words, with an example from your own project**."),
    H("How interviews usually go"),
    L("**A screen of your resume and portfolio.** Be ready to explain every project in a minute.", "**Language and framework questions**, short answers, to check your base.", "**Live coding or a take-home task.** A small feature, often a list with a network call and a detail screen.", "**Architecture or system design**: how you would build a larger feature or app.", "**Talking about work with others:** disagreements, mistakes, reviews."),
    H("Swift questions, with the ideas behind the answers"),
    L("**Struct or class?** Value versus reference semantics, copying, identity, inheritance, and why SwiftUI uses structs. Give an example of a bug caused by shared reference.", "**What is ARC? What is a retain cycle?** Strong references and counts, weak versus unowned, `[weak self]`, and how you find a leak (Memory Graph, Instruments).", "**What is an optional?** The type that can hold nothing, safe unwrapping, and why force unwrapping is risky.", "**Protocols versus inheritance?** Composition, protocol extensions, multiple conformance, testing with fakes.", "**What does `escaping` mean for a closure?** The closure may be called after the function returns, so it is stored, and may capture `self`.", "**Generics and `some` versus `any`?** One type known at compile time versus a box that holds any type."),
    H("Concurrency questions"),
    L("**GCD and OperationQueue versus async/await?** Callbacks and queues versus structured code that reads in order, with cancellation and error handling built in.", "**What is an actor?** Isolated state that handles one call at a time. Mention reentrancy.", "**What does `@MainActor` do?** Runs code on the main thread, so UI updates are safe.", "**How do you cancel a search as the user types?** Keep the task, cancel it on each change, add a short delay, check `Task.isCancelled`.", "**What is a data race, and how does Swift help?** Two threads using the same data with one writing. `Sendable`, actors and strict concurrency checks."),
    H("SwiftUI questions"),
    L("**`@State`, `@Binding`, `@Observable`, `@Environment`: when each?** Own local value, share a value with a child, an observable model object, a value or object from the environment.", "**Why did my view update, or not update?** Which state it reads, identity, and what a view body is allowed to do.", "**`ObservableObject` versus `@Observable`?** The older `@Published` approach versus the iOS 17 macro that tracks the properties a view reads.", "**How do you navigate from code?** `NavigationStack` with a `NavigationPath` and a router.", "**How do you mix SwiftUI and UIKit?** `UIHostingController` and `UIViewRepresentable`."),
    H("Architecture and platform questions"),
    L("**MVC, MVVM, Clean Architecture, TCA: how do you choose?** Team size, testing needs, the size of the app, and the cost of each. Say what you would do on a small app and on a large one.", "**How do you handle auth tokens?** Keychain, refresh through one shared task, never log them.", "**How do you test a view model?** Inject a fake service through a protocol, call the method, check the state.", "**How do you make an app work offline?** A local database as the source of truth, a sync step, clear states for *offline* and *stale*.", "**How do you speed up a slow list or a slow launch?** Measure with Instruments first, then fix the biggest cause."),
    H("A system design walkthrough: an offline-first expense app that syncs"),
    P("Interviewers like a design question because there is no single right answer. They watch how you *think*. Here is a way to organise the answer, using our own app. Talk through it out loud, and ask questions before you start."),
    O("**Clarify.** Who uses it? Do they need it offline? How many records? Several devices per person? Any shared accounts?", "**Local first.** The device database (SwiftData or Core Data) is the **source of truth** for the screen. The screen never waits for the network.", "**A sync layer.** Changes made offline go into a queue of pending operations (create, update, delete), each with a client-generated id and a timestamp. When the network is back, a worker sends them in order, with retries and backoff, and marks each one done.", "**Conflicts.** Two devices edit the same item. Say your rule: *last write wins* is simple, and field-level merging is safer. Tell them what you trade away.", "**Server API.** Incremental pull with a *since* cursor, so the app asks only for changes. Pagination for large lists. Idempotent writes, so a retry cannot create duplicates.", "**Auth and security.** Tokens in the Keychain, refresh handled once, HTTPS, no secrets in the app.", "**Push.** A silent push tells the app that something changed, and the app pulls. Remember that delivery is not guaranteed.", "**Errors and states.** Loading, empty, offline, failed with retry, syncing. Say what the user sees in each.", "**Testing and rollout.** Unit tests for the sync rules with fake services, a feature flag, a phased release, crash reporting."),
    N("A good answer names the *trade-offs*, not only the parts. For example: *local-first makes the app feel fast and work offline, but adds sync and conflict logic, which is where most of the bugs will be.*"),
    H("Live coding and take-home tips"),
    L("Read the brief twice. Ask what is in scope and what is not.", "Get a small working version first, and improve it. A running app beats a perfect plan.", "Keep the structure simple, with a view model and a protocol for the network, and show you can test it.", "Handle loading, empty and error states. Many people forget them.", "Write a short README: how to run it, what you chose, and what you would do next."),
    H("Your portfolio"),
    L("Three to four **finished** projects are better than ten half-done ones. Link the code, add screenshots and, if you can, a TestFlight or App Store link.", "In each README, explain **one hard decision** and why you made it. This is what interviewers talk about.", "Show tests, a clean structure and a continuous integration badge.", "Keep your resume honest and specific. List the frameworks you really used, and what you built with them."),
    P("Build your resume with our [resume builder](/app) and check it with the [ATS checker](/features/ats-checker). Practise on the [interview questions page](/jobs/interview-questions), and read the [roadmaps](/roadmaps) to plan what to add next. If you have not done it yet, the [beginner iOS course](/learn/ios-development-swift-swiftui-course) and our [Git and GitHub course](/learn/git-and-github-course) cover the base that these questions assume."),
    P("No preparation can promise an offer, because hiring depends on many things you do not control. What you can control is being able to explain, with examples, what you built and why."),
    ...task("Pick ten questions from this lesson and answer each aloud in under a minute. Record yourself and listen back.", "Write a one-page system design for an app of your choice, using the nine steps above.", "Choose your best project and write the README with one hard decision and its trade-offs.", "Ask a friend to ask you three questions you did not prepare, and practise saying *I am not sure, but here is how I would find out*."),
    ...check("You can explain value versus reference types, ARC and actors in your own words, with one example each.", "Your system design names at least two trade-offs.", "Your best project has a README that a stranger could follow."),
  ], A('Offline-first sync', [
    n('ui', 'Screen', 'reads local data', 0, 0, 'app'), n('db', 'Local database', 'source of truth', 1, 0, 'store'),
    n('q', 'Pending queue', 'offline changes', 2, 0, 'data'), n('srv', 'Server', 'merges, answers', 3, 0, 'model'),
  ], [
    { say: 'The screen always reads from the local database, so it is fast and works offline.', flow: ['db>ui:reads'] },
    { say: 'User changes are saved locally at once and added to a queue of pending operations.', flow: ['ui>db:saves', 'db>q:queue'] },
    { say: 'When the network is back, a worker sends the queue to the server, with retries and idempotent writes.', flow: ['q>srv:sync'] },
    { say: 'The server answers with changes since a cursor, and the app merges them using your conflict rule.', on: ['srv'] },
  ]), [
    faq('What is asked in a senior iOS interview?', 'It varies by company, so we cannot say what any one will ask. Expect Swift and concurrency fundamentals, SwiftUI and UIKit, architecture choices, testing, performance and a design discussion, and be ready to explain your own projects.'),
    faq('How should I answer a system design question?', 'Clarify the requirements first, then walk through the data flow, offline behaviour, sync and conflicts, security, errors and testing. Name the trade-offs of your choices instead of only listing parts.'),
    faq('How many portfolio projects do I need?', 'Three or four finished and well explained projects are stronger than many unfinished ones. A README that explains one hard decision helps a lot.'),
  ]),
];
