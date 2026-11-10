import SwiftUI

@main
struct JobsApp: App {
    var body: some Scene {
        WindowGroup {
            // FakeJobService runs with no backend. Use RemoteJobService(baseURL:) for your own server.
            JobListView(service: FakeJobService())
        }
    }
}
