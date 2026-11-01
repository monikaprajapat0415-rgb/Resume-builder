import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

// Swift code uses backslash-parenthesis for string interpolation, so every code block uses String.raw.
const S = String.raw;
const S1 = 'Getting Started';
const S2 = 'Swift Basics';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'what-is-ios-development-xcode-and-your-first-app', 'What Is iOS Development? Xcode and Your First iPhone App', 'iOS Development: Xcode and First App',
    'Learn what an iOS developer does, what you need (a Mac and Xcode), how Swift and SwiftUI fit together, and how to build and run your first iPhone app.', [
    P("An iOS developer builds apps for the iPhone, and often for the iPad, Apple Watch and other Apple devices too. The apps you use for banking, food delivery, travel, notes and fitness are mostly built by small teams who know one language, Swift, and one toolbox, Apple's frameworks. This course teaches that path from nothing to an app you can put on a phone and show to an employer. It is 15 lessons long, and from lesson 6 onwards we build one running project, an Expense Tracker."),
    P("Before the first line of code, it helps to know the map. You will see these names in job posts, so here is what each one means."),
    L("**Swift** is the main programming language for Apple platforms. It is modern, safe and readable. This is where you start.", "**SwiftUI** is Apple's newer way to build screens. You describe what the screen should look like, and the system draws it. Most new apps and tutorials use it.", "**UIKit** is the older screen toolkit. Many large companies still have apps built with it, so it is worth knowing later. Lesson 15 explains how the two live together.", "**Objective-C** is the language that came before Swift. You can skip it at the start. You only need it if a job involves a very old code base.", "**Xcode** is the free program from Apple where you write, run, test and publish apps."),
    H("What you need"),
    P("The honest answer is a Mac. Xcode only runs on macOS, and you need it to build iOS apps. There is no complete way to build and publish native iPhone apps on Windows or Linux. If you do not own a Mac, think about a second-hand or refurbished one, or a cloud Mac rental for learning, and check the price against your budget before you start. You can still read the Swift lessons (2 to 5) on any computer, because the Swift language itself runs on other systems, but the app lessons need Xcode."),
    L("A Mac that can run a recent version of macOS and Xcode. Apple lists which Macs and system versions each Xcode release supports, so check their page before you install.", "Enough free disk space. Xcode and its simulators are large, often tens of gigabytes.", "An Apple ID, which is free. A free Apple ID is enough to run your own apps on the simulator, and Apple also allows limited testing on your own device. Publishing to the App Store needs a paid Apple Developer Program membership, and the price and rules are on Apple's site, so look there for the current details."),
    N("Everything in this course targets recent tools: Xcode 16 or newer and iOS 17 or newer. We pick iOS 17 as the lowest version because the modern state tools (the Observable macro) and SwiftData need it. Apple changes menus and templates with each Xcode release, so if a button has moved, search for the word in the menu bar. The ideas stay the same."),
    H("Install Xcode"),
    O("Open the App Store on your Mac, search for **Xcode** and click Get. It is free, and the download is large, so start it early.", "When it finishes, open Xcode once and accept the licence. It may offer to install extra components. Let it.", "In Xcode, open **Settings** and look at the Platforms tab. Make sure an iOS simulator is installed. If not, download one there."),
    H("Create your first app"),
    O("In Xcode choose **File > New > Project**.", "Pick the **iOS** tab and then **App**. Click Next.", "Product Name: `Hello`. Interface: **SwiftUI**. Language: **Swift**. If Xcode asks about storage or testing, leave the defaults for now. Click Next and save the project in a folder you can find later.", "Xcode creates a project with a few files. Open the one called `ContentView.swift`."),
    P("The file contains a short piece of code. It looks a little like the one below, although the exact lines change a little between Xcode versions. You will understand every word of it by lesson 8, so for now just read it like a sentence."),
    C('swift', S`import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}`),
    P("The word `struct` makes a new type called `ContentView`. The `: View` after it says it is a screen piece. It must have a property called `body` that returns what to show. Here that is a **VStack**, a vertical stack, holding an icon and some text. The lines that start with a dot, such as `.padding()`, are **modifiers**, and they change how a view looks. The `#Preview` block at the bottom shows the screen live in Xcode, on the right side, without running the app. If you do not see it, choose **Editor > Canvas**."),
    H("Run it in the simulator"),
    P("At the top of Xcode there is a device menu with names such as iPhone 16. Choose any recent iPhone and press the **Run** button, the triangle, or press Command and R. Xcode builds the app, starts the Simulator and opens your app on a pretend iPhone. The first run is slow, and later runs are quicker. Press the stop button when you are done."),
    P("Now make a change. Edit the text to your own name, and add a second `Text` line below it. Watch the preview update. This loop of change, see, change again is the heart of SwiftUI work, and it is much faster than the old way of building screens."),
    C('swift', S`struct ContentView: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "iphone")
                .font(.system(size: 48))
                .foregroundStyle(.blue)
            Text("Hello, my name is Asha")
                .font(.title)
            Text("This is my first iPhone app.")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}`),
    H("What is in the project folder"),
    L("`HelloApp.swift` is the starting point. It has the `@main` mark, which tells the system where the app begins.", "`ContentView.swift` is your first screen.", "`Assets.xcassets` holds images, colours and the app icon.", "The `.xcodeproj` file is the project itself. Open this file, not the folder, if you come back later.", "If you ticked testing, there are folders for tests. We use them in lesson 14."),
    H("Habits that save time"),
    L("Read Xcode's error messages. They appear as red marks beside the line number. Click one and read the full text. The first error often causes the others.", "Use the preview for quick layout work and the simulator for real behaviour such as navigation.", "Use Git from day one. In lesson 15 and on this site's Git course you will learn how. Xcode can create a Git repository when you create the project.", "Keep one small project per idea. Do not worry about making it pretty yet."),
    ...task("Install Xcode and create an iOS App project called Hello with SwiftUI and Swift.", "Change the text so it shows your name and one more line of your own.", "Change the icon name to another one, for example `star.fill` or `heart.fill`, and change its colour.", "Run it in the Simulator and take a screenshot, so you can see your progress at the end of the course."),
    ...check("The preview or the Simulator shows your own text and icon.", "You can say in one sentence what Swift, SwiftUI and Xcode are.", "You can say what a modifier is, using `.padding()` as an example."),
  ], A('From code to screen', [
    n('code', 'Swift code', 'ContentView.swift', 0, 0, 'data'), n('xcode', 'Xcode', 'builds your app', 1, 0, 'tool'),
    n('sim', 'Simulator', 'a pretend iPhone', 2, 0, 'app'), n('screen', 'App on screen', 'what the user sees', 3, 0, 'out'),
  ], [
    { say: 'You write Swift and SwiftUI code in a file such as ContentView.swift.', on: ['code'] },
    { say: 'Xcode checks the code and builds it into an app.', flow: ['code>xcode:build'] },
    { say: 'Xcode installs the app on the Simulator, a pretend iPhone on your Mac.', flow: ['xcode>sim:run'] },
    { say: 'The screen shows what your code describes.', flow: ['sim>screen:draws'] },
  ]), [
    faq('Can I learn iOS development without a Mac?', 'You can learn the Swift language on other systems, but building and running native iPhone apps needs Xcode, and Xcode only runs on macOS. A second-hand Mac or a cloud Mac is the usual route.'),
    faq('Should I learn Swift or Objective-C first?', 'Swift. It is the language Apple recommends for new work, and most tutorials and new apps use it. Objective-C is only needed for some older code bases.'),
    faq('Is SwiftUI or UIKit better for a beginner?', 'SwiftUI. It needs less code and updates in a live preview. UIKit is still used by many companies, so learn it after you are comfortable with SwiftUI.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S2, 'swift-constants-variables-types-and-control-flow', 'Swift Basics: let, var, Types, if, switch and Loops', 'Swift Basics: let, var, Types and Loops',
    'Learn how Swift stores values with let and var, its main types, string interpolation, arrays, dictionaries, and how to make decisions and repeat work.', [
    P("Swift is the language behind every lesson from here on. In the next four lessons we learn it on its own, before we put it inside an app. You can practise in an Xcode **Playground** or in a small Command Line Tool project, or in the free Swift Playgrounds app. Pick whichever starts fastest. Each example prints its answer with `print`, so you can see what it does."),
    H("let and var"),
    P("Swift has two ways to give a name to a value. Use `let` for a **constant**, a value that never changes after you set it. Use `var` for a **variable**, a value you will change later. Prefer `let` whenever you can. Swift even warns you when a `var` is never changed. It is a small habit that prevents many bugs, because a value that cannot change cannot be changed by mistake."),
    C('swift', S`let name = "Asha"
var score = 10
score = score + 5
print("\(name) has \(score) points")`),
    P("Swift works out the type by itself, which is called **type inference**. Here `name` is a `String` and `score` is an `Int`. You can also write the type on purpose, with a colon: `let price: Double = 4`. This is useful when the number should be a decimal even though you typed a whole number."),
    P("The special part in the print line is `\\(name)`. A backslash followed by brackets inside a string drops a value into the text. This is called **string interpolation**, and you will use it all the time."),
    H("The main types"),
    L("`Int` is a whole number such as 42. `Double` is a decimal number such as 3.14. Use `Double` for ordinary decimals in this course.", "`String` is text. `Bool` is `true` or `false`.", "Swift will not mix types by itself. `Int` plus `Double` is an error until you convert one: `Double(score) + 2.5`. This is strict on purpose, and it catches mistakes before the app runs.", "Money needs care. A `Double` cannot hold some decimal values exactly, so real finance apps use the `Decimal` type. We use `Double` in the course to keep the code short, and the Expense Tracker lesson says so again."),
    H("Arrays and dictionaries"),
    P("An **array** is an ordered list of values of one type. A **dictionary** keeps pairs, a key and a value, and you look up a value by its key."),
    C('swift', S`var expenses: [Double] = [12.5, 40, 7.25]
expenses.append(19.99)
print(expenses.count)        // 4
print(expenses[0])           // 12.5, counting starts at zero

var limits: [String: Double] = ["Food": 200, "Travel": 150]
limits["Fun"] = 80
print(limits["Food"] ?? 0)   // 200.0`),
    P("Notice that looking up `limits[\"Food\"]` gives an *optional* value, because the key might not exist. The `?? 0` part says *use zero if there is nothing*. Optionals are so important that lesson 5 is all about them."),
    H("Making decisions: if and switch"),
    P("Use `if` to choose between paths. The conditions do not need brackets, but the braces are required. Use `switch` when one value can match many cases. A `switch` in Swift must cover every possible case, so the compiler warns you if you forget one."),
    C('swift', S`let total = 120.0

if total > 100 {
    print("Over budget")
} else if total > 50 {
    print("Careful")
} else {
    print("All good")
}

let day = 3
switch day {
case 1: print("Monday")
case 2: print("Tuesday")
case 3...5: print("Midweek")
default: print("Another day")
}`),
    P("The pattern `3...5` is a **range** that includes 3, 4 and 5. The range `0..<5` stops before 5. Both are very common in loops."),
    H("Repeating work: loops"),
    C('swift', S`let items = ["Coffee", "Bus", "Lunch"]

for item in items {
    print("Spent on \(item)")
}

for i in 1...3 {
    print("Round \(i)")
}

var n = 3
while n > 0 {
    print(n)
    n -= 1
}`),
    P("A `for` loop walks through a list or a range. A `while` loop repeats as long as a condition is true, so be sure something inside it changes, or it never ends. You will use `for` much more than `while`."),
    H("Common beginner mistakes"),
    L("Changing a `let` constant. Swift stops you with an error. Change it to `var` only if the value really must change.", "Forgetting that array counting starts at 0. The first item is `items[0]`, and asking for an index that does not exist crashes the program.", "Mixing `Int` and `Double` in one sum. Convert with `Double(x)`.", "Writing `=` when you mean `==`. One stores a value. Two compare."),
    ...task("Create a Playground or a command line project.", "Make an array of five expense amounts and use a `for` loop to add them into a `var total`.", "Print `Over budget` if the total is above 100 and `Within budget` otherwise.", "Make a dictionary of three category names and limits, and print each one with string interpolation."),
    ...check("Your total is right when you add the numbers by hand.", "Changing one amount changes the message when it crosses 100.", "You can say the difference between `let` and `var` and why `let` is the better first choice."),
  ], A('let and var', [
    n('let', 'let', 'fixed value', 0, 0, 'check'), n('var', 'var', 'can change', 0, 1, 'tool'),
    n('swift', 'Swift', 'checks the types', 1, 0, 'app'), n('out', 'print()', 'shows the result', 2, 0, 'out'),
  ], [
    { say: 'let creates a constant. Once it is set, Swift will not let you change it.', on: ['let'] },
    { say: 'var creates a variable. You can give it a new value later.', on: ['var'] },
    { say: 'Swift works out the type of each name and checks every use.', flow: ['let>swift:types', 'var>swift:types'] },
    { say: 'print shows the result in the console, with values dropped into the text.', flow: ['swift>out:prints'] },
  ]), [
    faq('Should I use let or var?', 'Start with let. Change to var only when the value really has to change. Swift will warn you when a var is never changed.'),
    faq('Why does Swift not allow Int plus Double?', 'Swift is strict about types so mistakes show up when you build the app and not when a user runs it. Convert on purpose, for example with Double(count).'),
    faq('Do I need a Mac to practise Swift?', 'For the language alone, no, because Swift also runs on other systems. For the app lessons you need Xcode on a Mac.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S2, 'swift-functions-and-closures', 'Swift Functions and Closures: map, filter and reduce', 'Swift Functions and Closures',
    'Learn to write Swift functions with argument labels and default values, then closures, trailing closure syntax and the map, filter, sorted and reduce helpers.', [
    P("A **function** is a named piece of code that you can run whenever you need it. A **closure** is a function without a name that you can pass around like a value. SwiftUI uses both on nearly every line, so this lesson is time well spent. We keep the Expense Tracker idea: amounts of money and what we do with them."),
    H("Writing a function"),
    P("A function starts with `func`, then a name, then its inputs in brackets, then an arrow and the type it gives back. Swift functions have a special habit: each input has an **argument label** that you write when you call the function. This makes calls read like short sentences."),
    C('swift', S`func total(of amounts: [Double]) -> Double {
    var sum = 0.0
    for a in amounts { sum += a }
    return sum
}

let t = total(of: [12.5, 40, 7.25])
print(t)   // 59.75`),
    P("Look at `total(of amounts:)`. The first word, `of`, is the label used when you call it. The second word, `amounts`, is the name used inside the function. If you do not want a label, write an underscore: `func total(_ amounts: [Double])`. Then you call `total([1, 2])`. If a function gives nothing back, you leave out the arrow."),
    H("Default values"),
    P("An input can have a default. Callers may then leave it out. This keeps simple calls short and still allows detail when you need it."),
    C('swift', S`func format(_ amount: Double, currency: String = "$") -> String {
    return "\(currency)\(String(format: "%.2f", amount))"
}

print(format(5))                  // $5.00
print(format(5, currency: "EUR ")) // EUR 5.00`),
    N("`String(format:)` comes from Apple's Foundation library. It works with the usual percent codes such as `%.2f` for two decimals. For text a user will see, SwiftUI has better tools for currency, and lesson 9 uses one. Currency symbols and number formats differ by country, so do not hard-code them in a real app."),
    H("Closures"),
    P("A closure is a block of code in curly braces. Its inputs come first, followed by the word `in`. You can store it in a constant, pass it to a function, or return it."),
    C('swift', S`let double = { (x: Double) -> Double in
    return x * 2
}
print(double(4))   // 8.0

func repeatTask(times: Int, action: () -> Void) {
    for _ in 0..<times { action() }
}

repeatTask(times: 3) {
    print("Saved a backup")
}`),
    P("Look at the last call. When the last input of a function is a closure, you can write the closure *after* the brackets. This is called a **trailing closure**. You will see this shape in SwiftUI all the time, for example in `Button(\"Add\") { ... }`, where the braces hold the code that runs when someone taps."),
    H("map, filter, sorted and reduce"),
    P("Arrays have helpers that take a closure. They replace many small loops, and they read as a description of what you want."),
    C('swift', S`let amounts = [12.5, 40, 7.25, 99, 3]

let doubled = amounts.map { $0 * 2 }
let large = amounts.filter { $0 > 10 }
let sorted = amounts.sorted { $0 > $1 }
let sum = amounts.reduce(0) { $0 + $1 }

print(doubled)  // [25.0, 80.0, 14.5, 198.0, 6.0]
print(large)    // [12.5, 40.0, 99.0]
print(sorted)   // [99.0, 40.0, 12.5, 7.25, 3.0]
print(sum)      // 161.75`),
    L("`map` makes a new array by changing each item.", "`filter` keeps only the items for which the closure says true.", "`sorted` puts the items in order. The closure says which of two items comes first.", "`reduce` folds all items into one value. The first input is the starting value, here 0.", "`$0` and `$1` are short names for the first and second inputs. They are fine for tiny closures. When a closure grows, give the inputs real names, because the code is easier to read later."),
    H("Functions inside types"),
    P("When a function lives inside a struct or class, it is called a **method**. In the next lesson you will put `total` inside a type that holds expenses. Closures also *capture* the values they use from the code around them. This is powerful, and also the reason that, in classes, you sometimes meet the words `[weak self]` in longer examples. We come back to this when it matters."),
    H("Common mistakes"),
    L("Forgetting the argument label when you call a function. Swift's error message names the missing label.", "Writing a very long closure on one line. Split it onto several lines with named inputs.", "Using `reduce` when a plain loop would be clearer. Choose the one a teammate would understand fastest."),
    ...task("Write `average(of:)` that takes an array of `Double` and returns the average. Return 0 for an empty array.", "Write `isLarge(_:limit:)` with a default limit of 50 that returns a `Bool`.", "Given an array of amounts, use `filter` to keep those above 20, then `map` to add 10 per cent, then `reduce` to total them.", "Call your own function with a trailing closure, like `repeatTask` above."),
    ...check("`average(of: [10, 20, 30])` prints 20.0 and `average(of: [])` prints 0.0.", "You can explain what `$0` means.", "You can say what a trailing closure is and find one in the examples."),
  ], A('map, filter, reduce', [
    n('in', 'Array', '[12, 40, 7, 99]', 0, 0, 'data'), n('filter', 'filter', 'keep > 10', 1, 0, 'tool'),
    n('map', 'map', 'change each', 2, 0, 'tool'), n('red', 'reduce', 'fold to one', 3, 0, 'check'),
  ], [
    { say: 'You start with an array of values.', on: ['in'] },
    { say: 'filter keeps only the values that pass your test.', flow: ['in>filter:items'] },
    { say: 'map changes each remaining value into a new one.', flow: ['filter>map:kept'] },
    { say: 'reduce folds the list into one value, such as a total.', flow: ['map>red:values'] },
  ]), [
    faq('What is the difference between a function and a closure?', 'A function has a name. A closure is a block of code without a name that you can store in a constant or pass to another function. Functions are really a special kind of closure.'),
    faq('What does $0 mean in Swift?', 'It is a short name for the first input of a closure. $1 is the second. Use them for tiny closures and write real names when the closure grows.'),
    faq('What is a trailing closure?', 'When the last input of a function is a closure, you can write it in braces after the brackets. SwiftUI buttons and lists use this style all the time.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S2, 'swift-structs-classes-enums-and-protocols', 'Swift Structs, Classes, Enums and Protocols Explained', 'Swift Structs, Classes, Enums, Protocols',
    'Understand value types and reference types, how to model data with structs and enums, share behaviour with protocols, and add features with extensions.', [
    P("Real apps hold real things: an expense, a user, a recipe. Swift gives you several ways to model them. Picking the right one is a skill, and it is a very common interview topic. This lesson builds the data model that the Expense Tracker uses later."),
    H("Structs"),
    P("A **struct** groups related values and the functions that work on them. You make a new one by calling its name with the values. Swift gives every struct a free **memberwise initializer**, so you do not have to write the set-up code yourself."),
    C('swift', S`struct Expense {
    var title: String
    var amount: Double
    var category: String = "General"

    func summary() -> String {
        "\(title): \(amount)"
    }
}

let lunch = Expense(title: "Lunch", amount: 8.5)
print(lunch.summary())   // Lunch: 8.5`),
    P("Notice the function `summary()` has no `return`. When a function body is a single expression, Swift returns it for you. Also, `lunch` is a `let`, so none of its properties can change. If you need to change one, declare it with `var`."),
    H("Value types and reference types"),
    P("This is the idea to understand well. Structs are **value types**. When you assign a struct to a new name, or pass it to a function, you get your own *copy*. Changing the copy does not change the original. Classes are **reference types**. A copy of a class variable points to the *same* object, so a change through one name shows up through the other."),
    C('swift', S`struct PointS { var x = 0 }
class PointC { var x = 0 }

var a = PointS(); var b = a
b.x = 5
print(a.x, b.x)     // 0 5, two separate copies

let c = PointC(); let d = c
d.x = 5
print(c.x, d.x)     // 5 5, one shared object`),
    L("Use a **struct** by default. Copies are easy to reason about, and SwiftUI is built around structs.", "Use a **class** when you need one shared object that many parts of the code change, or when a framework requires it. Classes can also inherit from other classes, which structs cannot do.", "A class needs an `init` that sets every property, unless all of them have default values.", "A struct that must change its own properties inside a method marks that method `mutating`."),
    H("Enums"),
    P("An **enum** is a type with a fixed set of cases. It is perfect for things that can be one of a few options, such as an expense category. Cases can even carry extra values."),
    C('swift', S`enum Category: String, CaseIterable {
    case food = "Food"
    case travel = "Travel"
    case fun = "Fun"
}

for c in Category.allCases {
    print(c.rawValue)
}

enum LoadState {
    case loading
    case loaded(count: Int)
    case failed(message: String)
}

let state = LoadState.loaded(count: 3)
switch state {
case .loading: print("Loading")
case .loaded(let count): print("Loaded \(count)")
case .failed(let message): print(message)
}`),
    P("`CaseIterable` gives you `allCases`, a list of every case, which is ideal for building a picker. The `LoadState` enum is a very common pattern. One value tells a screen whether to show a spinner, a list or an error message, and the `switch` makes you handle every case."),
    H("Protocols"),
    P("A **protocol** is a list of requirements, the properties and methods a type must have. Any type that meets the list can say it *conforms* to the protocol. Code that asks for the protocol does not care which type it receives, as long as the type can do the job."),
    C('swift', S`protocol Summarizable {
    var title: String { get }
    func summary() -> String
}

extension Expense: Summarizable {}   // Expense already has both

func printAll(_ items: [any Summarizable]) {
    for item in items { print(item.summary()) }
}

printAll([lunch, Expense(title: "Bus", amount: 2)])`),
    P("Two protocols appear in SwiftUI work again and again. `Identifiable` says a type has a stable `id`, so a list can tell items apart. `Codable` lets a type turn into and out of JSON, which is lesson 11. Protocols also make testing easier, because you can swap a real part for a simple fake one in lesson 13."),
    H("Extensions"),
    P("An **extension** adds new methods or computed properties to a type that already exists, even one you did not write. It is a tidy way to keep code grouped."),
    C('swift', S`extension Double {
    var asMoney: String { String(format: "%.2f", self) }
}
print(12.5.asMoney)   // 12.50`),
    H("Choosing between them"),
    L("Data that describes a thing: a struct.", "One of a few options: an enum.", "A shared object with its own life, such as a manager that many screens use: a class.", "A promise of behaviour, so different types can be swapped: a protocol."),
    ...task("Make an `Expense` struct with `id` (a `UUID()`), `title`, `amount` and a `Category` enum. Make it conform to `Identifiable`.", "Write an extension on `Array<Expense>` with a `total` property.", "Prove the difference between a struct and a class copy with your own tiny example, and write one sentence about what you saw.", "Make an enum `LoadState` and a function that returns a message for each case."),
    ...check("Your `total` property adds up amounts correctly.", "Changing a copy of the struct leaves the original unchanged, and changing a copy of the class changes both.", "You can say when you would choose a struct and when a class."),
  ], A('Copy or share?', [
    n('s', 'struct', 'value type', 0, 0, 'data'), n('copy', 'Own copy', 'a change stays local', 1, 0, 'check'),
    n('c', 'class', 'reference type', 0, 1, 'app'), n('shared', 'One object', 'a change is shared', 1, 1, 'tool'),
  ], [
    { say: 'A struct is a value type. Assigning it makes a new copy.', flow: ['s>copy:assign'] },
    { say: 'Changing the copy leaves the original alone, so structs are easy to reason about.', on: ['copy'] },
    { say: 'A class is a reference type. Assigning it points to the same object.', flow: ['c>shared:assign'] },
    { say: 'A change made through any name shows up everywhere, so use classes on purpose.', on: ['shared'] },
  ]), [
    faq('Should I use a struct or a class in Swift?', 'Use a struct by default. Choose a class when you need one shared object with its own life, inheritance, or when a framework needs it.'),
    faq('What is a protocol in Swift?', 'A list of properties and methods that a type promises to have. Code that asks for the protocol works with any type that meets it, which helps with flexibility and testing.'),
    faq('What is an enum used for?', 'For a value that can be only one of a fixed set of cases, such as a category or a loading state. Cases can carry extra data.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'swift-optionals-and-error-handling', 'Swift Optionals and Error Handling: if let, guard and try', 'Swift Optionals and Error Handling',
    'Learn why Swift has optionals, how to unwrap them safely with if let, guard let and ??, and how to throw, catch and handle errors with do, try and catch.', [
    P("Optionals are the Swift feature that surprises people most, and the one that makes Swift apps crash less often. Many languages have a value called `null` or `nil` that sneaks into your code and crashes it later. Swift makes the possibility of *no value* part of the type, so the compiler makes you deal with it before the app runs. This lesson also covers errors, the other thing that can go wrong in real apps."),
    H("What an optional is"),
    P("An **optional** is a box that holds either a value or nothing. You write it by adding a question mark to a type. `Int?` means *an Int, or nothing*. The nothing is written `nil`. A plain `Int` can never be `nil`."),
    C('swift', S`var age: Int? = nil
print(age)          // nil
age = 30
print(age)          // Optional(30)

let text = "42"
let number = Int(text)     // Int? because the text might not be a number
print(number)              // Optional(42)
print(Int("abc"))          // nil`),
    P("`Int(text)` is a good example. Not every piece of text is a number, so the result is an optional. You cannot use an `Int?` where an `Int` is needed until you open the box, and Swift gives several safe ways to do that."),
    H("Unwrapping safely"),
    C('swift', S`let input: String? = "Asha"

// 1. if let: use the value only when it exists
if let name = input {
    print("Hello, \(name)")
} else {
    print("No name")
}

// 2. guard let: leave early when it does not exist
func greet(_ input: String?) {
    guard let name = input else {
        print("No name")
        return
    }
    print("Hello, \(name)")   // name is usable for the rest of the function
}

// 3. ?? gives a default
let shown = input ?? "Guest"

// 4. optional chaining: stop quietly at the first nil
let length = input?.count     // Int?`),
    L("`if let` is best when you only want to do something extra if a value is there.", "`guard let` is best at the top of a function. It keeps the main path of the code flat and easy to read, and the `else` part must leave with `return`, `throw` or similar.", "`??` is best when there is a sensible default.", "`?.` is best when you want to read through a chain, and a missing link should simply give `nil`."),
    H("The danger of the exclamation mark"),
    P("Adding `!` after an optional is called **force unwrapping**. It says *I promise this is not nil*. If you are wrong, the app crashes at once. People use it in examples to keep them short, and then in real code to get past an error message. Avoid it. A crash is the worst experience for a user, and it is also very easy to avoid. The few places where `!` is acceptable, such as a value that your own set-up has already filled in, should be rare and you should be able to explain each one."),
    C('swift', S`let value = Int("abc")
// print(value!)    // crash: found nil while unwrapping

print(value ?? 0)   // safe`),
    H("Errors: throw, try and catch"),
    P("Not every problem is a missing value. A file may not open. A web call may fail. A user may type an amount below zero. Swift uses **errors** for these. An error is a value of any type that conforms to the `Error` protocol, usually an enum. A function that can fail is marked `throws`, and the caller must write `try` before it."),
    C('swift', S`enum ExpenseError: Error {
    case emptyTitle
    case invalidAmount(Double)
}

func makeExpense(title: String, amount: Double) throws -> Expense {
    guard !title.isEmpty else { throw ExpenseError.emptyTitle }
    guard amount > 0 else { throw ExpenseError.invalidAmount(amount) }
    return Expense(title: title, amount: amount)
}

do {
    let e = try makeExpense(title: "Tea", amount: -3)
    print(e.title)
} catch ExpenseError.emptyTitle {
    print("Please enter a title")
} catch ExpenseError.invalidAmount(let value) {
    print("\(value) is not a valid amount")
} catch {
    print("Something else went wrong: \(error)")
}`),
    P("A `do` block runs the risky code. If anything inside throws, Swift jumps to the first matching `catch`. The last bare `catch` handles everything else, and inside it a value called `error` is available. You also meet two shortcuts: `try?` gives an optional (`nil` if it failed) and `try!` crashes on failure, so treat it like the exclamation mark."),
    H("Errors or optionals?"),
    L("When *nothing there* is a normal answer, such as looking up a key, use an optional.", "When something *went wrong* and the caller should know why, throw an error.", "When you build a screen, turn errors into something a person can read. A friendly message and a way to try again beat a technical text."),
    N("In lesson 11 you will meet `Result`, an enum with a success case and a failure case, and `async` functions that throw. They work in the same way as what you learned here."),
    ...task("Write `parseAmount(_ text: String) -> Double?` using `Double(text)`. Test it with `\"12.5\"` and `\"abc\"`.", "Write a function with `guard let` that prints a greeting only when a name is given.", "Add a `ExpenseError.tooLarge` case and make `makeExpense` throw it when the amount is over 10,000.", "Catch each error in a `do` block and print a clear message."),
    ...check("`parseAmount(\"abc\")` gives `nil` and does not crash.", "Each bad input to `makeExpense` prints its own message.", "You can name three safe ways to unwrap an optional and say why `!` is risky."),
  ], A('Safe unwrapping', [
    n('opt', 'Int?', 'value or nil', 0, 0, 'data'), n('check', 'if let / guard', 'checks the box', 1, 0, 'check'),
    n('use', 'Safe use', 'real value inside', 2, 0, 'out'), n('nil', 'nil path', 'else or default', 1, 1, 'tool'),
  ], [
    { say: 'An optional holds a value or nothing. The type says so with a question mark.', on: ['opt'] },
    { say: 'if let and guard let open the box and check it before you use it.', flow: ['opt>check:open'] },
    { say: 'When there is a value, your code runs with a plain, safe value.', flow: ['check>use:has value'] },
    { say: 'When it is nil, the else path or a default with ?? takes over, and the app does not crash.', flow: ['check>nil:is nil'] },
  ]), [
    faq('What is an optional in Swift?', 'A type that holds either a value or nothing (nil). It is written with a question mark, such as Int?. The compiler makes you handle the nil case before you use the value.'),
    faq('What is the difference between if let and guard let?', 'Both unwrap an optional safely. if let uses the value inside its braces. guard let makes the value usable for the rest of the function and must leave the function in its else part.'),
    faq('When should I use try? and try!?', 'try? turns a failure into nil, which is fine when you do not need the reason. try! crashes if the call fails, so avoid it in real code.'),
  ]),
];
