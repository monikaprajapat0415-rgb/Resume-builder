import Testing
import Foundation
@testable import MiniShop

struct ShopTests {
    private func product(_ id: Int, _ price: Double) -> Product {
        Product(id: id, title: "Item \(id)", price: price, description: "", category: "x",
                image: URL(string: "https://example.com/a.png")!)
    }

    // A throwaway store so tests never touch the real saved cart.
    private func store() -> CartStore {
        CartStore(defaults: UserDefaults(suiteName: UUID().uuidString)!)
    }

    @Test func priceBecomesExactCents() {
        #expect(product(1, 109.95).priceCents == 10995)
        #expect(product(2, 0.1).priceCents == 10)
    }

    @Test func addingTwiceRaisesQuantity() {
        let cart = store()
        cart.add(product(1, 10))
        cart.add(product(1, 10))
        #expect(cart.lines.count == 1)
        #expect(cart.itemCount == 2)
        #expect(cart.totalCents == 2000)
    }

    @Test func lessThanOneRemovesTheLine() {
        let cart = store()
        cart.add(product(1, 10))
        cart.change(cart.lines[0], by: -1)
        #expect(cart.lines.isEmpty)
    }

    @Test func moneyFormat() {
        #expect(4990.asMoney == "$49.90")
        #expect(5.asMoney == "$0.05")
    }
}
