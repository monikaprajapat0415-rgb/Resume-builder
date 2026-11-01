import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;
const S5 = 'Data and Networking';
const S6 = 'Architecture and Testing';
const S7 = 'Shipping and Career';

export const lessons = [
  // ---------------------------------------------------------------- 11
  les(S5, 'urlsession-codable-and-calling-rest-apis', 'URLSession and Codable: Call a REST API from SwiftUI', 'URLSession and Codable: Call a REST API',
    'Learn how to read JSON with Codable, call a web API with URLSession and async/await, handle bad responses, and show loading, result and error states in SwiftUI.', [
    P("Most apps talk to a server. A weather app asks for the forecast, a shop app asks for products, a chat app sends your message to a language model. They all do it the same way: send an HTTP request, get back **JSON**, and turn the JSON into Swift values. In this lesson you build a small weather screen with the two tools Apple gives you for that, `URLSession` and `Codable`."),
    H("JSON and Codable"),
    P("JSON is a plain-text format of keys and values. `Codable` is a Swift protocol (in fact a pair, `Encodable` and `Decodable`) that lets a struct turn into JSON and back, with almost no code. If the property names match the keys in the JSON, you are done. If they do not, you describe the difference with `CodingKeys`."),
    C('swift', S`import Foundation

struct Weather: Codable {
    struct Current: Codable {
        let temperature: Double
        let windSpeed: Double

        enum CodingKeys: String, CodingKey {
            case temperature = "temperature_2m"
            case windSpeed = "wind_speed_10m"
        }
    }
    let current: Current
}

let json = """
{ "current": { "temperature_2m": 18.4, "wind_speed_10m": 9.1 } }
"""

do {
    let weather = try JSONDecoder().decode(Weather.self, from: Data(json.utf8))
    print(weather.current.temperature)   // 18.4
} catch {
    print("Could not read the JSON: \(error)")
}`),
    P("The three quote marks make a **multi-line string**. `Data(json.utf8)` turns text into the raw bytes that the decoder reads. Decoding can fail, for example if a key is missing or has the wrong type, so it is called with `try`. Fail-with-a-message is much better than a crash, so always keep it inside `do` and `catch`, or in a function that `throws`."),
    L("Nested JSON objects become nested structs, as above.", "Keys that may be missing become optional properties, such as `let note: String?`.", "Dates need a decoder setting, such as `decoder.dateDecodingStrategy = .iso8601`.", "For snake_case keys such as `first_name`, you can set `decoder.keyDecodingStrategy = .convertFromSnakeCase` instead of writing CodingKeys by hand. Names with digits, like `temperature_2m`, are better with explicit `CodingKeys`."),
    H("Calling the API with URLSession"),
    P("`URLSession` is Apple's tool for network requests. Since Swift Concurrency arrived, the call is a single `await`. We use **Open-Meteo**, a weather service that was free to use for non-commercial projects without a key when this lesson was written. Check its current terms on its website before you use it in anything you publish."),
    N("We wrote the field names above from our reading of the service's documentation and could not run the call in the environment where this course was written. So do one thing first: paste the web address below into a browser and look at the real JSON. If the field names differ from the struct, change the `CodingKeys` to match. Reading a real response before writing a model is a good habit in any case."),
    C('swift', S`enum APIError: Error {
    case badURL
    case badStatus(Int)
}

struct WeatherService {
    func fetch(latitude: Double, longitude: Double) async throws -> Weather {
        guard var parts = URLComponents(string: "https://api.open-meteo.com/v1/forecast") else {
            throw APIError.badURL
        }
        parts.queryItems = [
            URLQueryItem(name: "latitude", value: String(latitude)),
            URLQueryItem(name: "longitude", value: String(longitude)),
            URLQueryItem(name: "current", value: "temperature_2m,wind_speed_10m")
        ]
        guard let url = parts.url else { throw APIError.badURL }

        let (data, response) = try await URLSession.shared.data(from: url)

        if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
            throw APIError.badStatus(http.statusCode)
        }
        return try JSONDecoder().decode(Weather.self, from: data)
    }
}`),
    L("`URLComponents` builds a web address safely, including the question mark and the encoding of special characters. It is better than gluing strings together.", "`URLSession.shared.data(from:)` is `async throws`. It returns the bytes and a response object.", "A server can answer with a failure code, for example 404 or 500, and `data(from:)` does not throw for it. You must check the status code yourself. Codes from 200 to 299 mean success.", "Everything that can go wrong, no internet, a bad status, unexpected JSON, ends up as a thrown error that the screen can catch."),
    H("Showing loading, result and error"),
    P("A network call has three outcomes the person needs to see: waiting, success and failure. An enum from lesson 4 models this nicely. The screen is then a simple `switch`."),
    C('swift', S`enum LoadState {
    case idle
    case loading
    case loaded(Weather)
    case failed(String)
}

struct WeatherView: View {
    @State private var state: LoadState = .idle
    private let service = WeatherService()

    var body: some View {
        VStack(spacing: 16) {
            switch state {
            case .idle, .loading:
                ProgressView("Loading weather...")
            case .loaded(let weather):
                Text("\(weather.current.temperature, specifier: "%.1f") degrees")
                    .font(.largeTitle)
                Text("Wind \(weather.current.windSpeed, specifier: "%.1f")")
                    .foregroundStyle(.secondary)
            case .failed(let message):
                Text(message).foregroundStyle(.red)
                Button("Try again") { Task { await load() } }
            }
        }
        .padding()
        .task { await load() }
    }

    private func load() async {
        state = .loading
        do {
            let weather = try await service.fetch(latitude: 52.52, longitude: 13.41)
            state = .loaded(weather)
        } catch {
            state = .failed("Could not load the weather. Check your connection.")
        }
    }
}`),
    P("The numbers 52.52 and 13.41 are the position of a city. Later you can ask for the user's location with Core Location, or let them type a city. The message in the `failed` case is written for a person. Do not show raw error text to users. It means nothing to them, and it can reveal things you would rather keep private."),
    H("Rules for real apps"),
    L("**Use HTTPS.** iOS blocks plain `http` addresses by default for good reasons.", "**Never put a secret key in the app.** Anything inside an app can be extracted. If an API needs a private key, such as a language model service, call your own server, which keeps the key and talks to the service for you. This is the pattern behind the AI courses on this site.", "**Be ready for failure.** Phones lose signal, tunnels exist. Always have an error state and a retry.", "**Do not call on every key press.** For search boxes, wait until the user stops typing for a moment.", "**Respect the service's terms and rate limits.** Free services often have limits."),
    H("Common mistakes"),
    L("Assuming a 404 or 500 throws an error. You have to check the status code.", "A struct that does not match the JSON, which gives a decoding error. Read the real response first.", "Updating the screen from a background thread. In SwiftUI with `@State` and `.task`, you are on the main actor, which is what you want."),
    ...task("Decode the sample JSON in a Playground and print the temperature.", "Open the Open-Meteo address in a browser, compare the real field names with your struct, and fix `CodingKeys` if needed.", "Build `WeatherView` and run it. Turn on Airplane Mode in the Simulator's host settings or use a wrong address to see the error state and the retry button.", "Add a `TextField` for a city and one more field, such as a time or a unit, decoded from the response."),
    ...check("The screen shows a spinner, then a temperature, and a retry button when the call fails.", "You can say why a 404 does not throw by itself.", "You can say why a secret API key must never be inside the app."),
  ], A('A network call', [
    n('view', 'SwiftUI view', 'task starts it', 0, 0, 'app'), n('sess', 'URLSession', 'sends the request', 1, 0, 'tool'),
    n('api', 'Web API', 'returns JSON', 2, 0, 'store'), n('model', 'Codable struct', 'Swift values', 3, 0, 'data'),
  ], [
    { say: 'The screen starts a task and shows a spinner while it waits.', on: ['view'] },
    { say: 'URLSession sends an HTTPS request to the web address.', flow: ['view>sess:await'] },
    { say: 'The server answers with a status code and JSON. You must check the status yourself.', flow: ['sess>api:request'] },
    { say: 'JSONDecoder turns the JSON into your Codable struct, and the screen shows the result or an error.', flow: ['api>model:decode'] },
  ]), [
    faq('What is Codable in Swift?', 'A protocol that lets a type be turned into and read from formats such as JSON. If property names match the keys, you write almost no code. CodingKeys handle differences.'),
    faq('Does URLSession throw an error for a 404 response?', 'No. It throws for problems such as no connection, but a 404 or 500 comes back as a normal response. Check the status code and throw your own error.'),
    faq('Is it safe to put an API key inside an iOS app?', 'No. Anything in an app can be extracted. Keep private keys on your own server and let the app call that server.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S5, 'swiftdata-save-data-on-iphone', 'SwiftData: Save and Query Data on the iPhone', 'SwiftData: Save and Query Data on iPhone',
    'Make the Expense Tracker remember its data with SwiftData: the Model macro, ModelContainer, Query, insert, delete, sorting, filtering and AppStorage.', [
    P("Right now the Expense Tracker forgets everything when you close it. To keep data on the phone you need **persistence**. Apple's modern tool for it is **SwiftData**, which arrived with iOS 17. It sits on the same storage technology as the older **Core Data**, but it is written in plain Swift, and it works well with SwiftUI. You will still see Core Data and plain SQLite in jobs, so know that they exist. Start with SwiftData for new apps with a minimum of iOS 17."),
    H("Make the model storable"),
    P("Change the `Expense` struct to a class and put `@Model` in front of it. This one macro makes the class storable and observable. A class is needed here because SwiftData tracks changes to one shared object, which is the case where lesson 4 said a class is the right choice."),
    C('swift', S`import SwiftData
import SwiftUI

enum Category: String, Codable, CaseIterable {
    case food = "Food", travel = "Travel", fun = "Fun", other = "Other"
}

@Model
final class Expense {
    var title: String
    var amount: Double
    var category: Category
    var date: Date
    var note: String

    init(title: String, amount: Double, category: Category = .other,
         date: Date = .now, note: String = "") {
        self.title = title
        self.amount = amount
        self.category = category
        self.date = date
        self.note = note
    }
}`),
    P("Properties of simple types, text, numbers, dates, booleans and enums that are `Codable`, are stored automatically. You do not write a table, a schema or any SQL. The `id` is looked after for you."),
    H("Give the app a container"),
    P("A **model container** is the database for your app. You attach it once, at the top, and every view below it can use it."),
    C('swift', S`@main
struct ExpenseTrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ExpenseListView()
        }
        .modelContainer(for: Expense.self)
    }
}`),
    H("Read with @Query, write with modelContext"),
    P("`@Query` loads stored objects into a property and keeps it up to date. When something is added or changed, the view redraws by itself, the same way as with `@State`. To change data you use the **model context**, which the system puts in the environment."),
    C('swift', S`struct ExpenseListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Expense.date, order: .reverse) private var expenses: [Expense]
    @State private var showAdd = false

    var body: some View {
        NavigationStack {
            List {
                ForEach(expenses) { expense in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(expense.title)
                            Text(expense.date, format: .dateTime.day().month())
                                .font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        Text(expense.amount, format: .currency(code: "USD"))
                    }
                }
                .onDelete(perform: delete)
            }
            .overlay {
                if expenses.isEmpty {
                    ContentUnavailableView("No expenses yet", systemImage: "tray",
                        description: Text("Tap + to add your first one."))
                }
            }
            .navigationTitle("Expenses")
            .toolbar {
                Button("Add", systemImage: "plus") { showAdd = true }
            }
            .sheet(isPresented: $showAdd) {
                ExpenseFormView { expense in
                    modelContext.insert(expense)
                }
            }
        }
    }

    private func delete(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(expenses[index])
        }
    }
}`),
    L("`@Query(sort:order:)` fetches and sorts. The path `\\Expense.date` points to the property to sort by.", "`modelContext.insert(_:)` stores a new object, and `modelContext.delete(_:)` removes one. SwiftData saves automatically at sensible moments, and you can call `try modelContext.save()` when you want to be sure.", "Editing is simply changing a property of a stored object, for example `expense.title = \"Dinner\"`. SwiftData notices, and the screen updates.", "`ContentUnavailableView` is the built-in empty state for a screen with nothing to show."),
    N("The form from lesson 9 already builds an `Expense` when the user taps Save and hands it back through `onSave`. Nothing is stored until we call `insert`, so cancelling leaves no half-finished object in the database. Two small changes are needed for the new model: `Expense` is now a class with the `init` shown above, and the `Category` enum must be `Codable`, as written in this lesson. Remove the older `Category` and `Expense` definitions from lesson 8 so the names are not defined twice."),
    H("Filtering"),
    P("A **predicate** says which objects to load. It is written in normal-looking Swift with the `#Predicate` macro. Because the filter value often comes from outside the view, the usual trick is to set the query in the view's `init`."),
    C('swift', S`struct FilteredExpenses: View {
    @Query private var expenses: [Expense]

    init(minimum: Double) {
        _expenses = Query(
            filter: #Predicate<Expense> { $0.amount >= minimum },
            sort: [SortDescriptor(\Expense.amount, order: .reverse)]
        )
    }

    var body: some View {
        List(expenses) { Text($0.title) }
    }
}`),
    H("Previews and testing with a temporary database"),
    P("In previews and tests you do not want to touch real data. Make a container that lives only in memory."),
    C('swift', S`#Preview {
    ExpenseListView()
        .modelContainer(for: Expense.self, inMemory: true)
}`),
    H("Small settings: AppStorage"),
    P("For a single setting, such as a currency code or a dark mode choice, a database is too much. `@AppStorage` keeps a small value in the app's user defaults and acts like `@State`."),
    C('swift', S`@AppStorage("currencyCode") private var currencyCode = "USD"`),
    H("Things to know before you ship"),
    L("**Changing the model later** needs care. Adding a property with a default is usually easy. Renaming or removing one needs a *migration*. While you are learning, deleting the app from the Simulator starts you fresh. Before real users have data, read Apple's notes on schema versions.", "**Money** should use `Decimal` in a real finance app, because `Double` cannot hold some decimal values exactly. We kept `Double` to keep the lessons short.", "**Sync across devices** is possible with iCloud, but it needs extra set-up in your developer account, and we do not cover it here. Services such as Firebase are another route, and many job posts mention them. Learn them after the basics.", "**Core Data** is older and still everywhere in existing apps. Its ideas, a container, a context, fetch requests and saving, map directly to what you just learned."),
    ...task("Change `Expense` to a `@Model` class and add the model container to the app.", "Replace the in-memory array with `@Query`, and make add and swipe to delete work with `modelContext`.", "Close the app completely in the Simulator, open it again, and check that the data is still there.", "Add a screen that shows only expenses above an amount typed in a field, using `#Predicate`."),
    ...check("Your expenses are still there after you restart the app.", "The newest expense is at the top.", "You can say the difference between `@State`, `@Query` and `@AppStorage`."),
  ], A('Saving with SwiftData', [
    n('view', 'SwiftUI view', 'list and form', 0, 0, 'app'), n('ctx', 'modelContext', 'insert, delete', 1, 0, 'tool'),
    n('db', 'Model container', 'stored on the phone', 2, 0, 'store'), n('q', '@Query', 'loads and sorts', 3, 0, 'data'),
  ], [
    { say: 'The user adds an expense in the form.', on: ['view'] },
    { say: 'Your code inserts a new object into the model context.', flow: ['view>ctx:insert'] },
    { say: 'The context saves it into the container, which keeps it on the phone.', flow: ['ctx>db:save'] },
    { say: 'The query reads the stored data back, and the list redraws with the new row.', flow: ['db>q:fetch'] },
  ]), [
    faq('What is SwiftData?', 'Apple\'s modern framework for saving data on the device, written in Swift and designed to work with SwiftUI. It needs iOS 17 or newer and builds on the same storage as Core Data.'),
    faq('Should I learn Core Data or SwiftData?', 'Start with SwiftData for new apps. Core Data is older and still found in many existing apps, and its ideas of container, context and saving are the same.'),
    faq('Why does my data disappear in previews?', 'Previews often use an in-memory container, so nothing is kept. That is intended. Run the app in the Simulator to test real saving.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S6, 'mvvm-observable-and-dependency-injection-in-swiftui', 'MVVM in SwiftUI: @Observable, Dependency Injection and Clean Code', 'MVVM, @Observable and Dependency Injection',
    'Move logic out of views with MVVM, use the Observable macro, inject services through protocols, and meet MVC, VIPER, Clean Architecture and Repository.', [
    P("As an app grows, views fill up with logic: validation, network calls, sorting rules. They become hard to read and impossible to test without a screen. **Architecture** is the set of habits that keeps each piece of code in a sensible place. Interviewers ask about it a lot, and teams use it to keep big apps maintainable. This lesson explains the pattern most SwiftUI teams use, **MVVM**, and then walks through the others you will hear about."),
    H("MVVM in one picture"),
    L("**Model**: the data and its rules. Your structs and `@Model` classes, such as `Expense`.", "**View**: what the user sees. A SwiftUI struct that shows data and sends user actions.", "**ViewModel**: a class in the middle. It holds the state the view needs, and does the work: loads from the network, validates, sorts, and decides what to show."),
    P("The view *reads* the view model and *tells* it what the user did. The view model knows nothing about SwiftUI controls. That makes it easy to test, because a test can create a view model and call its methods with no screen at all."),
    H("@Observable"),
    P("In iOS 17 Apple added the `@Observable` macro. Put it on a class, and SwiftUI watches the properties that a view actually reads. When one of them changes, only the views that used it are redrawn. Before this, you used `ObservableObject` with `@Published` properties and `@StateObject`. You will see that style in older tutorials and code bases, and it relates to the **Combine** framework, Apple's older tool for streams of values over time. New code on iOS 17 and up does not need either of them for this job."),
    C('swift', S`import SwiftUI
import Observation

@MainActor
@Observable
final class WeatherViewModel {
    enum State {
        case idle
        case loading
        case loaded(Weather)
        case failed(String)
    }

    private(set) var state: State = .idle
    private let service: any WeatherServing

    init(service: any WeatherServing) {
        self.service = service
    }

    func load(latitude: Double, longitude: Double) async {
        state = .loading
        do {
            let weather = try await service.fetch(latitude: latitude, longitude: longitude)
            state = .loaded(weather)
        } catch {
            state = .failed("Could not load the weather. Check your connection.")
        }
    }
}`),
    P("`@MainActor` from lesson 10 makes sure this class changes the screen's data on the main thread. `private(set)` means the view can read `state` but only the view model can change it. And the `service` arrives through the `init`, which brings us to the second big idea."),
    H("Dependency injection"),
    P("**Dependency injection** sounds grand and means something simple: *a type receives the things it needs from outside, and does not create them itself.* The view model above does not write `WeatherService()` inside. It asks for something that can fetch weather. We describe that ability with a protocol, from lesson 4."),
    C('swift', S`protocol WeatherServing {
    func fetch(latitude: Double, longitude: Double) async throws -> Weather
}

// the real one from lesson 11
extension WeatherService: WeatherServing {}

// a fake one for previews and tests
struct FakeWeatherService: WeatherServing {
    var result: Result<Weather, Error>

    func fetch(latitude: Double, longitude: Double) async throws -> Weather {
        try result.get()
    }
}`),
    P("Now the view model works with any type that meets the protocol. In the real app you give it the real service. In a preview you give it a fake one that answers at once with sample data, with no internet. In a test you give it a fake that fails on purpose, to check your error handling. This is the main practical reason for the whole idea."),
    H("Using the view model in a view"),
    C('swift', S`struct WeatherScreen: View {
    @State private var viewModel: WeatherViewModel

    init(service: any WeatherServing = WeatherService()) {
        _viewModel = State(initialValue: WeatherViewModel(service: service))
    }

    var body: some View {
        VStack(spacing: 16) {
            switch viewModel.state {
            case .idle, .loading:
                ProgressView()
            case .loaded(let weather):
                Text("\(weather.current.temperature, specifier: "%.1f")")
                    .font(.largeTitle)
            case .failed(let message):
                Text(message)
                Button("Try again") {
                    Task { await viewModel.load(latitude: 52.52, longitude: 13.41) }
                }
            }
        }
        .task { await viewModel.load(latitude: 52.52, longitude: 13.41) }
    }
}`),
    N("If Xcode complains about main-actor isolation in the view's `init` (newer Xcode versions are stricter), mark the view's `init` or the whole view `@MainActor`. The message names the line, and the fix is one word."),
    P("With an `@Observable` class, the view keeps it in `@State`, so that SwiftUI creates it once and keeps it alive. For something shared by many screens, such as the logged-in user or app settings, you can put the object in the **environment** with `.environment(settings)` at the top, and read it in any view with `@Environment(Settings.self)`."),
    H("The other names you will hear"),
    L("**MVC** (Model View Controller): Apple's original pattern for UIKit. The view controller often grew huge, which gave rise to the joke name *Massive View Controller*. MVVM was partly a reaction to it.", "**VIPER** (View, Interactor, Presenter, Entity, Router): splits an app into many small pieces with strict roles. It brings a lot of files, so you see it in some large UIKit teams.", "**Clean Architecture**: arranges code in layers, so that business rules do not depend on screens, databases or the network.", "**Coordinator pattern**: one object decides which screen comes next, so that screens do not know about each other. Popular in UIKit. SwiftUI's `NavigationStack` covers much of this need.", "**Repository pattern**: one type is the single place to get and save a kind of data. The view model asks the repository, and does not care whether the data comes from the network, a file or the database.", "**SOLID**: five design habits, such as *one reason to change per type* and *depend on protocols, not on concrete types*. What you did with `WeatherServing` is one of them."),
    N("Do not over-build. A small app with a few screens does not need five layers. For simple screens, `@Query` straight in a view is fine, and Apple's own examples do it. Add a view model when a screen has real logic or needs tests. The skill that interviewers look for is knowing *why* you choose a structure, and not how many layers you can draw."),
    H("Common mistakes"),
    L("Creating the service inside the view model, which makes tests need the real network.", "Passing the whole view model to every small child view. Pass just the values and closures the child needs.", "Making a view model that imports SwiftUI types, such as `Color`, which ties logic to the screen."),
    ...task("Move the networking logic of `WeatherView` into `WeatherViewModel`.", "Add the `WeatherServing` protocol and a `FakeWeatherService`.", "Use the fake in a `#Preview` so that it shows a temperature with no internet.", "Write down, in your own words, three things MVVM gives you and one case where it would be too much."),
    ...check("The app works as before, and the preview works without a network.", "The view does not contain any call to `URLSession`.", "You can explain dependency injection in one sentence, with the weather example."),
  ], A('MVVM and injection', [
    n('view', 'View', 'shows state', 0, 0, 'app'), n('vm', 'ViewModel', '@Observable class', 1, 0, 'tool'),
    n('proto', 'Protocol', 'WeatherServing', 2, 0, 'check'), n('impl', 'Real or fake', 'swapped in', 3, 0, 'store'),
  ], [
    { say: 'The view shows the state and tells the view model what the user did.', on: ['view'] },
    { say: 'The view model holds the state and the logic, with no SwiftUI controls inside.', flow: ['view>vm:actions'] },
    { say: 'It talks to its service only through a protocol, so it does not know which one it has.', flow: ['vm>proto:calls'] },
    { say: 'The app gives it the real service. Previews and tests give it a fake one.', flow: ['proto>impl:injected'] },
  ]), [
    faq('What is MVVM in SwiftUI?', 'A way to split an app: the model holds data and rules, the view shows it, and the view model sits between them with the state and logic. It makes logic easy to test without a screen.'),
    faq('What is the difference between @Observable and ObservableObject?', '@Observable is the newer macro for iOS 17 and up. Views redraw only for the properties they read. ObservableObject with @Published is the older approach that you will still see in many code bases.'),
    faq('What is dependency injection?', 'A type receives what it needs from outside instead of creating it. With a protocol, you can inject a real service in the app and a fake one in previews and tests.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S6, 'testing-ios-apps-swift-testing-xctest-and-xcuitest', 'Testing iOS Apps: Swift Testing, XCTest and XCUITest', 'Testing iOS Apps: Swift Testing and XCTest',
    'Write unit tests with Swift Testing and XCTest, test a view model with a fake service, automate taps with XCUITest, and learn what Quick and Nimble are.', [
    P("A test is a small program that runs your code and checks the result. You write it once, and it checks again every time you change something. Tests do not remove all bugs. They catch the ones that would come back, and they let you change code without fear. Employers value them because they show you can work on code other people depend on."),
    H("What kinds of tests there are"),
    L("**Unit tests** check a small piece of logic, such as a validation rule or a view model, with no screen.", "**UI tests** drive the real app like a user: launch, tap, type and look at what appears. They are slower, so write fewer of them for the main flows.", "**Manual testing** still matters, on real phones, with different text sizes and with no network."),
    P("In Xcode, tick **Include Tests** when you create a project, or add a **Unit Testing Bundle** target to an existing one. You run tests with Command and U, or with the small diamond next to a test. A green mark means it passed."),
    H("Swift Testing"),
    P("**Swift Testing** is Apple's newer test framework, available from Xcode 16. A test is a function with `@Test`. You check values with `#expect`. If an expectation is false, the test fails and the message shows both sides."),
    C('swift', S`import Testing
@testable import ExpenseTracker

// These two already live in your app from lesson 5. They are repeated here so the tests make sense.
// Make one change there: add Equatable to ExpenseError, as below. Do not define them twice.
enum ExpenseError: Error, Equatable {
    case emptyTitle
    case invalidAmount(Double)
}

func makeExpense(title: String, amount: Double) throws -> Expense {
    guard !title.trimmingCharacters(in: .whitespaces).isEmpty else { throw ExpenseError.emptyTitle }
    guard amount > 0 else { throw ExpenseError.invalidAmount(amount) }
    return Expense(title: title, amount: amount)
}

struct ExpenseValidationTests {
    @Test func acceptsValidInput() throws {
        let expense = try makeExpense(title: "Lunch", amount: 8.5)
        #expect(expense.title == "Lunch")
        #expect(expense.amount == 8.5)
    }

    @Test func rejectsEmptyTitle() {
        #expect(throws: ExpenseError.emptyTitle) {
            try makeExpense(title: "   ", amount: 5)
        }
    }

    @Test(arguments: [0.0, -1, -50.5])
    func rejectsBadAmounts(amount: Double) {
        #expect(throws: ExpenseError.invalidAmount(amount)) {
            try makeExpense(title: "Tea", amount: amount)
        }
    }
}`),
    L("`@testable import` lets tests see your app's internal code. Use your own app's module name.", "`#expect(throws:)` checks that a call throws the error you expect.", "`@Test(arguments:)` runs the same test once for each value, which keeps the list of cases in one place.", "A test that throws is a failed test, so mark such tests `throws`."),
    H("Testing a view model with a fake"),
    P("This is where the work of lesson 13 pays off. We give the view model a fake service that fails, and check that the state becomes `failed`."),
    C('swift', S`import Testing
@testable import ExpenseTracker

struct FailingWeatherService: WeatherServing {
    struct Boom: Error {}
    func fetch(latitude: Double, longitude: Double) async throws -> Weather {
        throw Boom()
    }
}

@MainActor
struct WeatherViewModelTests {
    @Test func showsAFriendlyErrorWhenTheServiceFails() async {
        let viewModel = WeatherViewModel(service: FailingWeatherService())

        await viewModel.load(latitude: 0, longitude: 0)

        guard case .failed(let message) = viewModel.state else {
            Issue.record("Expected the failed state")
            return
        }
        #expect(message.contains("Could not load"))
    }
}`),
    P("The test never touches the internet, so it is fast and always gives the same result. That is what you want from a unit test. `Issue.record` fails the test with a message of your choice."),
    H("XCTest"),
    P("**XCTest** is the older framework, and it is still everywhere. Test classes inherit from `XCTestCase`, and every method whose name starts with `test` runs. You check values with functions such as `XCTAssertEqual`. UI tests use XCTest too. Expect to read both styles in jobs, and the same ideas apply."),
    C('swift', S`import XCTest
@testable import ExpenseTracker

final class TotalTests: XCTestCase {
    func testTotalOfAmounts() {
        let amounts = [12.5, 40, 7.25]
        XCTAssertEqual(amounts.reduce(0, +), 59.75, accuracy: 0.001)
    }

    func testMakeExpenseRejectsZero() {
        XCTAssertThrowsError(try makeExpense(title: "Tea", amount: 0))
    }
}`),
    N("Comparing decimal numbers needs an *accuracy* value, as above, because decimal arithmetic on computers is not always exact. The same is true in many languages."),
    H("XCUITest: testing like a user"),
    P("Add a **UI Testing Bundle** target. A UI test launches your app in a separate process and finds controls by their label or by an **accessibility identifier**, a name you give to a view so tests, and assistive tools, can find it."),
    C('swift', S`// in the view
Button("Add", systemImage: "plus") { showAdd = true }
    .accessibilityIdentifier("addExpenseButton")

// in the UI test target
import XCTest

final class ExpenseUITests: XCTestCase {
    func testAddingAnExpense() {
        let app = XCUIApplication()
        app.launch()

        app.buttons["addExpenseButton"].tap()
        let title = app.textFields["Title"]
        title.tap()
        title.typeText("Coffee")
        app.buttons["Save"].tap()

        XCTAssertTrue(app.staticTexts["Coffee"].waitForExistence(timeout: 3))
    }
}`),
    P("UI tests can be slow and a little fragile, so keep them for your most important paths, such as signing in or adding the main item. For these tests you often want a clean, known state, for example an in-memory database from lesson 12 and a fake service. A common trick is to pass a launch argument that tells the app to use them."),
    H("Quick and Nimble, and what to do first"),
    P("**Quick** and **Nimble** are third-party libraries that offer a more descriptive style of test, `describe` and `it`, which some teams like. You do not need them. Learn Swift Testing and XCTest first, because they come from Apple and every project can use them."),
    H("A sensible testing habit"),
    L("Test logic that could go wrong: validation, calculations, view models, parsing JSON.", "Do not test that SwiftUI draws a `Text`. That is Apple's job.", "Name tests as sentences, such as `rejectsEmptyTitle`. A failure then explains itself.", "When you find a bug, write a failing test first, fix the code, and keep the test."),
    ...task("Add a test target if your project has none. Write the three validation tests above.", "Write a test that checks the total of three expenses.", "Write the failing-service test for your view model.", "Write one UI test that adds an expense. Give the button and fields accessibility identifiers."),
    ...check("All tests pass with Command and U. Change an expected value on purpose and see one fail with a clear message.", "No unit test uses the real network.", "You can say when to write a unit test and when a UI test."),
  ], A('A test run', [
    n('test', 'Test', '@Test or XCTest', 0, 0, 'check'), n('code', 'Your code', 'view model, rules', 1, 0, 'app'),
    n('fake', 'Fake service', 'no network', 1, 1, 'store'), n('res', 'Pass or fail', 'green or red', 2, 0, 'out'),
  ], [
    { say: 'A test creates your code, such as a view model, with the inputs you choose.', flow: ['test>code:create'] },
    { say: 'It hands the code a fake service, so nothing real is called and the result is always the same.', flow: ['fake>code:injected'] },
    { say: 'The test runs one action and compares the result with what you expect.', flow: ['code>res:expect'] },
    { say: 'Xcode shows green when it matches and a clear message when it does not.', on: ['res'] },
  ]), [
    faq('What is the difference between Swift Testing and XCTest?', 'Swift Testing is Apple\'s newer framework from Xcode 16, using @Test and #expect. XCTest is the older one with XCTestCase and XCTAssert functions. Both are in use, and UI tests still use XCTest.'),
    faq('What should I unit test in an iOS app?', 'Logic that can go wrong: validation, calculations, view models and JSON parsing. Do not test that SwiftUI draws basic views.'),
    faq('Why use an accessibility identifier?', 'It gives a view a stable name so UI tests, and assistive tools, can find it, even if its visible text changes or is translated.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S7, 'testflight-app-store-uikit-and-ios-interview-preparation', 'Publish Your iOS App: TestFlight, App Store, CI/CD and Interviews', 'Publish an iOS App: TestFlight, App Store',
    'Prepare an app for release, send it to testers with TestFlight, submit it to the App Store, learn what UIKit, Instruments and CI/CD do, and plan a portfolio.', [
    P("You now know the language, the screens, the data and the testing. The last step is the one many learners skip: getting the app to other people. This lesson covers the road to the App Store, the tools you will hear about at work, and how to turn this course into something an employer can see. The rules and prices of Apple's programs change, so for each step we tell you what to look for and where, and not a number that may be out of date."),
    H("Before you ship"),
    L("**Name, icon and identity.** Choose a name. Add an app icon in `Assets.xcassets`. Check the **bundle identifier**, a unique name such as `com.yourname.expensetracker`.", "**Versions.** Each release has a *version* (for example 1.0) and a *build number* that must go up with every upload.", "**Quality.** Test on a real device if you can, with different text sizes, Dark Mode, no network, and a small screen.", "**Privacy.** If your app collects data, you need a privacy policy at a web address and honest answers in App Store Connect about what you collect. Apple also asks for details about some system features your code or libraries use, so read Apple's current privacy requirements before you submit.", "**No hidden secrets.** Remove test keys, passwords and debug screens."),
    H("The Apple Developer Program"),
    P("To put an app on the App Store, and to use TestFlight with outside testers, you join the **Apple Developer Program**. It has a yearly fee, and you pay Apple. Check Apple's developer website for the current price, the list of countries and what a free account can and cannot do. In Xcode, open **Settings > Accounts**, add your Apple ID, and in your project choose your **Team** under *Signing & Capabilities*. Xcode can manage the signing certificates for you, which removes a lot of the old pain."),
    H("TestFlight: beta testing"),
    O("In Xcode choose a generic iOS device as the destination, then **Product > Archive**.", "When the archive is ready, open the **Organizer**, choose **Distribute App** and send it to **App Store Connect**.", "In **App Store Connect**, Apple's website for your apps, open the app's **TestFlight** tab. Your build appears after Apple has processed it.", "Add **internal testers**, people on your own team, who can try the build quickly. For **external testers**, such as friends or a small group, the first build normally goes through a short beta review by Apple, then you can invite people by email or by a public link.", "Testers install the free TestFlight app, try your build and send feedback and crash reports."),
    H("The App Store"),
    L("In App Store Connect create the **app record**: name, subtitle, description, keywords, category, support address and privacy policy address.", "Add **screenshots** for the device sizes that Apple asks for. Apple lists the sizes in the tool.", "Choose the build, answer the age rating and privacy questions, and **submit for review**.", "A human and some automated checks review your app against Apple's **App Review Guidelines**. Read them before you start. Many rejections are about incomplete information, crashes or unclear descriptions, and you can fix them and resubmit. Review times vary."),
    N("We cannot promise how long review takes or that an app will be approved. Apple decides, and its rules change. Read the current guidelines on Apple's developer website and keep your first app small and honest."),
    H("CI/CD: building automatically"),
    P("**Continuous integration and delivery** means that a server builds and tests your app every time you push code, and can even upload builds for you. Names you will see in job posts:"),
    L("**Xcode Cloud**: Apple's own service, built into Xcode and App Store Connect. Check Apple's current plans for any free allowance.", "**GitHub Actions**: workflows in your repository that can run on macOS machines. Our Git course shows how GitHub works.", "**Bitrise** and similar services: hosted build services made for mobile apps.", "**Fastlane**: a tool of scripts that automates screenshots, signing, builds and uploads. It often runs inside the services above."),
    P("As a beginner it is enough to set up one workflow that builds the app and runs your tests on every push. That is a strong thing to show."),
    H("Instruments and debugging"),
    P("**Instruments** is a profiler that comes with Xcode. Use it when an app is slow or uses too much memory. The *Time Profiler* shows where the time goes, and *Leaks* shows memory that was never released. Also learn Xcode's **debugger**: set a breakpoint by clicking the line number, run, and look at the values when the code stops. It is faster than printing."),
    H("UIKit: the older toolkit you will still meet"),
    P("Many established companies have apps built with **UIKit**, with screens called *view controllers*, often laid out with **Auto Layout** rules or in **Interface Builder** (storyboards). You do not need it to start, but job posts often ask for it. The two toolkits mix. You can show a SwiftUI view inside UIKit with `UIHostingController`, and a UIKit view inside SwiftUI with `UIViewRepresentable`. A good plan is: after this course, build one small app in UIKit so you understand view controllers, the life cycle and table views, which are the ancestors of `List`."),
    C('swift', S`import UIKit
import SwiftUI

final class HostingExample: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let host = UIHostingController(rootView: WeatherScreen())
        addChild(host)
        host.view.frame = view.bounds
        host.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(host.view)
        host.didMove(toParent: self)
    }
}`),
    H("Turn this course into a portfolio"),
    L("**Expense Tracker**: SwiftUI, SwiftData, a chart (Apple's Charts framework), tests. You built the base in this course.", "**Weather app**: REST API, Core Location, loading and error states.", "**E-commerce app**: list and detail screens, a cart, sign-in. Use a free fake store API or your own server.", "**AI chat app**: call your own server that calls a language model, stream the answer into SwiftUI. Never put the model key in the app.", "Put each project on GitHub with a clear README, screenshots and notes on what you decided and why. Anything you can put on TestFlight or the App Store is stronger still."),
    P("When you are ready to apply, build your resume with our [resume builder](/app) and check it with the [ATS checker](/features/ats-checker). Practise questions on the [interview questions page](/jobs/interview-questions). Look at the [roadmaps](/roadmaps) for what to add next, and use our [Git and GitHub course](/learn/git-and-github-course) for the version-control habits that every team expects."),
    H("What to learn next, in order"),
    O("Keep building: one more app each month, a little bigger each time.", "Add what job posts ask for: UIKit basics, Combine or more Swift Concurrency, Core Location and Maps, notifications, StoreKit for in-app purchases.", "Learn to read other people's code, and contribute a small fix to an open-source app.", "Practise explaining your choices aloud: why a struct, why MVVM, why this data layer."),
    P("No course can promise a job. What helps is steady practice, a few finished and published projects, and being able to explain them. You have the base for all three."),
    ...task("Give your Expense Tracker a name, an icon and a bundle identifier. Write a short privacy note that states what data the app keeps (for example, only on the device).", "Join the Apple Developer Program if you want to publish, or skip this step if you only want to learn. Then archive the app and upload it to App Store Connect.", "Invite one friend as a TestFlight tester, or install on your own device. Write down two things they found.", "Push the project to GitHub with a README and screenshots, and write the three things you would improve next."),
    ...check("Your project builds from a clean checkout.", "You can list the steps from Archive to TestFlight to App Review in your own words.", "You can explain, in a minute, what your app does and one hard decision you made."),
  ], A('From Xcode to a phone', [
    n('xc', 'Xcode', 'Product > Archive', 0, 0, 'tool'), n('asc', 'App Store Connect', 'upload and set up', 1, 0, 'store'),
    n('tf', 'TestFlight', 'testers try it', 2, 0, 'user'), n('as', 'App Store', 'after review', 3, 0, 'out'),
  ], [
    { say: 'In Xcode you archive the app. It is signed with your team.', on: ['xc'] },
    { say: 'You upload the build to App Store Connect, Apple\'s website for your apps.', flow: ['xc>asc:upload'] },
    { say: 'TestFlight sends the build to testers, who send feedback and crash reports.', flow: ['asc>tf:beta'] },
    { say: 'When you are happy, you submit for review. If it is approved, the app goes on the App Store.', flow: ['tf>as:release'] },
  ]), [
    faq('Do I need to pay to publish an iOS app?', 'Yes, publishing on the App Store needs the paid Apple Developer Program. Check Apple\'s developer website for the current fee and what a free account can do, because they change.'),
    faq('What is TestFlight?', 'Apple\'s tool for sending beta builds of your app to testers, who install it through the TestFlight app and send feedback and crash reports.'),
    faq('Do I need to learn UIKit as well as SwiftUI?', 'Not at the start, but many companies still have UIKit apps, so it is worth learning after SwiftUI. The two can be mixed in one app.'),
  ]),
];
