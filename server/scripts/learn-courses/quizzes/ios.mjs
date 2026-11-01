const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'ios-development-swift-swiftui-course';
export const quizzes = {
  'what-is-ios-development-xcode-and-your-first-app': [
    Q('What do you need to build native iPhone apps?', ['A Mac with Xcode', 'Any Windows laptop', 'Only a web browser'], 0, 'Xcode only runs on macOS.'),
    Q('What is SwiftUI?', ['Apple\'s modern way to describe screens in code', 'A database', 'A type of iPhone'], 0),
    Q('What does a modifier such as .padding() do?', ['Returns a changed copy of a view', 'Deletes the view', 'Starts the Simulator'], 0),
  ],
  'swift-constants-variables-types-and-control-flow': [
    Q('Which keyword makes a value that cannot change after it is set?', ['let', 'var', 'func'], 0, 'Prefer let, and use var only when the value must change.'),
    Q('What does string interpolation look like in Swift?', ['"Hello \\(name)"', '"Hello ${name}"', '"Hello %name"'], 0),
    Q('Why does Swift refuse to add an Int and a Double directly?', ['It is strict about types so mistakes are caught early', 'It cannot do maths', 'Doubles are not numbers'], 0, 'Convert on purpose, for example Double(count).'),
  ],
  'swift-functions-and-closures': [
    Q('What is a trailing closure?', ['A closure written in braces after the brackets when it is the last input', 'A function that never ends', 'A closure with no code'], 0),
    Q('What does $0 mean inside a closure?', ['The first input of the closure', 'The number zero', 'An error'], 0),
    Q('Which array helper changes every item into a new value?', ['map', 'filter', 'sorted'], 0, 'filter keeps items, sorted orders them, reduce folds them into one value.'),
  ],
  'swift-structs-classes-enums-and-protocols': [
    Q('You assign a struct to a new variable and change the copy. What happens to the original?', ['It stays the same', 'It changes too', 'The app crashes'], 0, 'Structs are value types, so each name has its own copy.'),
    Q('Which type is best for a value that can be only one of a few options?', ['enum', 'class', 'closure'], 0),
    Q('What is a protocol?', ['A list of properties and methods a type promises to have', 'A kind of loop', 'A network address'], 0),
  ],
  'swift-optionals-and-error-handling': [
    Q('What does Int? mean?', ['An Int or nothing (nil)', 'A very large Int', 'An Int that is always positive'], 0),
    Q('Which is the safest way to use an optional you are not sure about?', ['if let or guard let', 'Force unwrap with !', 'Ignore the warning'], 0, 'Force unwrapping crashes the app if the value is nil.'),
    Q('A function marked throws is called with…', ['try inside do and catch', 'await only', 'print'], 0),
  ],
  'swiftui-views-modifiers-and-stacks': [
    Q('Which stack puts views side by side?', ['HStack', 'VStack', 'ZStack'], 0, 'VStack is vertical and ZStack layers views on top of each other.'),
    Q('Why does the order of modifiers matter?', ['Each modifier wraps the result of the one before it', 'Swift runs them backwards by random', 'It does not matter'], 0),
    Q('What does Spacer() do inside a stack?', ['Takes up the free space and pushes views apart', 'Adds a divider line', 'Hides the stack'], 0),
  ],
  'swiftui-state-binding-buttons-and-textfields': [
    Q('What does @State do?', ['Keeps a value for the view and redraws the view when it changes', 'Saves a value on the server', 'Makes a value constant'], 0),
    Q('What does the dollar sign in $title give you?', ['A binding, a two-way link to the value', 'The length of the text', 'A copy of the text'], 0),
    Q('A child view must change a value owned by its parent. What does it declare?', ['@Binding', '@Model', 'let'], 0),
  ],
  'swiftui-lists-navigationstack-and-sheets': [
    Q('Which container gives you the title bar and back button for a stack of screens?', ['NavigationStack', 'ZStack', 'Form'], 0, 'NavigationView is deprecated for new code.'),
    Q('Why must list items be Identifiable?', ['SwiftUI needs a stable id to tell rows apart', 'To make them faster to type', 'So they can be sorted'], 0),
    Q('Which modifier adds swipe to delete to a ForEach?', ['.onDelete', '.onTap', '.sheet'], 0),
  ],
  'swiftui-forms-pickers-validation-and-animation': [
    Q('What does withAnimation do?', ['Animates the views that change because of the state change inside it', 'Plays a video', 'Slows down the app'], 0),
    Q('Where should the rules for a valid form be checked?', ['On the screen and again where the data is saved', 'Only in the keyboard type', 'Nowhere'], 0),
    Q('Why use CaseIterable on an enum with a Picker?', ['allCases lets ForEach build every choice', 'It makes the enum a class', 'It saves the enum to disk'], 0),
  ],
  'swift-concurrency-async-await-task-and-actors': [
    Q('What happens at an await?', ['The code may pause while the thread stays free for other work', 'The whole app freezes', 'The code is skipped'], 0),
    Q('Which modifier starts async work when a view appears and cancels it when the view goes away?', ['.task', '.onTapGesture', '.sheet'], 0),
    Q('What does an actor protect?', ['Its data from being changed by two tasks at once', 'The screen from rotating', 'The app from updates'], 0),
  ],
  'urlsession-codable-and-calling-rest-apis': [
    Q('Does URLSession throw an error for a 404 response?', ['No, you must check the status code yourself', 'Yes, always', 'Only on Wi-Fi'], 0),
    Q('What is Codable used for?', ['Turning a struct into JSON and back', 'Drawing a button', 'Testing the app'], 0),
    Q('Where should a private API key be kept?', ['On your own server, not inside the app', 'In the app code', 'In the app icon'], 0, 'Anything inside an app can be extracted.'),
  ],
  'swiftdata-save-data-on-iphone': [
    Q('Which macro makes a class storable with SwiftData?', ['@Model', '@State', '@Binding'], 0),
    Q('How do you read stored objects into a SwiftUI view?', ['@Query', '@AppStorage', 'URLSession'], 0),
    Q('What is the best tool for one small setting such as a currency code?', ['@AppStorage', 'A full database', 'A new class'], 0),
  ],
  'mvvm-observable-and-dependency-injection-in-swiftui': [
    Q('In MVVM, what does the view model hold?', ['The state and logic the view needs', 'The colours of the buttons', 'The app icon'], 0),
    Q('What is dependency injection?', ['A type receives what it needs from outside instead of creating it', 'A way to delete code', 'A kind of error'], 0, 'With a protocol you can inject a fake in tests and previews.'),
    Q('Which macro, for iOS 17 and up, makes a class observable by SwiftUI views?', ['@Observable', '@Published', '@main'], 0),
  ],
  'testing-ios-apps-swift-testing-xctest-and-xcuitest': [
    Q('Which Swift Testing macro marks a test function?', ['@Test', '@Model', '@Query'], 0),
    Q('Why give a view model a fake service in a unit test?', ['The test is fast and gives the same result every time', 'To use the real internet', 'To avoid writing assertions'], 0),
    Q('What helps a UI test find a button reliably?', ['An accessibility identifier', 'A different colour', 'A longer title'], 0),
  ],
  'testflight-app-store-uikit-and-ios-interview-preparation': [
    Q('What is TestFlight used for?', ['Sending beta builds to testers before release', 'Writing Swift code', 'Designing icons'], 0),
    Q('Which Xcode step creates the build you upload to App Store Connect?', ['Product > Archive', 'Product > Clean', 'File > New'], 0),
    Q('How can a SwiftUI view be shown inside a UIKit screen?', ['UIHostingController', 'NavigationStack', 'ModelContainer'], 0),
  ],
};
