import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;
const S2 = 'Advanced UI and Navigation';
const S3 = 'Networking and Security';

export const lessons = [
  // ---------------------------------------------------------------- 5
  les(S2, 'advanced-swiftui-custom-modifiers-layout-matchedgeometry-charts', 'Advanced SwiftUI: Modifiers, Custom Layout, Animation and Charts', 'Advanced SwiftUI: Modifiers, Layout, Charts',
    'Build reusable SwiftUI parts with ViewModifier and ViewBuilder, write a custom Layout, animate between states with matchedGeometryEffect, and draw charts.', [
    P("Once you can build screens, the next skill is building **parts**: small, reusable pieces that give a whole app one consistent look and make each screen shorter. This lesson shows the SwiftUI tools for that, then two features that make apps feel polished: shared-element animation and charts. All of them need iOS 16 or newer, and most need nothing beyond what you already know."),
    H("ViewModifier: reuse a style"),
    P("If you repeat the same chain of modifiers, such as padding, background, corners and shadow, wrap it in a `ViewModifier`. Add a small extension so the call reads like a built-in modifier."),
    C('swift', S`import SwiftUI

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.background, in: RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.1), radius: 6, y: 2)
    }
}

extension View {
    func card() -> some View { modifier(CardStyle()) }
}

// use
Text("Hello").card()`),
    H("ViewBuilder: containers that accept views"),
    P("A view that takes other views as its content uses a **`@ViewBuilder`** property. This is how `VStack { ... }` works, and you can write your own."),
    C('swift', S`struct TitledCard<Content: View>: View {
    let title: String
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
    }
}

// use
TitledCard(title: "This month") {
    Text("Food: 120")
    Text("Travel: 60")
}`),
    H("A custom Layout"),
    P("The `Layout` protocol (iOS 16 and up) lets you decide exactly how children are measured and placed, when stacks and grids are not enough. You write two methods: one that reports the total size, and one that places each child. This example makes every child as wide as the widest one."),
    C('swift', S`struct EqualWidthHStack: Layout {
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
        let width = sizes.map(\.width).max() ?? 0
        let height = sizes.map(\.height).max() ?? 0
        return CGSize(width: width * CGFloat(subviews.count), height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let width = subviews.map { $0.sizeThatFits(.unspecified).width }.max() ?? 0
        for (index, subview) in subviews.enumerated() {
            subview.place(
                at: CGPoint(x: bounds.minX + CGFloat(index) * width, y: bounds.minY),
                proposal: ProposedViewSize(width: width, height: bounds.height)
            )
        }
    }
}

// use
EqualWidthHStack {
    Button("OK") {}
    Button("Cancel, maybe later") {}
}`),
    N("Most layouts do not need a custom `Layout`. Try stacks, `Grid`, `LazyVGrid` and `ViewThatFits` first. Reach for `Layout` when you have a rule they cannot express, such as a wrapping row of tags."),
    H("matchedGeometryEffect: shared-element animation"),
    P("`matchedGeometryEffect` tells SwiftUI that two views in different states are *the same thing*, so it moves and resizes one into the other. The classic use is a selection highlight that slides between tabs."),
    C('swift', S`struct PeriodPicker: View {
    @Namespace private var namespace
    @State private var selected = 0
    private let titles = ["Day", "Week", "Month"]

    var body: some View {
        HStack {
            ForEach(titles.indices, id: \.self) { index in
                Text(titles[index])
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background {
                        if selected == index {
                            Capsule()
                                .fill(.blue.opacity(0.2))
                                .matchedGeometryEffect(id: "highlight", in: namespace)
                        }
                    }
                    .onTapGesture {
                        withAnimation(.easeInOut) { selected = index }
                    }
            }
        }
    }
}`),
    P("Only one capsule exists at a time, with the same `id` and `namespace`, so when `selected` changes SwiftUI animates it from the old place to the new one. The same idea can grow a thumbnail into a full-screen image."),
    H("Charts"),
    P("Apple's **Charts** framework draws bar, line, area and other charts from your data in a few lines, with accessibility and Dark Mode built in. Each data point becomes a *mark*, and you say which values map to which axis."),
    C('swift', S`import Charts
import SwiftUI

struct CategoryTotal: Identifiable {
    let id = UUID()
    let name: String
    let amount: Double
}

struct SpendingChart: View {
    let totals = [
        CategoryTotal(name: "Food", amount: 120),
        CategoryTotal(name: "Travel", amount: 60),
        CategoryTotal(name: "Fun", amount: 45)
    ]

    var body: some View {
        Chart(totals) { item in
            BarMark(
                x: .value("Category", item.name),
                y: .value("Amount", item.amount)
            )
            .foregroundStyle(by: .value("Category", item.name))
        }
        .frame(height: 220)
    }
}`),
    H("Performance habits for SwiftUI"),
    L("**Cheap bodies.** The `body` runs often. Do not sort big arrays, format many dates or decode JSON inside it. Compute once, and keep the result in state or the view model.", "**Stable identity.** Give `ForEach` a stable `id`. An id that changes each time makes SwiftUI throw away and rebuild rows.", "**Lazy containers.** Use `LazyVStack` or `List` for long content, and an ordinary `VStack` for a few views.", "**Small views.** When one value changes, only the views that read it are redrawn. Splitting a big body into small views keeps redraws small.", "**Measure, do not guess.** Xcode has a SwiftUI template in Instruments that shows how often views update."),
    H("Accessibility and Dark Mode in reusable parts"),
    P("The great advantage of reusable parts is that you fix a problem once. Build accessibility into them from the start. In `CardStyle`, use semantic colours such as `.background` and `.primary`, so Dark Mode works without extra code. In a custom control, add `.accessibilityLabel(\"...\")` and, where it makes sense, `.accessibilityAddTraits(.isButton)`. Text that uses `.font(.body)` or another text style grows when people choose larger text in Settings, so avoid fixed point sizes. Preview your parts in several settings at once, for example Dark Mode with the largest text size, using the Xcode preview variants. Ten minutes spent here saves many support emails later, and it is a point interviewers like to hear."),
    H("Common mistakes"),
    L("Copying the same five modifiers on every screen instead of making a `ViewModifier`.", "A `matchedGeometryEffect` where the same id appears twice at once, which confuses the animation.", "Using `GeometryReader` for everything. It takes all the space it is given, and often a simpler tool is better."),
    ...task("Make `CardStyle` and `TitledCard` and use them on two screens of your app.", "Write `EqualWidthHStack` and compare it with a normal `HStack` of two buttons with different text lengths.", "Build the `PeriodPicker` and check that the highlight slides.", "Draw the spending chart from your own expense data, grouped by category."),
    ...check("Changing `CardStyle` in one place changes every card.", "The highlight moves smoothly between Day, Week and Month.", "You can name three habits that keep a SwiftUI screen fast."),
  ], A('Reusable parts', [
    n('base', 'Plain view', 'Text("Hello")', 0, 0, 'data'), n('mod', 'ViewModifier', 'CardStyle', 1, 0, 'tool'),
    n('ext', 'card()', 'one-word call', 2, 0, 'check'), n('many', 'Many screens', 'same look', 3, 0, 'out'),
  ], [
    { say: 'You start with a plain view and a chain of modifiers you keep repeating.', on: ['base'] },
    { say: 'You move the chain into a ViewModifier, written once.', flow: ['base>mod:wrap'] },
    { say: 'A small extension gives it a short name such as card().', flow: ['mod>ext:name'] },
    { say: 'Every screen uses the same call, so one change updates the whole app.', flow: ['ext>many:reuse'] },
  ]), [
    faq('When should I write a custom ViewModifier?', 'When you repeat the same chain of modifiers in several places. Put it in a ViewModifier and add a View extension so the call is short and the style lives in one place.'),
    faq('What is matchedGeometryEffect used for?', 'It tells SwiftUI that two views in different states are the same element, so it animates one into the other. A sliding tab highlight is a common example.'),
    faq('Which iOS version do the Charts framework and the Layout protocol need?', 'Both arrived in iOS 16, so they work if your minimum version is iOS 16 or newer.'),
  ]),

  // ---------------------------------------------------------------- 6
  les(S2, 'swiftui-navigationpath-router-tabview-and-deep-links', 'SwiftUI Navigation at Scale: NavigationPath, Router, TabView and Deep Links', 'SwiftUI NavigationPath and Deep Links',
    'Control navigation from code with NavigationPath, build a small Router, organise an app with TabView, and open screens from deep links and Universal Links.', [
    P("In the beginner course, a tap on a row pushed a screen. Real apps need more. A notification should open a particular expense. A button deep in a flow should jump back to the start. A link on a web page should open the app on the right screen. For all of these, navigation must be something your **code** can control, and not only the user's taps. This lesson shows how."),
    H("NavigationPath: the stack as data"),
    P("`NavigationStack(path:)` takes a binding to the list of screens currently on the stack. If you change the list, the screens change. Push by appending, pop by removing, go back to the start by emptying it. `NavigationPath` holds values of mixed types, and an array works when all screens use one type."),
    C('swift', S`import SwiftUI

enum Route: Hashable {
    case expense(UUID)
    case settings
    case category(String)
}

struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                Button("Open settings") { path.append(Route.settings) }
                Button("Open food") { path.append(Route.category("Food")) }
            }
            .navigationTitle("Home")
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .expense(let id): Text("Expense \(id)")
                case .settings: Text("Settings")
                case .category(let name): Text("Category \(name)")
                }
            }
        }
    }
}`),
    P("Using one `Route` enum for the whole stack is a tidy habit. All the places you can go are listed in one type, and the `switch` makes sure every case has a screen."),
    H("A small Router"),
    P("When many views need to navigate, hand them one shared object. With the `@Observable` macro from iOS 17, the object is a plain class, and any view that reads `path` redraws when it changes."),
    C('swift', S`import SwiftUI
import Observation

@MainActor
@Observable
final class Router {
    var path = NavigationPath()

    func push(_ route: Route) { path.append(route) }
    func pop() { if !path.isEmpty { path.removeLast() } }
    func popToRoot() { path = NavigationPath() }

    func handle(_ url: URL) {
        guard url.scheme == "expensetracker", url.host == "expense",
              let id = UUID(uuidString: url.lastPathComponent) else { return }
        popToRoot()
        push(.expense(id))
    }
}

struct AppRoot: View {
    @State private var router = Router()

    var body: some View {
        NavigationStack(path: $router.path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .expense(let id): ExpenseScreen(id: id)
                    case .settings: SettingsScreen()
                    case .category(let name): CategoryScreen(name: name)
                    }
                }
        }
        .environment(router)
        .onOpenURL { url in router.handle(url) }
    }
}

// in any child view
struct HomeView: View {
    @Environment(Router.self) private var router
    var body: some View {
        Button("Settings") { router.push(.settings) }
    }
}`),
    L("`.environment(router)` puts the router where every child can find it with `@Environment(Router.self)`.", "`handle(_:)` reads a link such as `expensetracker://expense/<id>`, empties the stack, then pushes the target. Starting from a clean stack avoids odd back buttons.", "This is the idea behind the **Coordinator** pattern from UIKit, in a smaller form. One object decides where the app goes, and screens only ask."),
    N("`ExpenseScreen`, `SettingsScreen`, `CategoryScreen` and `HomeView` in this example are small views you write yourself. Any placeholder `Text` view will do while you test."),
    H("TabView"),
    P("A `TabView` gives an app its tab bar. Each tab usually has its own `NavigationStack` with its own history, so switching tabs does not lose your place."),
    C('swift', S`enum AppTab: Hashable { case expenses, charts, settings }

struct MainTabs: View {
    @State private var selection: AppTab = .expenses

    var body: some View {
        TabView(selection: $selection) {
            NavigationStack { Text("Expenses") }
                .tabItem { Label("Expenses", systemImage: "list.bullet") }
                .tag(AppTab.expenses)

            NavigationStack { Text("Charts") }
                .tabItem { Label("Charts", systemImage: "chart.bar") }
                .tag(AppTab.charts)

            NavigationStack { Text("Settings") }
                .tabItem { Label("Settings", systemImage: "gear") }
                .tag(AppTab.settings)
        }
    }
}`),
    P("Because the selection is a value, a deep link can also switch tabs by setting `selection`. Newer iOS versions add a new `Tab` type for building tab bars. The `tabItem` form above works on all the versions this course targets."),
    H("Deep links"),
    L("**Custom URL scheme** such as `expensetracker://expense/123`. In Xcode, open your target, then **Info > URL Types**, and add the scheme. Easy to set up, but any app can claim the same scheme.", "**Universal Links** such as `https://example.com/expense/123`. The web address opens your app if it is installed, and the website if not. You add the **Associated Domains** capability with `applinks:example.com`, and host an `apple-app-site-association` file on your website, over HTTPS, listing the paths your app handles. The details of the file are in Apple's documentation and change with iOS versions, so read the current page before you set it up.", "Both arrive in SwiftUI through `.onOpenURL`, as above. Notification taps usually carry a URL or an id in their payload, which you hand to the same `handle` function."),
    N("Treat every incoming link as **untrusted input**. A link can be made by anyone. Check the scheme, the host and the format of each part, and never run actions such as deleting or paying straight from a link without asking the user."),
    H("Keeping place: state restoration"),
    P("People expect to come back to where they were. `@SceneStorage` keeps small values, such as the selected tab, across launches of a scene, and `NavigationPath` has a `codable` form you can save and restore when all your route types are `Codable`. Use it for the main flows, and do not worry about restoring every sheet."),
    H("Common mistakes"),
    L("A route enum that holds big objects. Put an id in the route and load the object in the destination.", "Two `NavigationStack`s nested by accident, which gives two title bars.", "Opening a link without checking that the data still exists. Show a clear *not found* message."),
    ...task("Add a `Route` enum and a `Router` to your Expense Tracker.", "Register the URL scheme and test it in the Simulator with `xcrun simctl openurl booted \"expensetracker://expense/<an id from your data>\"`.", "Put the app in a `TabView` with a separate stack in each tab.", "Add a *popToRoot* button on a detail screen and check that it works from three levels deep."),
    ...check("Opening the link in the Simulator shows the right expense, even from another tab or screen.", "Each tab keeps its own history.", "You can say why an incoming link must be treated as untrusted input."),
  ], A('Open a screen from a link', [
    n('link', 'URL', 'expensetracker://expense/1', 0, 0, 'data'), n('open', '.onOpenURL', 'receives the link', 1, 0, 'tool'),
    n('router', 'Router', 'validates, sets path', 2, 0, 'check'), n('screen', 'Expense screen', 'pushed on the stack', 3, 0, 'out'),
  ], [
    { say: 'A link arrives from a notification, a web page or another app.', on: ['link'] },
    { say: 'SwiftUI passes it to onOpenURL.', flow: ['link>open:URL'] },
    { say: 'The router checks the scheme, host and id, then clears the stack and appends a route.', flow: ['open>router:handle'] },
    { say: 'The navigation stack shows the screen for that route.', flow: ['router>screen:path changes'] },
  ]), [
    faq('What is NavigationPath in SwiftUI?', 'A list of the screens currently on a NavigationStack. Changing it from code pushes or pops screens, which lets you navigate from notifications, links and buttons deep in a flow.'),
    faq('What is the difference between a URL scheme and a Universal Link?', 'A URL scheme is a custom prefix such as myapp:// that any app may claim. A Universal Link is a normal https address that opens your app if installed and the website if not, and it needs a file on your domain and the Associated Domains capability.'),
    faq('Do I need the Coordinator pattern in SwiftUI?', 'Usually not in its UIKit form. A small Router with a NavigationPath gives the same benefit, one place that decides where the app goes.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'uikit-for-swiftui-developers-interop-auto-layout-and-diffable-data-sources', 'UIKit for SwiftUI Developers: Interop, Auto Layout and Table Views', 'UIKit for SwiftUI Developers',
    'Learn the UIKit you will meet at work: view controller life cycle, Auto Layout in code, diffable table views, and mixing UIKit with SwiftUI in both directions.', [
    P("Many companies started their apps before SwiftUI existed, and a rewrite is rarely worth the risk. If you join such a team, most of your day is in **UIKit**. Even a brand new SwiftUI app will use UIKit through the camera, the map or a text view that SwiftUI does not cover well. This lesson gives you enough UIKit to read a code base, fix a bug and add a screen. It does not try to teach all of it."),
    H("The mental model"),
    L("A screen is a **view controller** (`UIViewController`). It owns a **view**, which owns smaller views.", "UIKit is **imperative**: you create views, set properties, and change them yourself when data changes. SwiftUI describes the result, and UIKit gives the steps.", "UIKit is built on classes, so the memory rules of lesson 3 apply. Delegates must be `weak`, and closures stored on the controller need `[weak self]`."),
    H("The view controller life cycle"),
    C('swift', S`import UIKit

final class ExpenseDetailViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // the view is loaded: create subviews, set constraints (runs once)
    }
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // about to show: refresh data (runs every time)
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // visible: start animations
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        // about to leave: save, stop work
    }
}`),
    P("The order matters in interviews and in bugs. Set things up once in `viewDidLoad`. Refresh in `viewWillAppear`, which runs again when the user comes back with the back button. Do not measure sizes in `viewDidLoad`, because the layout is not final there."),
    H("Auto Layout in code"),
    P("**Auto Layout** places views with *constraints*, rules such as *this label's top is 16 points below the safe area* and *this button is centred*. You can set them in Interface Builder (a storyboard or a `.xib` file), or in code. Code is easier to review in Git and to merge between people, and many teams prefer it."),
    C('swift', S`final class SummaryViewController: UIViewController {
    private let titleLabel = UILabel()
    private let actionButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground

        titleLabel.text = "This month"
        titleLabel.font = .preferredFont(forTextStyle: .title2)
        actionButton.setTitle("Add expense", for: .normal)

        [titleLabel, actionButton].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview($0)
        }

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24),
            titleLabel.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor),
            actionButton.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            actionButton.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
    }
}`),
    L("Always set `translatesAutoresizingMaskIntoConstraints = false` on views you constrain yourself. Forgetting it is the most common Auto Layout bug.", "Give every view enough constraints to know its **position and size**. If the console prints *Unable to simultaneously satisfy constraints*, two rules disagree, and the message names them.", "Use `UIStackView` for rows and columns, as you would `HStack` and `VStack`.", "Use `.preferredFont(forTextStyle:)` so text follows the user's size setting."),
    H("A table view with a diffable data source"),
    P("`UITableView` is the ancestor of `List`. The modern way to feed it is a **diffable data source**. You give it a *snapshot*, a description of what should be shown, and it works out what to insert, delete and move, with animation. This replaces the old index-path bookkeeping that caused many crashes."),
    C('swift', S`struct ExpenseItem: Hashable {
    let id = UUID()
    let title: String
}

final class ExpenseListViewController: UITableViewController {
    private lazy var dataSource = UITableViewDiffableDataSource<Int, ExpenseItem>(tableView: tableView) {
        tableView, indexPath, item in
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        content.text = item.title
        cell.contentConfiguration = content
        return cell
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Expenses"
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        apply([ExpenseItem(title: "Coffee"), ExpenseItem(title: "Train")])
    }

    func apply(_ items: [ExpenseItem]) {
        var snapshot = NSDiffableDataSourceSnapshot<Int, ExpenseItem>()
        snapshot.appendSections([0])
        snapshot.appendItems(items)
        dataSource.apply(snapshot, animatingDifferences: true)
    }
}`),
    P("`dequeueReusableCell` is the key idea of table views. The table does not create a cell for every row. It reuses the few cells that are on screen, which keeps long lists fast. This is also why a cell must be fully set up each time it is configured. A leftover value from the previous row is a classic bug."),
    H("SwiftUI inside UIKit, and UIKit inside SwiftUI"),
    P("Both directions are supported, so you can move an app screen by screen."),
    C('swift', S`// SwiftUI inside UIKit
let host = UIHostingController(rootView: ExpenseChart())
navigationController?.pushViewController(host, animated: true)

// UIKit inside SwiftUI: wrap a UITextField and report changes back
struct SearchField: UIViewRepresentable {
    @Binding var text: String

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> UITextField {
        let field = UITextField()
        field.placeholder = "Search"
        field.borderStyle = .roundedRect
        field.addTarget(context.coordinator, action: #selector(Coordinator.changed(_:)), for: .editingChanged)
        return field
    }

    func updateUIView(_ field: UITextField, context: Context) {
        if field.text != text { field.text = text }
    }

    final class Coordinator: NSObject {
        var parent: SearchField
        init(_ parent: SearchField) { self.parent = parent }
        @objc func changed(_ sender: UITextField) { parent.text = sender.text ?? "" }
    }
}`),
    L("`UIViewRepresentable` has `makeUIView` (create once) and `updateUIView` (called when SwiftUI state changes). The **Coordinator** is a helper class that receives UIKit's delegate and target-action calls and passes them back through the binding.", "`UIViewControllerRepresentable` is the same idea for a whole view controller, such as a camera picker.", "`UIHostingController` is a view controller that shows a SwiftUI view."),
    H("Core Animation and UIView animation"),
    P("UIKit views are backed by **layers** from Core Animation. For simple changes, you rarely need to touch them. `UIView.animate` animates changes to properties such as `alpha`, `frame` and `transform`. When you need more, such as a pulsing effect, use a `CABasicAnimation` on the layer."),
    C('swift', S`UIView.animate(withDuration: 0.3) {
    badgeView.alpha = 1
    badgeView.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
}

let pulse = CABasicAnimation(keyPath: "transform.scale")
pulse.fromValue = 1.0
pulse.toValue = 1.15
pulse.duration = 0.6
pulse.autoreverses = true
pulse.repeatCount = .infinity
badgeView.layer.add(pulse, forKey: "pulse")`),
    H("Common mistakes"),
    L("A delegate property that is not `weak`, which leaks the controller.", "Changing the screen from a background thread. UIKit must be used on the main thread.", "Heavy work in `cellForRowAt` or in the diffable data source closure, which makes scrolling jerky.", "Mixing manual `frame` values with Auto Layout on the same view."),
    ...task("Make a view controller with a label and a button laid out with constraints, and check it in a small and a large iPhone.", "Build the diffable table view and add a button that appends a new item with animation.", "Wrap `UITextField` in `UIViewRepresentable` and use it in a SwiftUI form.", "Show a SwiftUI view inside a `UIHostingController` pushed from a UIKit screen."),
    ...check("The constraints give no warnings in the console on any iPhone size.", "A new item appears in the table with an animation, and no manual index paths are used.", "You can list the life cycle methods in the order they run, and say what belongs in each."),
  ], A('UIKit and SwiftUI together', [
    n('uik', 'UIKit screen', 'view controller', 0, 0, 'app'), n('host', 'UIHostingController', 'carries SwiftUI', 1, 0, 'tool'),
    n('sui', 'SwiftUI view', 'new screen', 2, 0, 'data'), n('rep', 'UIViewRepresentable', 'wraps UIKit', 3, 0, 'check'),
  ], [
    { say: 'An older UIKit app is made of view controllers.', on: ['uik'] },
    { say: 'A UIHostingController lets a UIKit screen show a SwiftUI view, so new screens can use SwiftUI.', flow: ['uik>host:embeds'] },
    { say: 'The SwiftUI view runs inside it as normal.', flow: ['host>sui:renders'] },
    { say: 'The other way round, UIViewRepresentable wraps a UIKit view for use in SwiftUI.', flow: ['sui>rep:needs UIKit'] },
  ]), [
    faq('Do I still need to learn UIKit in 2026?', 'Yes, if you want to work on existing apps. Many companies still have large UIKit code bases, and even SwiftUI apps use UIKit for features SwiftUI does not cover well.'),
    faq('What is a diffable data source?', 'A modern way to feed a table or collection view with a snapshot of what should be shown. It works out the inserts, deletes and moves for you, with animation, and avoids index-path bugs.'),
    faq('What is the Coordinator in UIViewRepresentable?', 'A helper class that receives UIKit delegate and target-action calls and passes the results back to SwiftUI, for example by updating a binding.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S3, 'production-networking-layer-keychain-authentication-and-sign-in-with-apple', 'A Production Networking Layer: Auth Tokens, Retry, Keychain and Face ID', 'iOS Networking Layer, Keychain and Auth',
    'Build a clean API client with endpoints, token refresh and retry, store secrets in the Keychain, add Face ID, and know the rules for Sign in with Apple.', [
    P("The weather call in the beginner course was fine for a demo. A real app calls dozens of endpoints, signs requests with a token that expires, survives bad connections, and must keep that token somewhere safe. If each screen builds its own request, the code becomes copy and paste, and bugs multiply. This lesson builds the layer that sits between screens and the network, and then the safe storage and sign-in pieces around it."),
    H("Describe endpoints as values"),
    P("Instead of building URLs inside each view model, describe each call in one place, as a small type. Then one client sends them all."),
    C('swift', S`import Foundation

enum HTTPMethod: String {
    case get = "GET", post = "POST", put = "PUT", delete = "DELETE"
}

protocol Endpoint {
    var path: String { get }
    var method: HTTPMethod { get }
    var queryItems: [URLQueryItem] { get }
    var body: Data? { get }
}

extension Endpoint {
    var method: HTTPMethod { .get }
    var queryItems: [URLQueryItem] { [] }
    var body: Data? { nil }
}

struct ListExpenses: Endpoint {
    let path = "/v1/expenses"
    let queryItems: [URLQueryItem]
    init(month: String) { queryItems = [URLQueryItem(name: "month", value: month)] }
}`),
    P("The protocol extension from lesson 1 supplies defaults, so a simple endpoint needs only a path. Adding an endpoint is now a few lines in one file, and a view model never sees a URL."),
    H("One client for all calls"),
    C('swift', S`enum NetworkError: Error {
    case badURL
    case badStatus(Int)
    case unauthorized
}

struct APIClient {
    let baseURL: URL
    let session: URLSession
    let auth: AuthTokenProviding

    func send<T: Decodable>(_ endpoint: some Endpoint, as type: T.Type = T.self) async throws -> T {
        var attempt = 0
        while true {
            do {
                return try await perform(endpoint)
            } catch let error as NetworkError where error.isRetryable && attempt < 2 {
                attempt += 1
                try await Task.sleep(for: .seconds(pow(2, Double(attempt))))   // 2 s, then 4 s
            }
        }
    }

    private func perform<T: Decodable>(_ endpoint: some Endpoint) async throws -> T {
        guard var parts = URLComponents(url: baseURL.appendingPathComponent(endpoint.path),
                                        resolvingAgainstBaseURL: false) else { throw NetworkError.badURL }
        if !endpoint.queryItems.isEmpty { parts.queryItems = endpoint.queryItems }
        guard let url = parts.url else { throw NetworkError.badURL }

        var request = URLRequest(url: url, timeoutInterval: 20)
        request.httpMethod = endpoint.method.rawValue
        request.httpBody = endpoint.body
        let token = try await auth.validToken()
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw NetworkError.badStatus(-1) }
        switch http.statusCode {
        case 200..<300: return try JSONDecoder().decode(T.self, from: data)
        case 401: throw NetworkError.unauthorized
        default: throw NetworkError.badStatus(http.statusCode)
        }
    }
}

extension NetworkError {
    var isRetryable: Bool {
        if case .badStatus(let code) = self { return code >= 500 }
        return false
    }
}`),
    L("**Retry only what can succeed on a second try.** Server errors (5xx) and timeouts may. A 400 or 404 will fail again, so do not retry them.", "**Back off.** Wait longer after each failure, here 2 s and then 4 s. Hammering a struggling server makes it worse.", "**Never retry a request that changes data** (a payment, a purchase) unless the server supports an *idempotency key*, so a repeat cannot charge twice.", "**Set a timeout** so a slow connection ends in an error and not an endless spinner."),
    H("Refreshing the token once, not ten times"),
    P("An access token expires, and a refresh token gets a new one. If ten requests start at once with an expired token, you do not want ten refresh calls. An **actor** is the right tool: it holds one shared refresh task, and every caller waits for the same one."),
    C('swift', S`protocol AuthTokenProviding {
    func validToken() async throws -> String
}

actor TokenStore: AuthTokenProviding {
    private var accessToken: String?
    private var expiry: Date = .distantPast
    private var refreshTask: Task<String, Error>?

    func validToken() async throws -> String {
        if let accessToken, expiry > Date().addingTimeInterval(30) { return accessToken }
        if let refreshTask { return try await refreshTask.value }

        let task = Task { try await self.refresh() }
        refreshTask = task
        defer { refreshTask = nil }
        return try await task.value
    }

    private func refresh() async throws -> String {
        // call your server with the refresh token from the Keychain, then:
        let newToken = "new-access-token"
        accessToken = newToken
        expiry = Date().addingTimeInterval(15 * 60)
        return newToken
    }
}`),
    N("The `refresh()` body above is a placeholder, because every server has its own refresh call. Notice the check after the `await`: the actor is *reentrant*, as lesson 2 explained, so the shared `refreshTask` is what stops two refreshes from running at once."),
    H("The Keychain: where secrets live"),
    P("Never keep tokens, passwords or keys in `UserDefaults`, in a plain file or in the code. Those are easy to read from a backup or a device that has been opened. The **Keychain** is the system's encrypted store for small secrets, and it is the correct place. Its API is old and written in C, so most teams wrap it in a small type, as below."),
    C('swift', S`import Foundation
import Security

enum KeychainError: Error { case failed(OSStatus) }

enum Keychain {
    private static func baseQuery(_ account: String) -> [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "com.example.expensetracker",
         kSecAttrAccount as String: account]
    }

    static func save(_ data: Data, account: String) throws {
        SecItemDelete(baseQuery(account) as CFDictionary)
        var query = baseQuery(account)
        query[kSecValueData as String] = data
        query[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else { throw KeychainError.failed(status) }
    }

    static func load(account: String) throws -> Data? {
        var query = baseQuery(account)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess else { throw KeychainError.failed(status) }
        return result as? Data
    }

    static func delete(account: String) {
        SecItemDelete(baseQuery(account) as CFDictionary)
    }
}`),
    P("Replace the service name with your own bundle identifier. The setting `WhenUnlockedThisDeviceOnly` means that the item is readable only while the phone is unlocked and is not copied to other devices through a backup. Log out by deleting the item."),
    H("Face ID and Touch ID"),
    P("The `LocalAuthentication` framework asks the system to check the person's face or fingerprint. You never see the biometric data. You only learn whether it worked. You must add a short **Face ID usage description** to your app's Info settings, or the app will be stopped when it asks."),
    C('swift', S`import LocalAuthentication

func unlockWithBiometrics() async -> Bool {
    let context = LAContext()
    var error: NSError?
    guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else { return false }
    do {
        return try await context.evaluatePolicy(
            .deviceOwnerAuthentication,
            localizedReason: "Unlock your expenses")
    } catch {
        return false
    }
}`),
    P("`.deviceOwnerAuthentication` lets the person fall back to the device passcode if the face or finger does not work. That is kinder and safer than blocking them."),
    H("Sign in with Apple, and other rules"),
    L("**Sign in with Apple** lets people create an account without sharing their email address. SwiftUI has a ready-made `SignInWithAppleButton`, and it needs the *Sign in with Apple* capability in your target. Apple's App Review Guidelines may require you to offer it if your app offers other third-party sign-in options. Read the current guideline before you submit.", "**Account deletion:** Apple requires apps that let people create an account to also let them delete it from inside the app. Check the current rules and plan this early.", "**HTTPS only.** App Transport Security blocks plain `http`. Avoid turning it off.", "**Certificate pinning** (only trusting your own server's certificate) can add safety for banking-like apps, but it also breaks when you change certificates. Use it only if you can manage that.", "**Do not log secrets.** Never print tokens or passwords, even in debug builds."),
    H("Common mistakes"),
    L("Tokens in `UserDefaults`.", "Retrying a payment request automatically.", "Ten parallel refresh calls, because the refresh is not shared.", "Showing the user a raw error such as `badStatus(500)`. Map errors to messages a person can act on."),
    ...task("Make `Endpoint`, three endpoints of your own and the `APIClient`. Point it at any test server you have or at a local mock.", "Write the `TokenStore` actor and test it by starting five requests at once. Print how many times `refresh()` ran. It should be once.", "Store a fake token in the Keychain, read it back, then delete it.", "Add a biometric unlock before a *settings* screen, and add the Face ID usage description."),
    ...check("A 503 response is retried twice with a delay, and a 404 is not retried.", "Five simultaneous calls cause one refresh.", "The token survives an app restart and is gone after logout."),
  ], A('Safe API calls', [
    n('vm', 'View model', 'asks for data', 0, 0, 'app'), n('cl', 'APIClient', 'adds token, retries', 1, 0, 'tool'),
    n('kc', 'Keychain', 'holds the secret', 1, 1, 'store'), n('srv', 'Server', 'checks the token', 2, 0, 'model'),
  ], [
    { say: 'A view model asks the client for an endpoint. It never builds a URL.', on: ['vm'] },
    { say: 'The client builds the request and asks the token store for a valid token.', flow: ['vm>cl:send'] },
    { say: 'The token comes from the Keychain, the encrypted store for small secrets.', flow: ['kc>cl:token'] },
    { say: 'The client sends the request. A temporary server error is retried with a delay, a client error is not.', flow: ['cl>srv:HTTPS'] },
  ]), [
    faq('Where should an iOS app store an access token?', 'In the Keychain, the system\'s encrypted store for small secrets. Do not use UserDefaults or plain files, which are easy to read from a backup.'),
    faq('Which failed requests should be retried automatically?', 'Ones that can succeed on a second try, such as server errors (5xx) and timeouts, with a growing delay. Do not retry client errors such as 400 or 404, and do not retry requests that change money or data without an idempotency key.'),
    faq('Is Sign in with Apple required?', 'Apple\'s App Review Guidelines may require it if your app offers other third-party sign-in options, and they also require account deletion inside apps that create accounts. Rules change, so read the current guidelines before you submit.'),
  ]),
];
