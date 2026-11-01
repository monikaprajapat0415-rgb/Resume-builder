import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

// String.raw keeps Swift's backslash-parenthesis interpolation and key paths exactly as written.
const S = String.raw;
const S1 = 'Advanced Swift';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'swift-generics-protocol-oriented-programming-and-property-wrappers', 'Advanced Swift: Generics, Protocols and Property Wrappers', 'Swift Generics and Property Wrappers',
    'Write reusable Swift with generics and constraints, protocols with associated types, protocol extensions, some and any, and your own property wrappers.', [
    P("This course is for people who finished the beginner iOS course, or who already build small apps and want to work at the level a team expects. We start with the language, because most advanced iOS problems turn out to be language problems: how to write code once that works for many types, how to hide a repeated rule behind a clean name, and how to keep code safe when it grows. Lesson 1 covers the four tools that Apple's own frameworks use everywhere, and that interviewers ask about: generics, protocols with associated types, protocol extensions and property wrappers."),
    H("Generics: one function, many types"),
    P("A **generic** function or type works with a placeholder type, written in angle brackets, instead of one fixed type. Swift fills in the real type at each use and checks it fully, so you get reuse without losing safety. You have already used generics without noticing: `[Expense]` is `Array<Expense>`, and `Optional<Int>` is `Int?`."),
    C('swift', S`func largest<T: Comparable>(in items: [T]) -> T? {
    items.max()
}

print(largest(in: [3, 9, 4]) ?? 0)          // 9
print(largest(in: ["pear", "apple"]) ?? "") // pear

struct Stack<Element> {
    private var items: [Element] = []

    mutating func push(_ item: Element) { items.append(item) }
    mutating func pop() -> Element? { items.popLast() }
    var top: Element? { items.last }
}

extension Stack where Element: Equatable {
    func contains(_ item: Element) -> Bool { items.contains(item) }
}`),
    P("`T: Comparable` is a **constraint**: it says *T can be any type, as long as it can be compared*. Without it, the compiler would not let `max()` compile, because it cannot know that two Ts can be ordered. The `where Element: Equatable` extension adds `contains` only for stacks whose elements can be compared for equality, so a `Stack<Int>` gets it and a stack of non-equatable things does not."),
    H("Protocols with associated types"),
    P("A plain protocol lists methods. A protocol can also name a placeholder type of its own, called an **associated type**. This is how you describe a *kind of thing that works with some type*, such as a repository that stores some kind of item."),
    C('swift', S`protocol Repository {
    associatedtype Item
    func all() async throws -> [Item]
    func save(_ item: Item) async throws
}

actor InMemoryRepository<Item: Sendable>: Repository {
    private var items: [Item] = []
    func all() -> [Item] { items }
    func save(_ item: Item) { items.append(item) }
}

func countItems<R: Repository>(in repository: R) async throws -> Int {
    try await repository.all().count
}`),
    P("The same protocol can be met by an in-memory version for tests, a SwiftData version for the app and a network version for a server, and `countItems` works with all of them. This is the heart of the *depend on protocols* idea from the first course, now with types that vary."),
    H("some and any"),
    L("`some Repository` means *one specific type that I do not name, but the compiler knows*. SwiftUI's `some View` is the same idea. It is fast, because the real type is known at build time. A function that returns `some` must return one type from every path.", "`any Repository` means *a box that can hold any type that meets the protocol*, and the real type is found at run time. It is more flexible, since you can put different types in one array, and a little slower. Swift 5.7 and later allow `any` with protocols that have associated types.", "As a habit: use generics or `some` first, and use `any` when you really need to store different types together."),
    H("Protocol extensions: free behaviour"),
    P("You can give every type that meets a protocol a ready-made method, by writing an extension on the protocol. Types may use it as it is, or write their own. Swift calls this style **protocol-oriented programming**. It is the reason that so much of the standard library comes with free helpers."),
    C('swift', S`protocol Describable {
    var name: String { get }
}

extension Describable {
    var summary: String { "This is \(name)" }
}

struct Category: Describable { let name: String }
struct Account: Describable {
    let name: String
    var summary: String { "Account \(name) (custom)" }
}

print(Category(name: "Food").summary)   // This is Food
print(Account(name: "Cash").summary)    // Account Cash (custom)`),
    N("A subtle trap: if a method is only in the protocol *extension* and not in the protocol itself, Swift picks it by the *declared* type, and not by the real one. If a type is stored in a variable of the protocol type, the custom version is not called. List the method in the protocol itself when you want types to be able to replace it."),
    H("Property wrappers"),
    P("A **property wrapper** moves the get and set rules of a property into a reusable type. You have used several: `@State`, `@Binding`, `@AppStorage`, `@Query`. Writing your own lets you hide a repeated rule, such as keeping a value in a range."),
    C('swift', S`@propertyWrapper
struct Clamped<Value: Comparable> {
    private var value: Value
    private let range: ClosedRange<Value>

    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }

    var wrappedValue: Value {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }
}

struct Review {
    @Clamped(1...5) var stars = 3
}

var review = Review()
review.stars = 9
print(review.stars)   // 5`),
    P("A wrapper may also offer a `projectedValue`, which you reach with a dollar sign. That is why `$title` gives a binding for `@State`: the `State` wrapper projects a `Binding`. Another feature you meet through SwiftUI is the **result builder**, written `@resultBuilder`. It lets many lines inside braces become one value, which is how a `VStack { ... }` collects its children. You rarely write one, and it helps to know where the magic comes from."),
    H("Key paths"),
    P("A **key path** is a reference to a property, without reading it, written with a backslash: `\\Expense.amount`. They are used by `@Query(sort:)` and by many APIs, and they can stand in for a closure, as in `expenses.map(\\.amount)`."),
    H("Common mistakes"),
    L("Over-generic code. If only one type will ever use a function, a generic only makes it harder to read. Reach for generics when you have a second real use.", "Using `any` everywhere out of habit, and losing the speed and clarity of generics.", "A property wrapper that hides work a reader would be surprised by. Keep wrappers small and obvious."),
    ...task("Write a generic `Stack<Element>` with `push`, `pop` and `top`, and test it with `Int` and `String`.", "Add a `Repository` protocol and two types that meet it: an actor with an array, and one that stores to a dictionary by an `id`.", "Write a `@Trimmed` property wrapper that removes spaces at both ends of a `String` every time it is set.", "Use `map(\\.amount)` and `sorted { $0.amount > $1.amount }` on an array of expenses, and write one sentence on what a key path is."),
    ...check("`largest(in:)` works for `Int` and `String` and returns `nil` for an empty array.", "Setting `review.stars = 9` ends at 5, and your `@Trimmed` property removes spaces.", "You can say, in your own words, the difference between `some` and `any`."),
  ], A('One function, many types', [
    n('t', 'Generic T', 'a placeholder', 0, 0, 'data'), n('c', 'Constraint', 'T: Comparable', 1, 0, 'check'),
    n('int', 'Int version', 'checked at build', 2, 0, 'app'), n('str', 'String version', 'same code', 2, 1, 'tool'),
  ], [
    { say: 'A generic function is written once, with a placeholder type such as T.', on: ['t'] },
    { say: 'A constraint says what T must be able to do, for example be compared.', flow: ['t>c:limits'] },
    { say: 'Swift fills in Int where you call it with numbers, and checks every use.', flow: ['c>int:Int'] },
    { say: 'The same code also works for String, with no copy and no loss of safety.', flow: ['c>str:String'] },
  ]), [
    faq('What is the difference between some and any in Swift?', 'some means one specific type that the compiler knows but you do not name. any means a box that can hold any type meeting the protocol, decided at run time. Prefer some or generics, and use any when you must mix types.'),
    faq('What is an associated type?', 'A placeholder type named inside a protocol, such as the Item a Repository stores. Each type that meets the protocol decides what the real type is.'),
    faq('What is a property wrapper?', 'A type that moves the get and set rules of a property into a reusable form. @State, @Binding and @AppStorage are property wrappers, and you can write your own.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'advanced-swift-concurrency-taskgroup-asyncstream-sendable', 'Advanced Swift Concurrency: TaskGroup, AsyncStream and Sendable', 'Swift Concurrency: TaskGroup, AsyncStream',
    'Run many tasks with TaskGroup, cancel work correctly, turn events into AsyncStream, and understand Sendable and strict concurrency in current Xcode versions.', [
    P("The beginner course taught `async`, `await`, `Task` and actors. In real apps you also need to run a *variable* number of jobs at once, stop work that nobody wants any more, turn callbacks and events into a sequence you can loop over, and satisfy the compiler's checks for data races. These are the topics here, and they are all common in senior interviews."),
    H("TaskGroup: a variable number of tasks"),
    P("`async let` is fine when you know how many calls there are. When you have a list, such as one request per account, use a **task group**. You add one child task per item. Child tasks run at the same time, and you collect results as they finish."),
    C('swift', S`func fetchTotal(_ id: Int) async throws -> Double {
    try await Task.sleep(for: .milliseconds(100))
    return Double(id) * 10
}

func totals(for ids: [Int]) async throws -> [Int: Double] {
    try await withThrowingTaskGroup(of: (Int, Double).self) { group in
        for id in ids {
            group.addTask { (id, try await fetchTotal(id)) }
        }
        var result: [Int: Double] = [:]
        for try await (id, total) in group {
            result[id] = total
        }
        return result
    }
}`),
    L("Results arrive in the order that tasks **finish**, and not the order you added them, so key them by an id, as above.", "If one child throws, the group is cancelled and the error comes out of the `for try await` loop.", "Do not start thousands of network calls at the same moment. Add a limit by starting a few tasks first and adding the next one each time one finishes."),
    H("Cancellation is cooperative"),
    P("Cancelling a task does not stop it by force. It sets a flag, and the task must **look at the flag** and stop itself. Most Apple async APIs, such as `Task.sleep` and `URLSession`, check the flag for you and throw `CancellationError`. In your own long loops, check on purpose."),
    C('swift', S`func processAll(_ items: [Int]) async throws -> Int {
    var done = 0
    for item in items {
        try Task.checkCancellation()   // throws if the task was cancelled
        _ = item * 2                   // pretend this is real work
        done += 1
    }
    return done
}

let task = Task { try await processAll(Array(0..<1_000_000)) }
task.cancel()`),
    P("A very common real use is **search as you type**. Each key press cancels the previous search task and starts a new one after a short pause, so only the last word is searched."),
    C('swift', S`struct SearchView: View {
    @State private var query = ""
    @State private var results: [String] = []
    @State private var searchTask: Task<Void, Never>?

    var body: some View {
        List(results, id: \.self) { Text($0) }
            .searchable(text: $query)
            .onChange(of: query) { _, newValue in
                searchTask?.cancel()
                searchTask = Task {
                    try? await Task.sleep(for: .milliseconds(300))
                    guard !Task.isCancelled else { return }
                    results = await search(newValue)
                }
            }
    }

    func search(_ text: String) async -> [String] {
        ["\(text) one", "\(text) two"]   // replace with a real call
    }
}`),
    H("AsyncStream: events as a sequence"),
    P("An **AsyncSequence** is like an array whose items arrive over time. You loop over it with `for await`. `AsyncStream` lets you make one from your own source, such as a timer, a location update or an old delegate callback. You `yield` values into it, and `finish` when there are no more."),
    C('swift', S`func ticks(every seconds: Double) -> AsyncStream<Int> {
    AsyncStream { continuation in
        let task = Task {
            var count = 0
            while !Task.isCancelled {
                continuation.yield(count)
                count += 1
                try? await Task.sleep(for: .seconds(seconds))
            }
            continuation.finish()
        }
        continuation.onTermination = { _ in task.cancel() }
    }
}

// somewhere async:
for await tick in ticks(every: 1) {
    print("tick", tick)
    if tick == 3 { break }    // leaving the loop ends the stream
}`),
    P("The `onTermination` closure cleans up when the reader stops, so the timer task does not run forever. The same idea turns a callback-based API, such as a location manager delegate, into a clean stream."),
    H("Sendable and strict concurrency"),
    P("A type is **Sendable** when it is safe to pass between tasks, because nothing can be changed by two places at once. Value types made of Sendable parts, such as simple structs and enums, are Sendable. Actors are Sendable. A class is only Sendable if it is `final` and its stored properties are immutable (or protected). The compiler uses this to find data races *before* the app runs."),
    C('swift', S`struct Receipt: Sendable {      // a struct of simple values
    let id: UUID
    let total: Double
}

final class AppConfig: Sendable {   // final class, immutable properties
    let baseURL: URL
    init(baseURL: URL) { self.baseURL = baseURL }
}`),
    N("Swift 6 turned many of these checks from warnings into errors, if you choose the Swift 6 language mode, and recent Xcode versions add settings such as running code on the main actor by default in new projects. The details change between Xcode releases. A safe way to move an existing app: leave the language mode alone, turn on the extra checks one setting at a time in Build Settings, fix the warnings of one module at a time, and read Apple's migration guide for your Xcode version. Do not silence the checks with `@unchecked Sendable` unless you can explain why the type is really safe."),
    H("Actors: two more things to know"),
    L("**Reentrancy:** when an actor method hits an `await`, other calls can run on the same actor before it continues. So state read before the `await` may have changed after it. Check again after the `await` when it matters.", "**Global actors:** `@MainActor` is the one you know. You can make your own, but you rarely need to.", "**`nonisolated`:** marks an actor member that does not touch the actor's data, so it can be called without `await`."),
    H("Common mistakes"),
    L("Starting a `Task` and forgetting to keep a reference, so it cannot be cancelled later.", "Long loops that never check for cancellation.", "Reading actor state before an `await` and trusting it after.", "Using `@unchecked Sendable` to make a warning go away."),
    ...task("Write `totals(for:)` and call it with ten ids. Print the dictionary.", "Make the search-as-you-type view, replace `search` with a function that waits for 200 ms, and watch earlier searches get cancelled.", "Write `ticks(every:)` and read it with `for await`. Break after five ticks and confirm the timer task stops.", "Make a struct and a final class that are `Sendable`, and write what would break if the class had a `var` property."),
    ...check("The group returns all ids even though tasks finish in a different order.", "Typing quickly in the search box runs only the last search to the end.", "You can explain what cooperative cancellation means and name one API that checks for it for you."),
  ], A('A task group', [
    n('p', 'Parent task', 'withTaskGroup', 0, 0, 'app'), n('a', 'Child task 1', 'runs at once', 1, 0, 'tool'),
    n('b', 'Child task 2', 'runs at once', 1, 1, 'tool'), n('r', 'Results', 'in finish order', 2, 0, 'out'),
  ], [
    { say: 'The parent opens a task group and adds one child task for each item.', on: ['p'] },
    { say: 'The child tasks run at the same time instead of one after another.', flow: ['p>a:addTask', 'p>b:addTask'] },
    { say: 'Results come back in the order the tasks finish, so key each one by an id.', flow: ['a>r:done', 'b>r:done'] },
    { say: 'If one child throws, the group is cancelled and the parent gets the error.', on: ['r'] },
  ]), [
    faq('What is the difference between async let and a TaskGroup?', 'async let suits a fixed, small number of calls you can write out. A task group suits a list of any length, where you add one child task for each item and gather the results.'),
    faq('Does cancelling a Swift task stop it immediately?', 'No. Cancellation sets a flag and the task must check it. Many Apple APIs check for you and throw CancellationError. In your own loops, call Task.checkCancellation().'),
    faq('What does Sendable mean?', 'It marks a type that is safe to pass between tasks without data races. Simple value types and actors are Sendable, and classes must be final with immutable properties.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'swift-memory-management-arc-retain-cycles-and-instruments', 'Swift Memory Management: ARC, Retain Cycles and weak self', 'Swift ARC, Retain Cycles and weak self',
    'Understand how ARC counts references to classes, spot and break retain cycles with weak and unowned, use capture lists, and find leaks with Instruments.', [
    P("Swift manages memory for you, but not by magic. For **classes**, and for closures, it uses **Automatic Reference Counting**, or ARC. When your code does not follow its rules, the app **leaks** memory: objects that are never freed, so the app grows slowly until the system closes it. Memory questions are among the most common in iOS interviews, and leaks are among the most common real bugs, so the topic is worth an hour of care."),
    H("How ARC works"),
    P("Each class instance has a counter of how many *strong* references point at it. When the counter reaches zero, Swift frees the object and calls its `deinit`. Structs and enums are values and are copied, so they do not have this problem. That is one more reason that SwiftUI uses structs for views."),
    C('swift', S`final class Screen {
    let name: String
    init(name: String) { self.name = name; print("\(name) created") }
    deinit { print("\(name) freed") }
}

var a: Screen? = Screen(name: "Home")   // count = 1
var b = a                                // count = 2
a = nil                                  // count = 1, still alive
b = nil                                  // count = 0 -> "Home freed"`),
    P("Printing in `deinit` is the simplest leak detector you have. If a screen should be gone and you never see its message, something is still holding it."),
    H("The retain cycle"),
    P("A **retain cycle** is two objects that hold strong references to each other, so neither count can reach zero. They keep each other alive for ever."),
    C('swift', S`final class Owner {
    var pet: Pet?
    deinit { print("Owner freed") }
}
final class Pet {
    var owner: Owner?          // strong: this closes the cycle
    deinit { print("Pet freed") }
}

var o: Owner? = Owner()
var p: Pet? = Pet()
o?.pet = p
p?.owner = o
o = nil
p = nil
// nothing is printed: both objects leaked`),
    P("The fix is to make one side **weak**. A weak reference does not add to the count, and it becomes `nil` automatically when the object is freed, so it is always an optional `var`. Change the line to `weak var owner: Owner?`, and both messages print."),
    L("**`strong`** (the default) keeps the object alive.", "**`weak`** does not keep it alive and becomes `nil` when the object goes. Use it when the other object can disappear first, such as a delegate or a parent.", "**`unowned`** also does not keep it alive, but it is never `nil`. If the object is gone, using it crashes the app. Use it only when the two always live and die together, and when in doubt, use `weak`."),
    H("Closures and capture lists"),
    P("A closure that uses `self` holds a strong reference to it. If `self` also holds the closure, you have a cycle. The cure is a **capture list**, written in square brackets before the closure's inputs."),
    C('swift', S`final class Downloader {
    var onFinish: (() -> Void)?
    var count = 0

    func start() {
        // BAD: onFinish holds self, and self holds onFinish
        // onFinish = { self.count += 1 }

        onFinish = { [weak self] in
            guard let self else { return }
            self.count += 1
        }
    }
    deinit { print("Downloader freed") }
}`),
    P("`[weak self]` makes `self` optional inside the closure, and `guard let self else { return }` turns it back into a normal value for the rest of the closure. Not every closure needs this. A cycle exists only if the closure is stored somewhere that `self` owns. A closure passed to `map` or `sorted` is used once and thrown away, so it is safe."),
    H("Tasks and Combine"),
    L("A `Task { ... }` that uses `self` keeps `self` alive until the task ends. If the task never ends, for example a loop over an `AsyncStream`, the object never goes. Use `[weak self]`, and make sure the task is cancelled when the object goes.", "In Combine, a `sink` closure that uses `self` and is stored in `self`'s own set of cancellables is a classic cycle. Use `[weak self]` there too.", "The SwiftUI `.task` modifier cancels itself when the view goes, which is another reason to prefer it."),
    H("Finding leaks"),
    O("Add `deinit { print(...) }` to the classes you suspect, and navigate to the screen and back. No message means it did not free.", "Run the app, open the screen several times, and use Xcode's **Debug Memory Graph** button in the debug bar. Leaked objects show a purple warning mark, and the graph shows what still points at them.", "For a closer look, use **Instruments** (Product > Profile) with the **Leaks** and **Allocations** templates. Allocations shows how memory grows over time, and Leaks flags objects that cannot be reached.", "Fix the cycle, then repeat the same steps and check that the message appears."),
    N("Some growth is not a leak. Caches, images and lists legitimately use memory. A leak is memory that grows each time you repeat the same action and never goes back down."),
    H("Common mistakes"),
    L("Using `[weak self]` in every closure out of habit, which makes code noisy. Use it where a cycle can really form.", "Using `unowned` to avoid writing the optional, and getting crashes later.", "A delegate property declared without `weak`. Delegates should almost always be weak.", "Believing that structs cannot leak. A struct that holds a reference to a class can still be part of a cycle."),
    ...task("Type the `Owner` and `Pet` classes, check that nothing is freed, then fix the cycle with `weak`.", "Write the `Downloader` class both ways and see that only the weak version prints `Downloader freed`.", "Open one of your own apps, add `deinit` prints to two view models, and check that they are freed when their screen closes.", "Run the Debug Memory Graph on your app after opening the same screen five times."),
    ...check("Both `Owner freed` and `Pet freed` print after the fix.", "You can explain in one sentence the difference between `weak` and `unowned`.", "You can say when a closure needs a capture list and when it does not."),
  ], A('A retain cycle', [
    n('a', 'Owner', 'strong to pet', 0, 0, 'app'), n('b', 'Pet', 'strong to owner', 1, 0, 'app'),
    n('weak', 'weak reference', 'does not count', 2, 0, 'check'), n('free', 'Both freed', 'deinit runs', 3, 0, 'out'),
  ], [
    { say: 'Two objects each hold a strong reference to the other.', flow: ['a>b:strong', 'b>a:strong'] },
    { say: 'Their counts never reach zero, so neither is freed. The memory is leaked.', on: ['a', 'b'] },
    { say: 'Marking one link weak means it no longer adds to the count.', flow: ['b>weak:weak var'] },
    { say: 'When the last strong reference goes, both objects are freed and deinit runs.', flow: ['weak>free:released'] },
  ]), [
    faq('What is a retain cycle in Swift?', 'Two class instances, or an object and a closure it stores, that hold strong references to each other. Their counts never reach zero, so they are never freed, and memory leaks.'),
    faq('What is the difference between weak and unowned?', 'Both avoid adding to the reference count. weak becomes nil when the object is freed, so it is an optional. unowned is never nil and crashes if the object is gone, so use it only when both live and die together.'),
    faq('Do I always need [weak self] in a closure?', 'No. You need it only when the closure is stored by something that self owns, so a cycle can form. A closure used once, such as in map, does not need it.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S1, 'combine-publishers-and-async-sequences-in-ios', 'Combine in iOS: Publishers, sink, debounce and When to Use async', 'Combine in iOS: Publishers and sink',
    'Learn the Combine basics you meet in real code: publishers, sink, operators, @Published, combineLatest and cancellables, and how it compares with async/await.', [
    P("**Combine** is Apple's framework for handling values that change over time, such as text typed into a field, a stream of network results, or several inputs that must be checked together. It arrived in 2019, before async/await. Today, new code often uses async/await and `@Observable` instead, but Combine is still all over existing code bases, and the job posts that list *Combine* mean it. This lesson teaches you to read and write it, and to know when not to."),
    H("The three words: publisher, operator, subscriber"),
    L("A **publisher** produces values over time, and may finish or fail.", "An **operator** changes the values on their way: `map`, `filter`, `debounce`, `removeDuplicates`.", "A **subscriber** receives the values. The simplest is `sink`, which runs a closure for each value."),
    P("Think of a pipe: a source, some filters in the middle, and a tap at the end. Nothing flows until a subscriber attaches."),
    C('swift', S`import Combine

let subject = PassthroughSubject<String, Never>()
var cancellables = Set<AnyCancellable>()

subject
    .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
    .removeDuplicates()
    .filter { $0.count >= 2 }
    .sink { text in
        print("search for", text)
    }
    .store(in: &cancellables)

subject.send("s")        // ignored: too short
subject.send("sw")
subject.send("swi")      // only the last value after 300 ms is delivered`),
    P("`PassthroughSubject` is a publisher you can push values into by hand with `send`. The two type words say *the values are Strings* and *it never fails* (`Never`). `debounce` waits until values stop for a moment, which is the classic way to avoid a search call on every key press. `sink` returns an `AnyCancellable`. If you let it go, the subscription ends, so you keep it in a set with `store(in:)`."),
    H("@Published and ObservableObject"),
    P("Before the `@Observable` macro, SwiftUI view models were classes that conformed to `ObservableObject`, with `@Published` properties. Every `@Published` property is a Combine publisher. You reach it with a dollar sign, and you can build pipes on top of it."),
    C('swift', S`import Combine

@MainActor
final class ExpenseFormModel: ObservableObject {
    @Published var title = ""
    @Published var amountText = ""
    @Published private(set) var isValid = false

    init() {
        Publishers.CombineLatest($title, $amountText)
            .map { title, amountText in
                !title.trimmingCharacters(in: .whitespaces).isEmpty
                    && (Double(amountText) ?? 0) > 0
            }
            .assign(to: &$isValid)
    }
}`),
    P("`CombineLatest` waits until each publisher has a value, then emits a new pair each time either one changes. The `map` turns each pair into one `Bool`, and `assign(to: &$isValid)` feeds it into the published property. The form is always up to date, with no manual code that runs on each change. In a view you use `@StateObject private var model = ExpenseFormModel()` to own such a class, where the newer `@Observable` classes use `@State`."),
    H("Networking with Combine"),
    C('swift', S`import Combine
import Foundation

func weatherPublisher(url: URL) -> AnyPublisher<Weather, Error> {
    URLSession.shared.dataTaskPublisher(for: url)
        .map(\.data)
        .decode(type: Weather.self, decoder: JSONDecoder())
        .receive(on: DispatchQueue.main)
        .eraseToAnyPublisher()
}

var bag = Set<AnyCancellable>()

weatherPublisher(url: someURL)
    .sink(receiveCompletion: { completion in
        if case .failure(let error) = completion { print("failed:", error) }
    }, receiveValue: { weather in
        print(weather.current.temperature)
    })
    .store(in: &bag)`),
    L("`receive(on:)` moves delivery to the main queue, which you need before touching the screen.", "`eraseToAnyPublisher()` hides the long real type behind one simple name, so you can return it from a function.", "A publisher can **fail**, and the failure arrives in `receiveCompletion`. After a failure the pipe is finished."),
    N("`someURL` and `Weather` are the URL and model from lesson 11 of the beginner course. Replace them with your own."),
    H("Combine or async/await?"),
    P("Both can describe asynchronous work, and the choice is about the shape of the problem."),
    L("**One answer, later** (a network call, a database read): use `async/await`. It reads like normal code, and errors use `try` and `catch`.", "**Many values over time, to be combined or timed** (typing with a pause, several inputs merged): Combine operators are strong here, and the same job in async code often needs more hand-written work. Swift also has `AsyncSequence` for streams, but fewer ready-made operators.", "**Existing code:** if the project uses Combine, follow it. Rewriting working code for fashion is a risk with little gain.", "You can move between them. A publisher has a `.values` property, so `for await value in subject.values { }` works, and `AsyncStream` can feed a publisher."),
    N("Apple's newer frameworks lean toward async/await and Observation. Learn Combine well enough to read and fix it, and use it for new work when its operators clearly make the code shorter."),
    H("Common mistakes"),
    L("A `sink` that is not stored. The subscription ends at once, and nothing happens.", "Updating the screen without `receive(on: DispatchQueue.main)`.", "A `sink` that uses `self` and is stored in `self`'s cancellables, without `[weak self]`. This is a retain cycle from lesson 3.", "Very long chains of operators that nobody can read. Split them and name the steps."),
    ...task("Type the debounce example in a Playground or a small app and check which values get through.", "Build `ExpenseFormModel` and show a Save button that is disabled while `isValid` is false.", "Write one `Publisher` for a URL as above, and also the same call with `async/await`. Compare the two in a few sentences.", "Use `.values` to read a `PassthroughSubject` with `for await`."),
    ...check("Only the last value after a pause reaches the `sink`.", "The Save button turns on and off as you type.", "You can say when you would pick async/await and when Combine."),
  ], A('A Combine pipe', [
    n('src', 'Publisher', 'text typed', 0, 0, 'user'), n('op', 'debounce', 'wait 300 ms', 1, 0, 'tool'),
    n('flt', 'filter', '2 letters or more', 2, 0, 'check'), n('sink', 'sink', 'runs your code', 3, 0, 'out'),
  ], [
    { say: 'A publisher produces values over time, such as text typed in a field.', on: ['src'] },
    { say: 'The debounce operator waits until the typing pauses.', flow: ['src>op:values'] },
    { say: 'The filter keeps only values that pass your test.', flow: ['op>flt:last value'] },
    { say: 'The sink subscriber receives what is left, and runs your closure. Keep its cancellable, or it stops.', flow: ['flt>sink:deliver'] },
  ]), [
    faq('What is Combine in iOS?', 'Apple\'s framework for handling values that change over time, built from publishers, operators and subscribers such as sink. It is common in existing code bases and has been joined by async/await and Observation.'),
    faq('Why must I store the result of sink?', 'sink returns an AnyCancellable. If it is released, the subscription ends. Storing it, usually in a Set<AnyCancellable> with store(in:), keeps the pipe alive.'),
    faq('Should I learn Combine in 2026 or only async/await?', 'Learn async/await first. Then learn enough Combine to read and maintain existing code, since many job posts and older projects still use it.'),
  ]),
];
