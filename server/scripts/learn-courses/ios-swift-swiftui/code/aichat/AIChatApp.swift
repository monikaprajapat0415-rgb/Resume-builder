import SwiftUI

@main
struct AIChatApp: App {
    var body: some Scene {
        WindowGroup {
            // Start with the fake service. Switch to ServerAIService(endpoint: ...)
            // when your own server is ready.
            ChatScreen(service: FakeAIService())
        }
    }
}
