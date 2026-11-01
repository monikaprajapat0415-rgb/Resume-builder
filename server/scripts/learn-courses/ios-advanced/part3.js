import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S = String.raw;
const S3 = 'Networking and Security';
const S4 = 'Data and Apple Frameworks';

export const lessons = [
  // ---------------------------------------------------------------- 9
  les(S4, 'swiftdata-relationships-migrations-background-work-and-cloudkit', 'SwiftData in Depth: Relationships, Migrations, Background Work and iCloud', 'SwiftData: Relationships and Migrations',
    'Model related data with SwiftData relationships, fetch with FetchDescriptor, plan schema migrations, import on a background actor, and learn iCloud sync rules.', [
    P("In the beginner course SwiftData saved one kind of object. A real app has related data: an account has many entries, a category has many expenses, a recipe has ingredients. And real apps live for years, so the shape of the data changes after people already have data on their phones. This lesson covers the three problems that come with that: **relationships**, **migrations** and **work off the main thread**, plus the rules for syncing with iCloud. Because Apple changes these APIs between releases, read the current documentation for your Xcode version, and treat the code here as the shape of the solution."),
    H("Relationships"),
    P("A relationship is a property that points to another model, or to a list of them. Mark the owning side with `@Relationship`, say what happens to the children when the parent is deleted, and name the property on the other side with `inverse`, so both sides stay in step."),
    C('swift', S`import SwiftData
import Foundation

@Model
final class Account {
    var name: String
    @Relationship(deleteRule: .cascade, inverse: \Entry.account)
    var entries: [Entry] = []

    init(name: String) { self.name = name }
}

@Model
final class Entry {
    var title: String
    var amount: Double
    var date: Date
    var account: Account?

    init(title: String, amount: Double, date: Date = .now, account: Account? = nil) {
        self.title = title
        self.amount = amount
        self.date = date
        self.account = account
    }
}`),
    L("`deleteRule: .cascade` deletes the entries when the account is deleted. `.nullify` (the default) keeps the entries and clears their link. `.deny` refuses to delete an account that still has entries. Pick the one that matches what the user expects.", "Set the link on **one** side and SwiftData updates the other: `entry.account = cash` makes `cash.entries` include the entry.", "The `Account?` is optional because an entry may exist before it has an account, and because iCloud sync needs optional relationships.", "`@Attribute(.unique)` makes a property unique across the store, such as an email address. Note that unique constraints cannot be used with iCloud sync."),
    H("Fetching with FetchDescriptor"),
    P("`@Query` is for views. In other code, such as a view model, an import job or a test, you fetch with a `FetchDescriptor` and the model context. It lets you set the filter, the order and a limit."),
    C('swift', S`@MainActor
func largeEntries(in context: ModelContext) throws -> [Entry] {
    var descriptor = FetchDescriptor<Entry>(
        predicate: #Predicate { $0.amount >= 100 },
        sortBy: [SortDescriptor(\Entry.date, order: .reverse)]
    )
    descriptor.fetchLimit = 20
    return try context.fetch(descriptor)
}

let count = try context.fetchCount(FetchDescriptor<Entry>())`),
    P("A `fetchLimit` matters for large tables. Loading ten thousand rows to show twenty wastes time and memory. Add an index or a limit before you reach for caching."),
    H("Migrations: changing the model after release"),
    P("When you add a property with a default value, SwiftData can usually migrate the store by itself. Bigger changes, such as renaming a property, splitting one model into two or changing a type, need a **versioned schema** and a **migration plan**. You freeze each shipped version of the model in its own type, and describe how to move from one to the next."),
    C('swift', S`enum SchemaV1: VersionedSchema {
    static var versionIdentifier = Schema.Version(1, 0, 0)
    static var models: [any PersistentModel.Type] { [Entry.self] }

    @Model final class Entry {
        var title: String
        var amount: Double
        init(title: String, amount: Double) { self.title = title; self.amount = amount }
    }
}

enum SchemaV2: VersionedSchema {
    static var versionIdentifier = Schema.Version(2, 0, 0)
    static var models: [any PersistentModel.Type] { [Entry.self] }

    @Model final class Entry {
        var title: String
        var amount: Double
        var note: String = ""        // new in version 2
        init(title: String, amount: Double) { self.title = title; self.amount = amount }
    }
}

enum EntryMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] { [SchemaV1.self, SchemaV2.self] }
    static var stages: [MigrationStage] {
        [MigrationStage.lightweight(fromVersion: SchemaV1.self, toVersion: SchemaV2.self)]
    }
}

// when you create the container
let container = try ModelContainer(for: SchemaV2.Entry.self, migrationPlan: EntryMigrationPlan.self)`),
    L("A **lightweight** stage handles simple changes, such as adding a property with a default. A **custom** stage lets you run your own code before and after, for harder changes.", "**Test migrations with real data.** Install the old version of your app, add data, then install the new version over it. A migration that fails can stop the app from opening, which is among the worst bugs a release can have.", "**Never edit a shipped schema version.** Add a new one."),
    H("Work off the main thread: ModelActor"),
    P("A big import, such as ten thousand rows from a server, must not freeze the screen. SwiftData provides `@ModelActor`, a macro that makes an actor with its own model context. Work done inside it stays off the main actor."),
    C('swift', S`import SwiftData

@ModelActor
actor EntryImporter {
    func importEntries(_ rows: [(title: String, amount: Double)]) throws {
        for row in rows {
            modelContext.insert(Entry(title: row.title, amount: row.amount))
        }
        try modelContext.save()
    }
}

// from a task:
let importer = EntryImporter(modelContainer: container)
try await importer.importEntries(rows)`),
    P("Objects belong to the context that made them. Do not pass a model object between actors. Pass its `persistentModelID` or the plain values, and fetch it again where you need it. SwiftUI's `@Query` will pick up the saved changes by itself."),
    H("Syncing with iCloud"),
    P("SwiftData can sync a private database through **CloudKit**, Apple's iCloud service, and the people using the app pay nothing for the storage. You add the **iCloud** capability with CloudKit and the **Background Modes** capability with *Remote notifications*, and create the container with a CloudKit configuration. Apple's documentation lists the rules your models must follow. The main ones are that every property needs a default value or must be optional, relationships must be optional, and unique constraints are not allowed. It is easier to design for these from the start than to change a shipped model later."),
    N("Sync brings new problems: two devices editing the same item, a user who is signed out of iCloud, and a first launch with no network. Test with two devices or two simulators signed in to the same account, and show the user honest messages when sync is off."),
    H("Where Core Data and other options fit"),
    L("**Core Data** is the older framework under SwiftData. Apps that started before iOS 17 use it, and it supports iOS versions that SwiftData does not. Its ideas are the same: a container, contexts, fetch requests, migrations.", "**SQLite** libraries such as GRDB suit teams that want full control of SQL. They are a good choice when you need very complex queries.", "**A backend** such as Firebase or your own server holds data that must be shared between *people*, not only between one person's devices. The app often keeps a local copy as well, so it works offline."),
    H("Common mistakes"),
    L("Loading all rows when the screen shows twenty.", "Changing a shipped model with no migration.", "Passing model objects between actors.", "Forgetting what the delete rule does, and removing more data than the user expected."),
    ...task("Add `Account` and `Entry` with a relationship. Delete an account and check what happens to its entries with `.cascade` and then `.nullify`.", "Write a `fetchLimit` query for the 20 newest entries over a given amount.", "Create `SchemaV1` and `SchemaV2` as above and write down the exact steps you would use to test the migration with real data.", "Write the `@ModelActor` importer and import 5,000 rows while a list is on screen. The screen should stay responsive."),
    ...check("The delete rule behaves as you expect in both modes.", "The list stays responsive during the import.", "You can say three rules a model must follow to sync with iCloud."),
  ], A('Changing the model safely', [
    n('v1', 'Schema V1', 'shipped version', 0, 0, 'store'), n('plan', 'Migration plan', 'lightweight stage', 1, 0, 'tool'),
    n('v2', 'Schema V2', 'adds a property', 2, 0, 'data'), n('app', 'Updated app', 'old data kept', 3, 0, 'out'),
  ], [
    { say: 'Real users already have data stored in version 1 of your model.', on: ['v1'] },
    { say: 'A migration plan says how to move from one version to the next.', flow: ['v1>plan:from'] },
    { say: 'Version 2 is a new, separate schema. You never edit a shipped version.', flow: ['plan>v2:to'] },
    { say: 'The updated app opens with the old data intact. Always test this with real data first.', flow: ['v2>app:migrated'] },
  ]), [
    faq('When do I need a SwiftData migration plan?', 'When you change a shipped model in a way SwiftData cannot handle automatically, such as renaming a property or splitting a model. Adding a property with a default value is often handled for you. Test with real data before every release.'),
    faq('What does a relationship delete rule do?', 'It says what happens to related objects when the parent is deleted. Cascade deletes them, nullify keeps them and clears the link, and deny refuses to delete the parent while children exist.'),
    faq('How do I import a lot of data without freezing the app?', 'Use a ModelActor, which has its own model context and runs off the main actor. Pass plain values in and do not move model objects between actors.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S4, 'core-location-mapkit-notifications-and-background-tasks', 'Core Location, MapKit and Push Notifications in iOS', 'Core Location, MapKit and Notifications',
    'Ask for location permission properly, show places on a SwiftUI map, search nearby, schedule local notifications and learn how push and background tasks work.', [
    P("Apps feel native when they use the phone: where you are, what is nearby, and a reminder at the right moment. These features share two things. They touch **private data or attention**, so Apple requires a permission and an honest reason. And they depend on the system, which decides when your code runs. This lesson covers location, maps and notifications, with the permission rules first."),
    H("Permissions: the rules for all private features"),
    L("Every private feature needs a **usage description** in the app's Info settings, a short sentence that says *why*, such as *Used to show expenses near you*. Without it, the app is stopped at the moment you ask. Reviewers also read these sentences.", "Ask **at the moment the feature is needed**, not at launch. A person who sees *Allow location?* right after opening the app, with no context, often says no.", "Always handle **no**. A good app still works, with a clear way to change the setting later.", "Ask for the **least** you need. *While Using the App* is enough for most apps."),
    H("Core Location"),
    C('swift', S`import CoreLocation
import Observation

@Observable
final class LocationModel: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    var status: CLAuthorizationStatus
    var location: CLLocation?

    override init() {
        status = manager.authorizationStatus
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    func requestAccess() {
        manager.requestWhenInUseAuthorization()
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        status = manager.authorizationStatus
        if status == .authorizedWhenInUse || status == .authorizedAlways {
            manager.requestLocation()      // one fix, uses less battery
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.last
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location failed:", error)
    }
}`),
    P("Add the key `NSLocationWhenInUseUsageDescription` to your target's Info settings. The delegate methods tell you when the person answers and when a position arrives. Choose the lowest accuracy that does the job, and ask for **one** position with `requestLocation()` when you only need one, because GPS drains the battery. Newer iOS versions also offer an async way to read location updates (`CLLocationUpdate.liveUpdates()`), which is worth learning once you know this delegate version."),
    N("Delegate callbacks and Swift's strict concurrency checks can disagree in newer language modes. If Xcode reports main-actor warnings on this class, mark the class `@MainActor` and the delegate methods `nonisolated`, and hop back to the main actor to set properties. Follow the message the compiler gives for your Xcode version."),
    H("MapKit in SwiftUI"),
    P("From iOS 17, SwiftUI has a `Map` view you fill with *markers* and *annotations*, written like any other SwiftUI content."),
    C('swift', S`import MapKit
import SwiftUI

struct PlacesMap: View {
    private let cafe = CLLocationCoordinate2D(latitude: 51.5074, longitude: -0.1278)

    var body: some View {
        Map(initialPosition: .region(
            MKCoordinateRegion(center: cafe,
                               span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)))
        ) {
            Marker("Coffee shop", systemImage: "cup.and.saucer.fill", coordinate: cafe)
            UserAnnotation()
        }
        .mapStyle(.standard)
        .mapControls { MapUserLocationButton(); MapCompass() }
    }
}`),
    P("`UserAnnotation` shows the blue dot once you have permission. To find places, use `MKLocalSearch`, which searches Apple's map data."),
    C('swift', S`func searchNearby(_ text: String, around center: CLLocationCoordinate2D) async throws -> [MKMapItem] {
    let request = MKLocalSearch.Request()
    request.naturalLanguageQuery = text
    request.region = MKCoordinateRegion(center: center,
                                        latitudinalMeters: 2000, longitudinalMeters: 2000)
    let response = try await MKLocalSearch(request: request).start()
    return response.mapItems
}`),
    H("Local notifications"),
    P("A **local notification** is scheduled by your app on the device, with no server. It suits reminders, such as *log today's expenses at 8 pm*. First ask for permission, then schedule a request with a trigger."),
    C('swift', S`import UserNotifications

func scheduleDailyReminder() async throws {
    let center = UNUserNotificationCenter.current()
    let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
    guard granted else { return }

    let content = UNMutableNotificationContent()
    content.title = "Log your expenses"
    content.body = "Add today's spending while you remember it."
    content.sound = .default

    let trigger = UNCalendarNotificationTrigger(
        dateMatching: DateComponents(hour: 20, minute: 0), repeats: true)
    let request = UNNotificationRequest(identifier: "daily-reminder", content: content, trigger: trigger)
    try await center.add(request)
}`),
    L("Using the same `identifier` again replaces the old request, so a person does not get two reminders.", "By default, a notification does **not** show while your app is open. If you want it to, set a `UNUserNotificationCenterDelegate` and return the options you want from `willPresent`.", "Give people a way to turn reminders off inside the app, in addition to the system settings."),
    H("Push notifications"),
    P("A **push notification** is sent from your server, through Apple's service, **APNs**. The path is: your app asks the system to register, the system gives the app a **device token**, the app sends that token to your server, and the server asks APNs to deliver a message to that token. For the server to talk to APNs you create an **authentication key** (a `.p8` file) in your Apple developer account. You add the **Push Notifications** capability to the app."),
    C('swift', S`import UIKit
import SwiftUI

final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02x", $0) }.joined()
        print("Send this token to your server:", token)
    }

    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Push registration failed:", error)
    }
}

@main
struct ExpenseTrackerApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    var body: some Scene { WindowGroup { ContentView() } }
}

// after the person has allowed notifications:
UIApplication.shared.registerForRemoteNotifications()`),
    N("Device tokens can change, so send the token to your server each time the app launches and the person is signed in. Never put the APNs key in the app. It belongs only on your server. Push does not work in some Simulator set-ups and is best tested on a real device. Check Apple's current notes."),
    H("Background work"),
    P("iOS stops an app soon after the person leaves it, to save battery. For work that must happen anyway, such as refreshing data, you do not run code yourself. You **ask the system**, and it decides when. `BGTaskScheduler` lets you register a refresh task, and the system runs it at a time it picks, which may be late, or not at all if the battery is low. A push with `content-available` can also wake the app briefly. Always design the app so that it **works correctly when no background work ran**, and treat background work as a bonus."),
    H("Common mistakes"),
    L("Asking for permission on first launch with no context.", "No handling for *denied*. The feature silently does nothing.", "Keeping GPS on all the time.", "Putting server secrets in the app, or expecting background tasks to run at an exact time."),
    ...task("Add the location usage description, ask for permission from a button, and show the coordinates.", "Show a `Map` with one marker and the user's location, and search for *coffee* nearby.", "Schedule the daily reminder from a toggle in a settings screen, and cancel it when the toggle is off.", "Write down the steps of a push notification from your app to a phone, in order, in your own words."),
    ...check("Denying permission shows a helpful message and the app keeps working.", "The reminder arrives at the chosen time, and only one is scheduled.", "You can explain why the APNs key must stay on the server."),
  ], A('The path of a push', [
    n('app', 'Your app', 'registers, gets token', 0, 0, 'app'), n('srv', 'Your server', 'stores the token', 1, 0, 'tool'),
    n('apns', 'Apple APNs', 'delivers the message', 2, 0, 'model'), n('ph', 'The phone', 'shows it', 3, 0, 'out'),
  ], [
    { say: 'After the person allows notifications, the app registers and the system gives it a device token.', on: ['app'] },
    { say: 'The app sends the token to your server, which stores it with the user.', flow: ['app>srv:token'] },
    { say: 'When something happens, your server asks APNs to deliver a message to that token. The key stays on the server.', flow: ['srv>apns:send'] },
    { say: 'APNs delivers it, and the phone shows the notification.', flow: ['apns>ph:push'] },
  ]), [
    faq('When should an app ask for location permission?', 'At the moment the feature is needed, with a clear reason in the usage description, and for the least access you need. Always handle the case where the person says no.'),
    faq('What is the difference between local and push notifications?', 'A local notification is scheduled by the app on the device with no server. A push notification is sent by your server through Apple\'s APNs service to the device token.'),
    faq('Can I rely on background tasks running at a set time?', 'No. You ask the system, and it decides when, or whether, to run them. Design the app to work correctly even if no background work happened.'),
  ]),

  // ---------------------------------------------------------------- 11
  les(S4, 'storekit-2-vision-avfoundation-and-healthkit-overview', 'Apple Frameworks Tour: StoreKit 2, Vision, AVFoundation and HealthKit', 'StoreKit 2, Vision, AVFoundation, HealthKit',
    'Sell in-app purchases with StoreKit 2, read text from images with Vision, play media with AVFoundation, and learn the permission rules of HealthKit.', [
    P("Apple provides a framework for nearly every device feature, and job posts list the names: StoreKit, Vision, AVFoundation, HealthKit. You will not master them all, and you do not need to. What you need is to know **what each one is for**, to be able to start one using the documentation, and to know the rules that come with it. This lesson gives a working first step in each of four of the most requested ones."),
    H("StoreKit 2: in-app purchases"),
    P("**StoreKit** lets you sell things inside your app: a one-time unlock, a consumable such as credits, or an auto-renewing subscription. You create the products in App Store Connect with a product id, a price tier and a description. In the app, you fetch them, show them and start the purchase. StoreKit 2 is the Swift-first version that uses async/await."),
    C('swift', S`import StoreKit

@MainActor
@Observable
final class Store {
    private(set) var products: [Product] = []
    private(set) var isPro = false
    private let ids = ["com.example.expensetracker.pro"]

    func loadProducts() async {
        do { products = try await Product.products(for: ids) }
        catch { print("Could not load products:", error) }
    }

    func buy(_ product: Product) async {
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                if case .verified(let transaction) = verification {
                    isPro = true
                    await transaction.finish()
                }
            case .userCancelled, .pending:
                break
            @unknown default:
                break
            }
        } catch {
            print("Purchase failed:", error)
        }
    }

    func refreshEntitlements() async {
        var active = false
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result, ids.contains(transaction.productID) {
                active = true
            }
        }
        isPro = active
    }
}`),
    L("`purchase()` returns a result. Only treat a purchase as real when its `verification` is `.verified`. StoreKit 2 checks Apple's signature for you.", "Call `transaction.finish()` after you have given the person what they bought.", "`Transaction.currentEntitlements` lists what the person owns now. Check it at launch, so a purchase made on another device, or a refund, is reflected.", "Also listen to `Transaction.updates` in a long-running task, to catch purchases that finish later, for example after a *Ask to Buy* approval.", "Test with a **StoreKit configuration file** in Xcode, which pretends to be the store, so you can test purchases, refunds and renewals with no real money. Then test with a Sandbox account before release."),
    N("Apple's guidelines say what you must offer and show for purchases and subscriptions. Examples are a *Restore Purchases* path, clear price and renewal text, and rules about which things must use in-app purchase. Read the current guideline on in-app purchase before you design the screen, because rules and fees change."),
    H("Vision: reading what is in an image"),
    P("**Vision** analyses images on the device: text, faces, barcodes, body poses and more. Nothing needs to be sent to a server, which is good for privacy and works offline. Here is text recognition, the *scan a receipt* feature that fits our Expense Tracker."),
    C('swift', S`import Vision
import UIKit

func recognizeText(in image: UIImage) async throws -> [String] {
    guard let cgImage = image.cgImage else { return [] }

    return try await withCheckedThrowingContinuation { continuation in
        let request = VNRecognizeTextRequest { request, error in
            if let error { continuation.resume(throwing: error); return }
            let observations = request.results as? [VNRecognizedTextObservation] ?? []
            let lines = observations.compactMap { $0.topCandidates(1).first?.string }
            continuation.resume(returning: lines)
        }
        request.recognitionLevel = .accurate

        DispatchQueue.global(qos: .userInitiated).async {
            let handler = VNImageRequestHandler(cgImage: cgImage)
            do { try handler.perform([request]) }
            catch { continuation.resume(throwing: error) }
        }
    }
}`),
    P("This also shows a useful pattern. Vision uses a completion handler, an older style, so we wrap it in `withCheckedThrowingContinuation` to make it `async`. You will do the same with many older Apple APIs. The continuation must be resumed **exactly once**. The result is a list of text lines. Finding the *total* in a receipt from those lines is your own logic, and you should always let the user check and correct what was read."),
    H("AVFoundation: audio, video and the camera"),
    P("**AVFoundation** is the large framework for media. At the simplest level, playing a video in SwiftUI takes a few lines with `AVKit`."),
    C('swift', S`import AVKit
import SwiftUI

struct PlayerScreen: View {
    let url: URL
    @State private var player: AVPlayer?

    var body: some View {
        VideoPlayer(player: player)
            .onAppear { player = AVPlayer(url: url) }
            .onDisappear { player?.pause() }
    }
}`),
    L("**Playing sound:** `AVAudioPlayer` for short files, `AVPlayer` for streams and video.", "**Audio sessions:** `AVAudioSession` tells the system whether your app should play over other music, mute with the silent switch, or record.", "**The camera:** `AVCaptureSession` with an input and an output gives full control, and needs `NSCameraUsageDescription`. If you only need a photo, the system's `PhotosPicker` and camera picker are much simpler, and need less permission."),
    H("HealthKit"),
    P("**HealthKit** reads and writes health data that the person keeps on the device, such as steps, sleep and workouts. The rules are the strictest of the frameworks here. You add the HealthKit capability, write a usage description that says exactly why you read each type, and ask for each kind of data separately. The person may allow some and not others, and your app cannot even tell whether *reading* was denied. Apple's guidelines restrict how health data may be used, for example it must not be used for advertising, so read them before you design a feature."),
    C('swift', S`import HealthKit

func requestStepAccess() async throws {
    guard HKHealthStore.isHealthDataAvailable() else { return }
    let store = HKHealthStore()
    let steps = HKQuantityType(.stepCount)
    try await store.requestAuthorization(toShare: [], read: [steps])
}`),
    H("How to learn a new framework"),
    O("Read the framework's overview page and look for a sample app from Apple.", "Add the capability and usage description first. Many first-run crashes are a missing description.", "Get the smallest result working, like one marker or one text line, before you design the screen.", "Wrap the framework in your own small type, as with `Store` above, so the rest of the app does not depend on its details and you can fake it in tests."),
    H("Common mistakes"),
    L("Granting a purchase without checking `.verified`.", "A purchase flow with no *Restore Purchases* option.", "Resuming a continuation twice, or never. Both are bugs.", "Collecting health or location data you do not need."),
    ...task("Create a StoreKit configuration file with one non-consumable product, run the `Store` class and buy it in the Simulator.", "Add a *Restore Purchases* button that calls `AppStore.sync()` and then refreshes the entitlements.", "Use `recognizeText(in:)` on a photo of a printed receipt and list the lines in a `List`.", "Write one sentence for each framework in this lesson: what it is for, and one rule that comes with it."),
    ...check("The purchase works in the configuration file and `isPro` stays on after relaunch.", "The recognised lines appear, and you can correct them by hand.", "You can explain why a continuation must be resumed exactly once."),
  ], A('A purchase', [
    n('ui', 'Paywall', 'shows the product', 0, 0, 'app'), n('sk', 'StoreKit 2', 'purchase()', 1, 0, 'tool'),
    n('ver', 'Verified?', 'Apple signature', 2, 0, 'check'), n('unlock', 'Unlock Pro', 'then finish()', 3, 0, 'out'),
  ], [
    { say: 'Your screen shows the product fetched from the App Store.', on: ['ui'] },
    { say: 'The person taps Buy, and StoreKit starts the purchase.', flow: ['ui>sk:purchase'] },
    { say: 'The result carries a verification. Only a verified transaction counts.', flow: ['sk>ver:result'] },
    { say: 'You unlock the feature and call finish(). At each launch, currentEntitlements keeps it right.', flow: ['ver>unlock:verified'] },
  ]), [
    faq('What is StoreKit 2?', 'Apple\'s Swift-first framework for in-app purchases and subscriptions, using async/await. You fetch products, call purchase(), check that the result is verified, and read Transaction.currentEntitlements to know what the person owns.'),
    faq('How do I test in-app purchases without real money?', 'Use a StoreKit configuration file in Xcode to simulate the store, and later a Sandbox account on a real device. Test purchases, cancellations, refunds and renewals.'),
    faq('Does Vision send images to a server?', 'No. Vision analyses images on the device, which helps privacy and works offline. You still need to tell users what you do with any result you store.'),
  ]),
];
