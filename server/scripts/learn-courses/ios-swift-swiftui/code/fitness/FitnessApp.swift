import SwiftUI

@main
struct FitnessApp: App {
    var body: some Scene {
        WindowGroup {
            // Use FakeHealthService() in the Simulator, which has no step data.
            FitnessView(service: HealthKitService())
        }
    }
}
