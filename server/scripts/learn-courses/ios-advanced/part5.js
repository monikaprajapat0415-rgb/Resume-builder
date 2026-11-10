import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;
const SEC = 'Quality, Platform and Compliance';
const VERIFY = "Apple renames and changes APIs and review rules often. The code and rules here come from our reading of the documentation and were not compiled or tested in Xcode, so check the current Apple documentation for your Xcode version before you rely on a detail.";

export const lessons = [
  // ---------------------------------------------------------------- 15
  les(SEC, 'ios-accessibility-voiceover-dynamic-type-and-inclusive-design', 'iOS Accessibility: VoiceOver, Dynamic Type and Inclusive Design', 'iOS Accessibility: VoiceOver and Type',
    'Make SwiftUI apps usable for everyone with VoiceOver labels and traits, Dynamic Type, contrast, Reduce Motion, grouped elements and the Accessibility Inspector.', [
    P("Accessibility means that people with different abilities can use your app: someone who cannot see the screen, someone who needs larger text, someone who cannot tap small buttons, or someone who is sensitive to motion. It is also useful to everyone. Big text helps in bright sunlight, and captions help on a noisy train. In many countries accessibility is also a legal requirement for some kinds of apps, and app reviewers and interviewers notice when it is missing."),
    P("Apple's frameworks do a lot of this for you. A standard `Button`, `Toggle`, `List` or `Text` already works with VoiceOver, the built-in screen reader. Your job is to fill the gaps: images with no description, custom controls, and layouts that break when the text gets large."),
    H("VoiceOver: labels, values, hints and traits"),
    P("VoiceOver reads what is under the user's finger. For text it reads the text. For an icon-only button it needs a **label**, or it will read something unhelpful such as the symbol's file name. A **value** reports the current state, such as \"50 percent\". A **hint** explains what happens, such as \"Double tap to delete the task\", and should be short and used only when the label is not enough. **Traits** describe what the element is, such as a button, a header or a selected item."),
    C('swift', S`struct TaskRow: View {
    let title: String
    @Binding var isDone: Bool

    var body: some View {
        HStack {
            Button {
                isDone.toggle()
            } label: {
                Image(systemName: isDone ? "checkmark.circle.fill" : "circle")
            }
            .accessibilityLabel(isDone ? "Completed" : "Not completed")
            .accessibilityHint("Double tap to change")

            Text(title)
        }
        // Read the whole row as one item instead of two.
        .accessibilityElement(children: .combine)
    }
}

struct Header: View {
    var body: some View {
        Text("Today")
            .font(.title)
            .accessibilityAddTraits(.isHeader)   // lets VoiceOver users jump between headings
    }
}`),
    P("Decorative images should be hidden with `.accessibilityHidden(true)`, so VoiceOver does not announce them. Images that carry meaning, such as a chart, need a label that gives the meaning, not the appearance: \"Steps for the last seven days, rising\", not \"bar chart\". `accessibilityElement(children: .combine)` merges the children of a row into one element, which saves the user many swipes."),
    H("Dynamic Type: let the user choose the text size"),
    P("In Settings, people can make text much larger, and some choose the largest accessibility sizes. If your app uses the built-in text styles, such as `.body`, `.headline` and `.title`, the text scales automatically. If you set a fixed point size with `.font(.system(size: 14))`, it does not. Prefer styles. When you need a custom size, use `@ScaledMetric` so spacing and icons grow with the text."),
    C('swift', S`struct Badge: View {
    @ScaledMetric(relativeTo: .body) private var size = 28   // grows with Dynamic Type
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        let layout = typeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading))   // stack vertically at huge sizes
            : AnyLayout(HStackLayout())

        layout {
            Image(systemName: "star.fill")
                .frame(width: size, height: size)
            Text("Favourite")
                .font(.body)
        }
    }
}`),
    P("The example switches from a row to a column at the accessibility sizes, using `AnyLayout`. A row that fits at the normal size can push text off the screen at the largest size. Never truncate important text to a single line with `.lineLimit(1)` unless you are sure it still makes sense."),
    H("Colour, contrast and motion"),
    L(
      "**Do not rely on colour alone.** In the quiz project, the right answer shows a check mark as well as green, because some people cannot tell red from green.",
      "**Contrast**: text needs enough difference from its background. WCAG, the common web guideline, suggests a ratio of at least 4.5 to 1 for normal text. System colours such as `.primary` and `.secondary` adapt to light and dark mode and to the Increase Contrast setting.",
      "**Reduce Motion**: some users feel ill from large animations. Read `@Environment(\\.accessibilityReduceMotion)` and use a simple fade or no animation when it is on.",
      "**Touch targets**: make tappable things at least about 44 by 44 points, which is Apple's design guidance.",
      "**Captions and transcripts**: video and audio need captions or a text alternative.",
    ),
    H("Testing accessibility"),
    O(
      "Run the app in the Simulator, open **Xcode > Open Developer Tool > Accessibility Inspector**, point it at your app and run the audit. It lists missing labels and small targets.",
      "Turn on **VoiceOver** on a real iPhone (Settings > Accessibility) and use the app with your eyes closed for two minutes. Nothing teaches faster.",
      "Preview several text sizes in Xcode with `.environment(\\.dynamicTypeSize, .accessibility3)` on your previews.",
      "Turn on Bold Text, Increase Contrast and Reduce Motion in Settings and check the screens.",
      "Newer Xcode versions can run an accessibility audit in UI tests. Check the current documentation for the exact call.",
    ),
    N(VERIFY),
    ...task("Take one screen of your app and run the Accessibility Inspector audit. Fix every item it reports.", "Switch to the largest accessibility text size. Find one layout that breaks and fix it with `@ScaledMetric` or `AnyLayout`.", "Add an accessibility label to every icon-only button and test with VoiceOver on a real device."),
    ...check("Every icon-only button has a label.", "No screen is broken at the largest text size.", "Colour is never the only way to tell states apart."),
  ], A('Accessibility checks', [
    n('ui', 'Your screen', 'standard controls', 0, 0, 'app'), n('vo', 'VoiceOver', 'labels, values, traits', 1, 0, 'tool'),
    n('dt', 'Dynamic Type', 'text scales', 2, 0, 'check'), n('aud', 'Audit', 'Inspector + real device', 3, 0, 'out'),
  ], [
    { say: 'Standard SwiftUI controls already have much accessibility built in.', on: ['ui'] },
    { say: 'You add labels, values and traits where the default is not enough.', flow: ['ui>vo:describe'] },
    { say: 'Using text styles and ScaledMetric keeps layouts working at large sizes.', flow: ['vo>dt:text size'] },
    { say: 'You verify with the Accessibility Inspector and with VoiceOver on a real phone.', flow: ['dt>aud:test'] },
  ]), [
    faq('Do I need to add accessibility to every view?', 'No. Standard controls work already. Add labels to icon-only controls, group rows, mark headings, and check large text and contrast.'),
    faq('What is the quickest test?', 'Turn on VoiceOver on a real iPhone and try to finish a task with the screen curtain on. You will find the gaps in minutes.'),
    faq('Does accessibility matter for the App Store?', 'Apple encourages it and shows accessibility features in the listing. Some organisations and countries also require it, and it improves the experience for everyone.'),
  ]),

  // ---------------------------------------------------------------- 16
  les(SEC, 'ios-localization-string-catalogs-plurals-formatting-and-right-to-left', 'iOS Localization: String Catalogs, Plurals, Formatting and Right-to-Left', 'iOS Localization: String Catalogs',
    'Translate an iOS app with String Catalogs, plurals, number, date and currency formats, right-to-left layouts and pseudolanguages, and test each language.', [
    P("An app in English reaches only part of the world. India alone has many languages, and a Hindi, Tamil or Marathi version can reach people your competitors ignore. **Localization** means preparing the app so that text, numbers, dates, currencies and layout all adapt to the user's language and region. **Internationalisation**, the step before it, means writing the code so that nothing is fixed to one language."),
    P("The most common mistake is to write text straight into the code and join pieces with `+`. That makes a translator's job impossible, because word order differs between languages. The fix is to keep every user-visible sentence whole, give it a key, and keep the translations in a catalog."),
    H("String Catalogs"),
    P("Since Xcode 15, the recommended file is a **String Catalog**, with the extension `.xcstrings`. You add one to the project, add the languages in the project settings, and Xcode collects the strings it finds in your code. Each string shows its translations and a state such as \"New\", \"Needs review\" or \"Translated\", so you can see what is missing. A SwiftUI `Text(\"Welcome\")` is localised automatically, because the text is treated as a key. For code that is not a view, use `String(localized:)`."),
    C('swift', S`import SwiftUI

struct Welcome: View {
    let name: String
    let unread: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Whole sentence with a placeholder. Never build it with + .
            Text("Welcome back, \(name)")

            // The catalog stores a separate form for "one", "other", and more if the language needs them.
            Text("You have \(unread) unread messages")

            // For strings outside a Text:
            Text(String(localized: "Save", comment: "Button that saves the form"))
        }
    }
}`),
    P("The `comment` argument is a note for the translator. A word such as \"Save\" can be a verb on a button or a noun in a game, and the translator cannot know which unless you say. Good comments are the cheapest quality improvement in localization."),
    H("Plurals"),
    P("English has two plural forms, one and other. Some languages have more: Arabic has six, and Russian and Polish have several. In a String Catalog you right-click a string and choose **Vary by Plural**. Xcode then lets you type one translation for each form the language needs. Never write code such as `count == 1 ? \"item\" : \"items\"`, because it is correct only for English."),
    H("Numbers, dates and currency"),
    P("Do not format these by hand. Use the formatters that follow the user's settings, so a number such as 1,234,567.89 appears as 12,34,567.89 for an Indian user and as 1.234.567,89 for a German user. Dates change order and month names too."),
    C('swift', S`let price = 1499.5
let when = Date.now

// Follows the user's region automatically.
let money = price.formatted(.currency(code: "INR"))
let number = 1234567.89.formatted(.number)
let day = when.formatted(date: .long, time: .omitted)

// To test a specific language and region without changing the phone:
let hindi = Locale(identifier: "hi_IN")
let text = price.formatted(.currency(code: "INR").locale(hindi))`),
    P("The currency code says which currency the amount is in. The locale decides how it is written. Mixing the two up is a common bug: a price in dollars is still dollars when a user in India looks at it, but it is written the way an Indian reader expects."),
    H("Right-to-left languages"),
    P("Arabic, Hebrew and Urdu are written from right to left. SwiftUI flips the layout for you when you use `leading` and `trailing` instead of `left` and `right`. Use `.padding(.leading)` and `HStack`, not fixed left and right values. Images with a direction, such as an arrow that means \"next\", may need `.flipsForRightToLeftLayoutDirection(true)`. Check your screens with the right-to-left pseudolanguage in the scheme options."),
    H("Testing languages"),
    O(
      "In Xcode, edit the scheme, open Run > Options and set **App Language** to another language, or to a pseudolanguage such as Double-Length Pseudolanguage and Right-to-Left Pseudolanguage.",
      "Double-length text shows where translated text overflows. It is the quickest way to find truncation.",
      "Preview several languages with `.environment(\\.locale, Locale(identifier: \"ar\"))` in your previews.",
      "Ask a native speaker to review the translations in context. Machine translation is a starting point, not the finish.",
      "Localize your App Store listing too: the name, subtitle, description and screenshots can all differ by language.",
    ),
    N(VERIFY),
    ...task("Create a String Catalog, add Hindi, and translate five screens of strings.", "Replace one hand-made plural with a catalog plural.", "Run the app with the double-length and right-to-left pseudolanguages and fix what breaks."),
    ...check("No user-visible sentence is built by joining pieces.", "Dates, numbers and currencies use formatters.", "Layouts use leading and trailing, and survive double-length text."),
  ], A('Keys, catalog, formats', [
    n('key', 'Whole sentence key', 'with placeholders', 0, 0, 'app'), n('cat', 'String Catalog', 'one entry per language', 1, 0, 'store'),
    n('fmt', 'Formatters', 'numbers, dates, currency', 2, 0, 'tool'), n('lang', 'User language', 'layout follows', 3, 0, 'out'),
  ], [
    { say: 'The app uses whole sentences as keys, with placeholders for values.', on: ['key'] },
    { say: 'The String Catalog holds a translation per language, including plural forms.', flow: ['key>cat:collect'] },
    { say: 'System formatters write numbers, dates and money the way the user expects.', flow: ['cat>fmt:values'] },
    { say: 'The text, formats and layout direction all follow the user\'s language and region.', flow: ['fmt>lang:adapt'] },
  ]), [
    faq('What is the difference between localization and internationalisation?', 'Internationalisation prepares the code so nothing is tied to one language. Localization adds the actual translations and regional formats.'),
    faq('Why not join strings with +?', 'Word order differs between languages, so a translator needs the whole sentence with placeholders to translate it correctly.'),
    faq('Should I use machine translation?', 'It is a useful first draft, but have a native speaker review it, especially for buttons, legal text and anything sensitive.'),
  ]),

  // ---------------------------------------------------------------- 17
  les(SEC, 'ios-widgets-and-app-intents-widgetkit-timelines-siri-and-shortcuts', 'iOS Widgets and App Intents: WidgetKit, Timelines, Siri and Shortcuts', 'iOS Widgets and App Intents with WidgetKit',
    'Add a Home Screen widget with WidgetKit timelines and an App Group, and expose actions to Siri, Shortcuts and interactive widgets with App Intents.', [
    P("A widget puts a small piece of your app on the Home Screen, the Lock Screen or the Today view. A habit app can show today's streak, a weather app the temperature, a shop app the order status. Widgets bring users back to the app, and they are a common feature in apps that feel well made."),
    P("A widget is **not a small running app**. It is a snapshot. The system asks your widget for a *timeline*, a list of entries with dates, and shows each entry at its time. Your widget cannot run code continuously, so you plan ahead: you hand the system everything it needs to draw the next hours."),
    H("The parts of a widget"),
    L(
      "**A widget extension**: a separate target you add with File > New > Target > Widget Extension.",
      "**A TimelineEntry**: a struct with a `date` and the data to show.",
      "**A TimelineProvider**: answers three questions. `placeholder` is a generic look while loading, `getSnapshot` is the preview in the widget gallery, and `getTimeline` returns the entries and when to ask again.",
      "**A view**: SwiftUI, with the same views and modifiers you already know.",
      "**An App Group**: a shared container so the app and widget can read the same data.",
    ),
    C('swift', S`import WidgetKit
import SwiftUI

struct StreakEntry: TimelineEntry {
    let date: Date
    let streak: Int
}

struct StreakProvider: TimelineProvider {
    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(date: .now, streak: 7)
    }

    func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
        completion(StreakEntry(date: .now, streak: current()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
        let entry = StreakEntry(date: .now, streak: current())
        // Ask the system to refresh after midnight, when the streak can change.
        let tomorrow = Calendar.current.startOfDay(for: .now).addingTimeInterval(86_400 + 60)
        completion(Timeline(entries: [entry], policy: .after(tomorrow)))
    }

    // Reads the value the app saved in the shared App Group container.
    private func current() -> Int {
        UserDefaults(suiteName: "group.com.example.habits")?.integer(forKey: "streak") ?? 0
    }
}

struct StreakWidgetView: View {
    let entry: StreakEntry

    var body: some View {
        VStack {
            Text("\(entry.streak)").font(.largeTitle.bold())
            Text("day streak").font(.caption)
        }
        .containerBackground(.fill.tertiary, for: .widget)
    }
}

struct StreakWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "StreakWidget", provider: StreakProvider()) { entry in
            StreakWidgetView(entry: entry)
        }
        .configurationDisplayName("Streak")
        .description("Shows your current habit streak.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}`),
    P("The group name `group.com.example.habits` is an example. You create the real one in Signing & Capabilities by adding the App Groups capability to **both** the app and the widget extension. When the app changes the data, it saves it into the shared container and calls `WidgetCenter.shared.reloadAllTimelines()` so the widget refreshes sooner than its normal schedule."),
    C('swift', S`import WidgetKit

func saveStreak(_ value: Int) {
    UserDefaults(suiteName: "group.com.example.habits")?.set(value, forKey: "streak")
    WidgetCenter.shared.reloadAllTimelines()
}`),
    H("Refresh limits"),
    P("The system gives each widget a limited budget of refreshes per day, so you cannot update every second. Use a timeline with several entries when you know the future, such as a countdown or a schedule, and use `reloadTimelines` only when the data really changed. A widget that tries to show live data constantly will simply show stale data, and users will think it is broken."),
    H("App Intents: actions for Siri, Shortcuts and widgets"),
    P("An **App Intent** describes something your app can do, in a form the system understands. Once you define one, it can appear in the Shortcuts app, be spoken to Siri, appear in Spotlight and, since iOS 17, run from a button in a widget without opening the app. The code is a struct with a title, optional parameters and a `perform` function."),
    C('swift', S`import AppIntents

struct MarkHabitDoneIntent: AppIntent {
    static var title: LocalizedStringResource = "Mark habit done"
    static var description = IntentDescription("Marks a habit as done for today.")

    @Parameter(title: "Habit name")
    var habitName: String

    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Call the same code your app uses. Keep the logic in one place.
        let found = HabitStorage.shared.markDone(named: habitName)
        return .result(dialog: found ? "Done. Keep going!" : "I could not find that habit.")
    }
}

struct HabitShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: MarkHabitDoneIntent(),
            phrases: ["Mark a habit done in \(.applicationName)"],
            shortTitle: "Mark done",
            systemImageName: "checkmark.circle"
        )
    }
}`),
    P("`HabitStorage` is the same storage object your app uses. This is the key design rule: put the real work in a shared function or package, and let the screen, the widget and the intent all call it. If each has its own copy of the logic, they will drift apart."),
    P("Design widgets for a glance. People look at a widget for about a second, so show one number, one status or one next action, not a miniature of the whole app. Support the sizes that make sense, test in light and dark mode, and give the widget a tap target that opens the right screen in the app with `widgetURL`. A widget that opens the app on the home screen instead of the relevant detail feels careless."),
    P("Widgets must also respect privacy. They can appear on the Lock Screen, where other people can see them. Do not show private details such as a message text or a balance there unless the user chooses to. The `redacted` and `privacySensitive` modifiers let you hide content when the device is locked."),
    N(VERIFY),
    ...task("Add a widget extension to the Habit tracker project and show the best streak.", "Create an App Group, share the streak value and reload the widget when a habit is ticked.", "Add an App Intent and run it from the Shortcuts app."),
    ...check("The widget shows real data from the app.", "The widget refreshes after a change in the app.", "The intent and the screen use the same function."),
  ], A('App, widget and intent share data', [
    n('app', 'Your app', 'saves the value', 0, 0, 'app'), n('grp', 'App Group', 'shared storage', 1, 0, 'store'),
    n('wid', 'Widget timeline', 'entries with dates', 2, 0, 'tool'), n('sys', 'Home Screen / Siri', 'shows or runs it', 3, 0, 'out'),
  ], [
    { say: 'The app saves a value and asks widgets to reload.', on: ['app'] },
    { say: 'The value lives in an App Group container that both targets can read.', flow: ['app>grp:save'] },
    { say: 'The widget provider reads it and returns a timeline of entries.', flow: ['grp>wid:read'] },
    { say: 'The system draws the entries on the Home Screen, and App Intents run from Siri and Shortcuts.', flow: ['wid>sys:timeline'] },
  ]), [
    faq('Can a widget run code all the time?', 'No. It shows entries from a timeline that you provide, and refreshes are limited by the system. Plan the timeline ahead.'),
    faq('Why do I need an App Group?', 'The app and the widget are separate processes and cannot see each other\'s files. An App Group gives them a shared container.'),
    faq('What are App Intents used for?', 'They describe actions that Siri, Shortcuts, Spotlight and interactive widgets can run. They make your app useful outside its own screens.'),
  ]),

  // ---------------------------------------------------------------- 18
  les(SEC, 'app-store-privacy-and-review-privacy-manifests-guidelines-and-common-rejections', 'App Store Privacy and Review: Privacy Manifests, Guidelines and Common Rejections', 'App Store Privacy and Review Guidelines',
    'Prepare an iOS app for App Store review: privacy manifests, privacy labels, permission texts, account deletion, purchase rules and common rejections.', [
    P("Apps are reviewed by people and by automated checks before they appear in the App Store. A rejection usually costs one to a few days, and some rejections come from the same small mistakes again and again. This lesson lists what reviewers look for, so you can fix it before you submit. It also covers **privacy**, which Apple treats as a core promise to its users and checks more closely every year."),
    N("Apple changes its App Store Review Guidelines, privacy requirements and deadlines regularly. This lesson is a checklist built from our reading of the guidelines and was not tested against a real submission. Before you submit, read the current App Store Review Guidelines and the current App Store Connect help pages."),
    H("Privacy information you must provide"),
    L(
      "**App Privacy details (privacy labels)**: in App Store Connect you list what data the app and its libraries collect, whether it is linked to the user, and whether it is used for tracking. These appear on your listing. They must be accurate, including data collected by third-party SDKs such as analytics and ads.",
      "**Privacy policy URL**: a public page that says what you collect and why, how users can ask for deletion, and how to contact you. Apps need one, and apps that handle account or health data must be especially clear.",
      "**Privacy manifest (PrivacyInfo.xcprivacy)**: a file in your app, and in the SDKs you include, that declares the data types collected and the reasons for using certain system APIs. Apple has required manifests for specific commonly used SDKs and for apps that use specific APIs. Check which of your dependencies provide one.",
      "**Required reason APIs**: some system APIs, such as file timestamps, system boot time, disk space and UserDefaults, can be used to fingerprint a device. When your app or a library uses them, you must declare an approved reason in the manifest.",
      "**App Tracking Transparency**: if you track users across other companies' apps and sites, you must ask with the ATT prompt and explain why. If you do not track, do not show the prompt, and do not claim tracking in the label.",
    ),
    H("Permission texts"),
    P("Every sensitive permission needs a **usage description** in Info.plist, such as `NSCameraUsageDescription` or `NSHealthShareUsageDescription`. The text must say in plain words why your app needs it. \"We need the camera\" is weak. \"The camera scans QR codes. Pictures are not saved or sent anywhere\" is strong. Missing or vague texts cause rejections, and a missing key crashes the app when it asks. Ask for a permission only at the moment the feature needs it, after explaining it on your own screen."),
    H("Rules that surprise first-time submitters"),
    L(
      "**Account deletion**: if users can create an account inside the app, they must also be able to start deleting that account inside the app. A link to a website form alone is not enough under the guidelines at the time of writing.",
      "**Sign in with Apple**: apps that offer other third-party social logins have been required to offer an equivalent privacy-focused option such as Sign in with Apple. The exact rule has changed over time, so read the current guideline.",
      "**In-app purchase**: digital goods and features inside the app, such as premium content or subscriptions, generally must use Apple's In-App Purchase. Physical goods and services consumed outside the app, such as a taxi ride, do not. There are specific exceptions and regional rules, so read section 3.1 of the guidelines.",
      "**Demo account**: if the app needs a login, give the reviewer a working demo account in App Store Connect, with sample data. A reviewer who cannot get in will reject the app.",
      "**Completeness**: no placeholder text, empty screens, broken links or \"coming soon\" features. The reviewer opens every tab.",
      "**Accurate metadata**: screenshots must show the real app. Do not mention other platforms or use another company's trademarks in the name.",
      "**Minimum functionality**: an app that only wraps a website, or is a thin copy of another app, is at risk of rejection under the design guidelines.",
      "**User-generated content**: if users can post, you need filtering, a way to report content, a way to block abusive users and a way to contact you.",
      "**AI features**: be clear when content is generated by AI, and follow the rules for user-generated content and for sending personal data to third parties.",
    ),
    H("A pre-submission checklist"),
    O(
      "Build the release configuration and test it on a real device, not only the Simulator. Some bugs appear only in release builds.",
      "Check that every usage description exists and is specific.",
      "Check the privacy manifest and that App Privacy answers match what the app and every SDK really do.",
      "Test with no network, a slow network and a fresh install. The reviewer often starts from a clean device.",
      "Open every screen and button. Remove or hide unfinished features.",
      "Check Dynamic Type, Dark Mode and the smallest supported iPhone.",
      "Fill in the review notes: how to log in, how to reach hidden features, and any hardware needed.",
      "Use TestFlight for a final round with real testers before you submit.",
    ),
    H("If you are rejected"),
    P("A rejection is a conversation. Read the message carefully: it quotes a guideline number. Fix exactly that issue, reply in Resolution Center if you need to explain something, and resubmit. If you believe the reviewer made a mistake, you can reply politely with evidence or request an appeal. Do not resubmit the same build without changes, and do not argue emotionally. Most rejections are resolved in one or two rounds."),
    ...task("Write a one-page privacy summary for an app you built: what it collects, why, where it is stored, and how a user deletes it.", "List every third-party SDK and check whether it needs a privacy manifest.", "Rewrite every usage description in your app so a stranger understands why it is needed."),
    ...check("Your privacy labels match the app's real behaviour.", "Every permission has a clear usage text.", "A reviewer could sign in with your demo account and reach every feature."),
  ], A('From build to approval', [
    n('build', 'Release build', 'tested on a device', 0, 0, 'app'), n('priv', 'Privacy items', 'labels, manifest, texts', 1, 0, 'check'),
    n('rev', 'App Review', 'people and checks', 2, 0, 'tool'), n('live', 'On the Store', 'or fix and resubmit', 3, 0, 'out'),
  ], [
    { say: 'You build the release version and test it on a real device.', on: ['build'] },
    { say: 'You prepare privacy labels, the manifest, permission texts and a demo account.', flow: ['build>priv:prepare'] },
    { say: 'Reviewers open every screen and check the guidelines.', flow: ['priv>rev:submit'] },
    { say: 'If approved the app goes live. If rejected, fix the quoted guideline and resubmit.', flow: ['rev>live:result'] },
  ]), [
    faq('How long does App Review take?', 'It is often a day or two, but it varies. Plan extra time for a first submission, and do not schedule a launch for the same day.'),
    faq('Do I need a privacy policy if I collect nothing?', 'A policy URL is still required for the listing. Say plainly what you do and do not collect.'),
    faq('What is the most common reason for rejection?', 'Crashes and bugs, incomplete features, missing demo accounts and unclear permission or privacy information are among the most frequent. Testing the release build on a device prevents many of them.'),
  ]),

  // ---------------------------------------------------------------- 19
  les(SEC, 'core-data-in-depth-for-ios-stacks-contexts-fetch-requests-and-migration', 'Core Data in Depth for iOS: Stacks, Contexts, Fetch Requests and Migration', 'Core Data in Depth: Contexts and Migration',
    'Learn Core Data for older and larger iOS projects: the container, contexts, fetch requests, background saves, migration and when SwiftData is better.', [
    P("SwiftData is the modern way to store data in an iOS app, but Core Data is still everywhere. It has been part of iOS for many years, and a large share of the apps you will work on in a job were built with it. You will read Core Data code in existing projects, and interviewers still ask about it. This lesson teaches the ideas you need to read it, fix it and decide when to migrate to SwiftData."),
    N("Core Data details change between iOS versions. The code below is from our reading of the documentation and was not compiled or tested here. Compare it with the current Apple documentation, and test migrations on copies of real data before shipping."),
    H("The four main objects"),
    L(
      "**NSManagedObjectModel**: describes your entities, their attributes and relationships. You usually design it visually in an `.xcdatamodeld` file in Xcode.",
      "**NSPersistentStoreCoordinator**: connects the model to the actual store on disk, usually a SQLite database.",
      "**NSManagedObjectContext**: a scratchpad. You fetch objects into a context, change them, and then save the context to write the changes. Contexts are **not thread-safe**.",
      "**NSPersistentContainer**: bundles the three above into one object, so you rarely build them by hand.",
    ),
    C('swift', S`import CoreData

final class PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "Model")   // matches Model.xcdatamodeld
        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }
        container.loadPersistentStores { _, error in
            if let error { fatalError("Could not load the store: \(error)") }
        }
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
}`),
    P("`viewContext` is the context tied to the main thread, which your UI reads. The `inMemory` option is the Core Data version of the in-memory store trick from the To-Do project: tests use a store that disappears afterwards. In a real app, handle a load failure with a clear message instead of `fatalError`."),
    H("Create, fetch, update and delete"),
    C('swift', S`// Assume an entity named TodoTask with attributes title (String) and isDone (Bool).
func addTask(title: String, in context: NSManagedObjectContext) throws {
    let task = TodoTask(context: context)
    task.title = title
    task.isDone = false
    try context.save()
}

func openTasks(in context: NSManagedObjectContext) throws -> [TodoTask] {
    let request = TodoTask.fetchRequest()
    request.predicate = NSPredicate(format: "isDone == NO")
    request.sortDescriptors = [NSSortDescriptor(key: "title", ascending: true)]
    request.fetchBatchSize = 50
    return try context.fetch(request)
}

func delete(_ task: TodoTask, in context: NSManagedObjectContext) throws {
    context.delete(task)
    try context.save()
}`),
    P("A **predicate** filters, and a **sort descriptor** orders. The `fetchBatchSize` tells Core Data to load objects in batches as you read them, which saves memory on large lists. In SwiftUI, the `@FetchRequest` property wrapper does the same job as SwiftData's `@Query`: it fetches and keeps the list updated."),
    H("Background work"),
    P("Never do heavy work on the main context, because it freezes the screen. Use a **background context**. `container.performBackgroundTask` gives you a fresh context on its own queue. Objects from one context must never be used in another. Pass `NSManagedObjectID` values between contexts and fetch the object again in the other one."),
    C('swift', S`func importTasks(_ titles: [String], container: NSPersistentContainer) async throws {
    try await container.performBackgroundTask { context in
        for title in titles {
            let task = TodoTask(context: context)
            task.title = title
            task.isDone = false
        }
        try context.save()   // viewContext picks this up through automaticallyMergesChangesFromParent
    }
}`),
    P("In a modern codebase, a `@MainActor` repository class that owns `viewContext`, and a background context for imports, keeps the threading rules in one place. The Core Data multithreading debugging flag, `-com.apple.CoreData.ConcurrencyDebug 1`, in the scheme arguments, makes the app crash early when you touch a context from the wrong queue. That is much better than a rare, random crash in production."),
    H("Migration"),
    P("When you change the model, old data must be converted. **Lightweight migration** handles simple changes automatically: adding an attribute with a default or optional value, renaming with a renaming identifier, or adding an entity. It is on by default for the persistent container when you create a new model version. More complex changes need a **mapping model** or custom code. The safe process is always the same: add a new model version, never edit an old one that shipped, test the upgrade from every older version you released, and keep a copy of real-looking data for those tests."),
    H("Core Data or SwiftData?"),
    L(
      "**New project, iOS 17 and later**: SwiftData is usually simpler and works naturally with SwiftUI.",
      "**Existing Core Data app**: do not rewrite it only because SwiftData exists. Migrate when there is a clear benefit, in small steps, and test migration carefully.",
      "**Older iOS versions or needs SwiftData does not yet cover**: Core Data is mature and fully documented. Check the current SwiftData documentation for gaps such as shared databases, complex migrations and CloudKit sharing.",
    ),
    ...task("Create a Core Data project with an entity, fetch it with `@FetchRequest` and add a delete action.", "Write a test that uses an in-memory container and checks a fetch with a predicate.", "Add the concurrency debug flag to your scheme and trigger the crash on purpose by using `viewContext` from a background task."),
    ...check("Contexts are only used on their own queue.", "A background import does not freeze the UI.", "Every shipped model version stays in the project for migration."),
  ], A('Core Data stack', [
    n('mom', 'Model', 'entities in .xcdatamodeld', 0, 0, 'data'), n('con', 'Container', 'loads the stack', 1, 0, 'tool'),
    n('ctx', 'Contexts', 'view + background', 2, 0, 'check'), n('db', 'SQLite store', 'saved on disk', 3, 0, 'store'),
  ], [
    { say: 'The model describes entities, attributes and relationships.', on: ['mom'] },
    { say: 'NSPersistentContainer builds the coordinator and loads the store.', flow: ['mom>con:load'] },
    { say: 'You work in contexts: the view context for the UI, background contexts for heavy work.', flow: ['con>ctx:contexts'] },
    { say: 'Saving a context writes the changes to the SQLite store.', flow: ['ctx>db:save'] },
  ]), [
    faq('Is Core Data a database?', 'It is an object graph and persistence framework. It usually stores data in SQLite, but you work with objects, not SQL.'),
    faq('Why must I not share objects between contexts?', 'Contexts are not thread-safe. Pass the object ID and fetch it again in the other context.'),
    faq('Should I migrate to SwiftData now?', 'Only when there is a clear benefit. For a working app, a careful gradual move is safer than a full rewrite.'),
  ]),
];
