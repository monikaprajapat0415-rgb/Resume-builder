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
  'project-2-calculator-app-expression-parser-and-swiftui-keypad': [
    Q('What does the parser calculate first in 2+3*4?', ['3*4', '2+3', '4 only'], 0),
    Q('What does evaluate return for bad input?', ['nil', 'A crash', 'Zero'], 0),
    Q('Why keep Calculator free of SwiftUI imports?', ['So tests can call it directly', 'So it runs slower', 'So it looks nicer'], 0),
  ],
  'project-3-to-do-app-with-swiftdata-search-filters-and-tests': [
    Q('What does @Query do?', ['Fetches models and keeps the list updated', 'Deletes old data', 'Draws a button'], 0),
    Q('Why use an in-memory ModelConfiguration in tests?', ['Each test starts empty and leaves nothing on disk', 'It makes the app faster for users', 'It is required by Xcode'], 0),
    Q('Why must delete(at:) use the filtered list?', ['The swipe positions refer to the shown list', 'SwiftData requires it', 'To sort the items'], 0),
  ],
  'project-4-habit-tracker-streaks-userdefaults-and-date-logic-tests': [
    Q('Why store days as text like 2026-11-10?', ['A day has no time of day to confuse equality', 'It saves disk space only', 'Text is required by Codable'], 0),
    Q('Why use Calendar to get yesterday?', ['Days can have 23 or 25 hours', 'It is shorter code only', 'Dates cannot be subtracted'], 0),
    Q('Why do the streak functions take today and calendar parameters?', ['Tests can use fixed values', 'They make the app slower', 'To avoid Codable'], 0),
  ],
  'project-5-quiz-app-game-state-with-observable-and-swift-testing': [
    Q('What does private(set) do?', ['Others can read the property but only the class can change it', 'Hides the property completely', 'Makes it constant'], 0),
    Q('Why does choose ignore a second tap?', ['It prevents scoring twice', 'Buttons cannot be tapped twice', 'It saves memory'], 0),
    Q('What does the view show when current is nil?', ['The finished screen', 'A crash', 'The first question'], 0),
  ],
  'project-6-recipe-book-app-search-themealdb-api-and-navigationstack': [
    Q('Why is meals optional in RecipeResponse?', ['The service sends null when nothing matches', 'Optionals are faster', 'Codable needs it'], 0),
    Q('What does the debounce do?', ['Waits until the user pauses typing before searching', 'Makes the request faster', 'Caches the images'], 0),
    Q('Why do the tests use a fake service?', ['Tests should not depend on a network', 'Fake services are faster to write only', 'The real service is private'], 0),
  ],
  'project-7-shopping-app-products-cart-in-cents-and-demo-checkout': [
    Q('Why keep prices in cents?', ['Integers add exactly', 'Cents look nicer', 'The API requires it'], 0),
    Q('Where must payment be confirmed?', ['On your server with a payment provider', 'Only in the cart view', 'In UserDefaults'], 0),
    Q('What does the Cart tab badge show?', ['The item count calculated from the lines', 'A fixed number', 'The product count'], 0),
  ],
  'project-8-fitness-tracker-healthkit-steps-and-swift-charts': [
    Q('Why does the app use a protocol for the health service?', ['The Simulator has no step data and tests need fakes', 'Protocols make the chart faster', 'HealthKit requires it'], 0),
    Q('Can the app know if the user denied read access?', ['No, iOS hides it for privacy', 'Yes, always', 'Only on iPad'], 0),
    Q('What does RuleMark draw here?', ['The goal line', 'A bar', 'The axis'], 0),
  ],
  'project-9-music-player-avplayer-now-playing-and-background-audio': [
    Q('What lets audio keep playing when the screen locks?', ['The playback audio session and the Audio background mode', 'A bigger slider', 'Using Combine'], 0),
    Q('Why does the slider use a separate dragPosition?', ['So it does not jump back while the user drags', 'To save memory', 'To format time'], 0),
    Q('What fills the lock screen title?', ['MPNowPlayingInfoCenter', 'AsyncImage', 'Charts'], 0),
  ],
  'project-10-qr-code-scanner-visionkit-datascanner-and-safe-links': [
    Q('What does a Coordinator do?', ['Receives UIKit delegate callbacks for SwiftUI', 'Draws the camera', 'Stores the result'], 0),
    Q('What should the app do with a scanned link?', ['Show it and open only after a tap', 'Open it at once', 'Ignore it'], 0),
    Q('Which URL schemes count as links in the classifier?', ['http and https', 'Every scheme', 'Only tel'], 0),
  ],
  'project-11-ai-chatbot-app-streaming-replies-history-and-a-safe-backend': [
    Q('Where should the AI key live?', ['On your server, not in the app', 'In the app bundle', 'In UserDefaults'], 0),
    Q('What does Stop do?', ['Cancels the task and keeps the partial text', 'Deletes the history', 'Closes the app'], 0),
    Q('Why send only recent messages?', ['The model has no memory and long requests cost more', 'SwiftUI limits it', 'Codable requires it'], 0),
  ],
  'project-12-video-streaming-app-avkit-hls-and-lifecycle-safe-playback': [
    Q('What is HLS?', ['An adaptive streaming format with an .m3u8 playlist', 'A database', 'A layout'], 0),
    Q('Why remove the item when the screen disappears?', ['It frees network connections and decoders', 'It saves the video', 'It changes quality'], 0),
    Q('What does the status publisher report?', ['Whether the item is ready or failed', 'The video title', 'The screen size'], 0),
  ],
  'project-13-job-portal-app-search-filters-resume-upload-and-multipart': [
    Q('Why does fileImporter need no storage permission?', ['The picker gives access only to the chosen file', 'It is a bug', 'It uses the internet'], 0),
    Q('Why validate the resume on the server too?', ['The app can be bypassed', 'Servers are faster', 'Codable asks for it'], 0),
    Q('What is shown from the job list and the filter?', ['A derived list computed from both', 'A separate stored copy', 'Nothing'], 0),
  ],
  'swift-for-android-developers-kotlin-vs-swift-compose-vs-swiftui': [
    Q('Which Swift type is closest to a Kotlin sealed class?', ['An enum with associated values', 'A plain struct', 'A typealias'], 0),
    Q('Which SwiftUI wrapper is like remember { mutableStateOf() }?', ['@State', '@AppStorage', '@Binding'], 0),
    Q('How are coroutines and suspend functions written in Swift?', ['async/await and Task', 'Callbacks only', 'Threads only'], 0),
  ],
};
