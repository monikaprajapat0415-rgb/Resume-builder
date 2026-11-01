const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'advanced-ios-development-course';
export const quizzes = {
  'swift-generics-protocol-oriented-programming-and-property-wrappers': [
    Q('What does the constraint in func largest<T: Comparable> do?', ['It says T can be any type that can be compared', 'It makes T a class', 'It makes the function async'], 0),
    Q('What does some Repository mean?', ['One specific type the compiler knows but you do not name', 'A box that holds any type at run time', 'A class that inherits Repository'], 0, 'any is the box that holds different types.'),
    Q('Which of these is a property wrapper?', ['@State', 'struct', 'func'], 0),
  ],
  'advanced-swift-concurrency-taskgroup-asyncstream-sendable': [
    Q('In what order do TaskGroup results arrive?', ['The order the tasks finish', 'The order you added them', 'Alphabetical order'], 0, 'Key results by an id.'),
    Q('What does cancelling a task do?', ['Sets a flag the task must check', 'Stops the task at once by force', 'Deletes its results'], 0),
    Q('When is a class Sendable?', ['When it is final and its stored properties are immutable', 'When it has a var property', 'Always'], 0),
  ],
  'swift-memory-management-arc-retain-cycles-and-instruments': [
    Q('What is a retain cycle?', ['Objects holding strong references to each other so they are never freed', 'A loop that runs forever', 'A copy of a struct'], 0),
    Q('What happens if you use an unowned reference after its object is freed?', ['The app crashes', 'It becomes nil', 'Nothing'], 0, 'weak becomes nil, unowned does not.'),
    Q('Which tool in Xcode helps find leaked objects?', ['Debug Memory Graph and Instruments Leaks', 'The Simulator language menu', 'The asset catalog'], 0),
  ],
  'combine-publishers-and-async-sequences-in-ios': [
    Q('Why must you store the AnyCancellable from sink?', ['If it is released the subscription ends', 'To make it faster', 'To change its type'], 0),
    Q('What does debounce do?', ['Waits until values stop arriving for a moment', 'Repeats every value twice', 'Sorts values'], 0),
    Q('Which fits best for one answer later, such as a network call?', ['async/await', 'A PassthroughSubject', 'A global variable'], 0),
  ],
  'advanced-swiftui-custom-modifiers-layout-matchedgeometry-charts': [
    Q('When should you write a ViewModifier?', ['When you repeat the same chain of modifiers in several places', 'Only for animations', 'Never'], 0),
    Q('What does matchedGeometryEffect do?', ['Animates one view into another that is the same element in a new state', 'Matches colours', 'Loads data'], 0),
    Q('Which protocol lets you control exactly how children are measured and placed?', ['Layout', 'Codable', 'Sendable'], 0),
  ],
  'swiftui-navigationpath-router-tabview-and-deep-links': [
    Q('What does changing a NavigationPath from code do?', ['Pushes or pops screens on the stack', 'Deletes the app data', 'Changes the app icon'], 0),
    Q('How should an app treat an incoming deep link?', ['As untrusted input to check', 'As always safe', 'As a command to run at once'], 0),
    Q('Which SwiftUI modifier receives a URL that opened the app?', ['.onOpenURL', '.onAppear', '.task'], 0),
  ],
  'uikit-for-swiftui-developers-interop-auto-layout-and-diffable-data-sources': [
    Q('Where should you set up subviews once in a view controller?', ['viewDidLoad', 'viewDidDisappear', 'deinit'], 0),
    Q('What does UIHostingController do?', ['Shows a SwiftUI view inside UIKit', 'Hosts a web server', 'Draws a table view'], 0),
    Q('What must you set to false on a view you constrain in code?', ['translatesAutoresizingMaskIntoConstraints', 'isHidden', 'clipsToBounds'], 0),
  ],
  'production-networking-layer-keychain-authentication-and-sign-in-with-apple': [
    Q('Where should an access token be stored?', ['In the Keychain', 'In UserDefaults', 'In the source code'], 0),
    Q('Which failed request is worth retrying automatically?', ['A 503 server error', 'A 404 not found', 'A 400 bad request'], 0, 'Use a growing delay, and never auto-retry a payment without an idempotency key.'),
    Q('Why use an actor to refresh a token?', ['So many callers share one refresh instead of making ten', 'To make the token longer', 'To hide the token'], 0),
  ],
  'swiftdata-relationships-migrations-background-work-and-cloudkit': [
    Q('What does deleteRule .cascade do?', ['Deletes the related objects when the parent is deleted', 'Keeps the related objects and clears the link', 'Refuses to delete the parent'], 0),
    Q('How do you import thousands of rows without freezing the screen?', ['Use a ModelActor with its own context', 'Use the main context in a loop', 'Use a bigger phone'], 0),
    Q('Which is a rule for syncing a model with iCloud?', ['Relationships must be optional', 'Every property must be unique', 'No property may have a default'], 0),
  ],
  'core-location-mapkit-notifications-and-background-tasks': [
    Q('When should you ask for location permission?', ['When the feature is first needed, with a clear reason', 'On every launch', 'Never'], 0),
    Q('Where does the APNs key belong?', ['Only on your server', 'Inside the app', 'In the app icon'], 0),
    Q('Can you rely on a background task running at an exact time?', ['No, the system decides when or whether it runs', 'Yes, always', 'Only on Wi-Fi'], 0),
  ],
  'storekit-2-vision-avfoundation-and-healthkit-overview': [
    Q('When is a StoreKit 2 purchase treated as real?', ['When the verification is .verified', 'As soon as the button is tapped', 'When the app restarts'], 0),
    Q('How can you test purchases without real money?', ['A StoreKit configuration file in Xcode', 'Use a friend\'s card', 'You cannot'], 0),
    Q('How many times must a checked continuation be resumed?', ['Exactly once', 'Twice', 'Never'], 0),
  ],
  'modular-ios-architecture-swift-packages-clean-architecture-and-performance': [
    Q('In Clean Architecture, which layer should not import SwiftUI or SwiftData?', ['Domain', 'Presentation', 'The app icon'], 0),
    Q('What is a composition root?', ['The one place where real objects are created and injected', 'The root view', 'A kind of package'], 0),
    Q('What should you do before optimising performance?', ['Measure with Instruments', 'Rewrite everything', 'Add more caches'], 0),
  ],
  'ios-ci-cd-fastlane-github-actions-xcode-cloud-and-release-engineering': [
    Q('What should CI do on every pull request?', ['Build the app and run the tests on a clean machine', 'Publish to the App Store', 'Delete old branches'], 0),
    Q('What is a feature flag?', ['A switch that turns code on or off without a new release', 'A kind of crash report', 'An App Store badge'], 0),
    Q('Where should signing keys and API keys be kept in CI?', ['In the CI secrets, never in the repository', 'In the README', 'In a public folder'], 0),
  ],
  'senior-ios-developer-interview-preparation-and-system-design': [
    Q('In an offline-first app, what is the source of truth for the screen?', ['The local database', 'The server only', 'A global variable'], 0),
    Q('What makes a system design answer strong?', ['Naming the trade-offs of your choices', 'Listing as many tools as possible', 'Saying there is one right answer'], 0),
    Q('Which portfolio is stronger?', ['Three or four finished, well explained projects', 'Ten unfinished projects', 'Only screenshots'], 0),
  ],
};
