import Foundation
import Observation

@Observable
final class CartStore {
    private let defaults: UserDefaults

    private(set) var lines: [CartLine] {
        didSet { save() }
    }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let data = defaults.data(forKey: "cart.v1"),
           let saved = try? JSONDecoder().decode([CartLine].self, from: data) {
            lines = saved
        } else {
            lines = []
        }
    }

    var totalCents: Int { lines.reduce(0) { $0 + $1.lineTotalCents } }
    var itemCount: Int { lines.reduce(0) { $0 + $1.quantity } }

    func add(_ product: Product) {
        if let index = lines.firstIndex(where: { $0.productID == product.id }) {
            lines[index].quantity += 1
        } else {
            lines.append(CartLine(productID: product.id, title: product.title,
                                  priceCents: product.priceCents, quantity: 1))
        }
    }

    func change(_ line: CartLine, by delta: Int) {
        guard let index = lines.firstIndex(where: { $0.productID == line.productID }) else { return }
        lines[index].quantity += delta
        if lines[index].quantity <= 0 { lines.remove(at: index) }
    }

    // Demo only: this clears the cart and takes no payment.
    func placeDemoOrder() {
        lines = []
    }

    private func save() {
        if let data = try? JSONEncoder().encode(lines) {
            defaults.set(data, forKey: "cart.v1")
        }
    }
}
