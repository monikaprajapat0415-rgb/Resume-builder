import Foundation
import Observation

@Observable
@MainActor
final class FitnessViewModel {
    enum State {
        case loading
        case ready([DaySteps])
        case failed(String)
    }

    let goal = 8000
    private(set) var state: State = .loading
    private let service: HealthService

    init(service: HealthService) {
        self.service = service
    }

    func load() async {
        state = .loading
        do {
            try await service.requestAccess()
            state = .ready(try await service.lastDays(7))
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    var today: DaySteps? {
        if case .ready(let days) = state { return days.last }
        return nil
    }
}
