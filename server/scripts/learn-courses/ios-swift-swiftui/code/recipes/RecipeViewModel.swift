import Foundation
import Observation

@Observable
@MainActor
final class RecipeViewModel {
    enum State: Equatable {
        case idle
        case loading
        case loaded([Recipe])
        case failed(String)
    }

    var query = ""
    private(set) var state: State = .idle
    private let service: RecipeService
    private var searchTask: Task<Void, Never>?

    init(service: RecipeService = MealDBService()) {
        self.service = service
    }

    // Called whenever the search text changes. Waits a moment so we do not call the server on every key.
    func queryChanged() {
        searchTask?.cancel()
        let text = query.trimmingCharacters(in: .whitespaces)
        guard text.count >= 2 else {
            state = .idle
            return
        }
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(400))
            guard !Task.isCancelled else { return }
            await load(text)
        }
    }

    func load(_ text: String) async {
        state = .loading
        do {
            let recipes = try await service.search(text)
            guard !Task.isCancelled else { return }
            state = .loaded(recipes)
        } catch is CancellationError {
            return
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}
