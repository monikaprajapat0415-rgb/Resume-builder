import Foundation
import Observation

@Observable
@MainActor
final class ShopViewModel {
    enum State {
        case loading
        case ready([Product])
        case failed(String)
    }

    private(set) var state: State = .loading

    func load() async {
        state = .loading
        do {
            guard let url = URL(string: "https://fakestoreapi.com/products") else { return }
            let (data, response) = try await URLSession.shared.data(from: url)
            if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
                state = .failed("The shop answered with error \(http.statusCode).")
                return
            }
            state = .ready(try JSONDecoder().decode([Product].self, from: data))
        } catch {
            state = .failed("Could not load products. Check your connection and try again.")
        }
    }
}
